import { getUserCredentials } from './user-db';

const couchdbUrl = process.env.COUCHDB_URL;
if (!couchdbUrl) {
    throw new Error("COUCHDB_URL environment variable is not set.");
}

// Extract the base URL without credentials for session endpoint
const getSessionUrl = () => {
    const url = new URL(couchdbUrl!);
    return `${url.protocol}//${url.host}/_session`;
};

// Server-side function to generate CouchDB session token
export const generateCouchDBSession = async (authUserId: string) => {
    // try {
        // Get user credentials from the database
        console.log('authUserId', authUserId)
        const credentials = await getUserCredentials(authUserId);
        console.log('credentials', credentials)
        // Make request to CouchDB /_session endpoint
        const sessionUrl = getSessionUrl();
        const response = await fetch(sessionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: credentials.username,
                password: credentials.password
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create CouchDB session: ${response.status} ${response.statusText} - ${errorText}`);
        }

        // Extract the session cookie from response headers
        const setCookieHeader = response.headers.get('set-cookie');
        if (!setCookieHeader) {
            throw new Error('No session cookie received from CouchDB');
        }

        // Parse the AuthSession cookie value
        const authSessionMatch = setCookieHeader.match(/AuthSession=([^;]+)/);
        if (!authSessionMatch) {
            throw new Error('AuthSession cookie not found in response');
        }

        const sessionToken = authSessionMatch[1];
        const responseData = await response.json();

        return {
            sessionToken,
            userInfo: responseData,
            cookieHeader: setCookieHeader
        };
    // } catch (error) {
    //     console.error('Error generating CouchDB session:', error);
    //     throw error;
    // }
};

// Server-side function to validate existing session
export const validateCouchDBSession = async (sessionToken: string) => {
    try {
        const sessionUrl = getSessionUrl();
        const response = await fetch(sessionUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cookie': `AuthSession=${sessionToken}`
            }
        });

        if (!response.ok) {
            return null;
        }

        const sessionData = await response.json();
        
        // Check if user is authenticated
        if (sessionData.userCtx && sessionData.userCtx.name) {
            return {
                username: sessionData.userCtx.name,
                roles: sessionData.userCtx.roles || [],
                authenticated: sessionData.info?.authenticated || 'unknown'
            };
        }

        return null;
    } catch (error) {
        console.error('Error validating CouchDB session:', error);
        return null;
    }
};

// Server-side function to delete/logout session
export const deleteCouchDBSession = async (sessionToken: string) => {
    try {
        const sessionUrl = getSessionUrl();
        const response = await fetch(sessionUrl, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Cookie': `AuthSession=${sessionToken}`
            }
        });

        return response.ok;
    } catch (error) {
        console.error('Error deleting CouchDB session:', error);
        return false;
    }
};

// Client-side utilities for cookie management
export const CouchDBSessionClient = {
    // Set the session cookie in the browser
    setSessionCookie: (sessionToken: string, options: {
        maxAge?: number;
        path?: string;
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
    } = {}) => {
        if (typeof document === 'undefined') {
            throw new Error('setSessionCookie can only be called in the browser');
        }

        const {
            maxAge = 600, // 10 minutes default (CouchDB default)
            path = '/',
            httpOnly = false, // Can't set httpOnly from client-side
            secure = window.location.protocol === 'https:',
            sameSite = 'lax'
        } = options;

        let cookieString = `AuthSession=${sessionToken}; Path=${path}; Max-Age=${maxAge}; SameSite=${sameSite}`;
        
        if (secure) {
            cookieString += '; Secure';
        }

        document.cookie = cookieString;
    },

    // Get the session cookie from the browser
    getSessionCookie: (): string | null => {
        if (typeof document === 'undefined') {
            return null;
        }

        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'AuthSession') {
                return value;
            }
        }
        return null;
    },

    // Remove the session cookie
    removeSessionCookie: () => {
        if (typeof document === 'undefined') {
            return;
        }

        document.cookie = 'AuthSession=; Path=/; Max-Age=0';
    },

    // Auto-refresh session token before expiration
    autoRefreshSession: async (authUserId: string, refreshIntervalMs: number = 300000) => { // 5 minutes default
        if (typeof window === 'undefined') {
            throw new Error('autoRefreshSession can only be called in the browser');
        }

        const refreshSession = async () => {
            try {
                const response = await fetch('/api/couchdb/session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ authUserId })
                });

                if (response.ok) {
                    const data = await response.json();
                    CouchDBSessionClient.setSessionCookie(data.sessionToken);
                    console.log('CouchDB session refreshed successfully');
                } else {
                    console.error('Failed to refresh CouchDB session');
                }
            } catch (error) {
                console.error('Error refreshing CouchDB session:', error);
            }
        };

        // Initial session creation
        await refreshSession();

        // Set up auto-refresh interval
        const intervalId = setInterval(refreshSession, refreshIntervalMs);

        // Return cleanup function
        return () => {
            clearInterval(intervalId);
        };
    }
}; 