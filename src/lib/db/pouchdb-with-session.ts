import PouchDB from 'pouchdb';

// Utility to get session token from cookies (client-side)
const getSessionTokenFromCookies = (): string | null => {
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
};

// Utility to get session token from request headers (server-side)
const getSessionTokenFromHeaders = (headers?: Headers): string | null => {
    if (!headers) {
        return null;
    }

    const cookieHeader = headers.get('cookie');
    if (!cookieHeader) {
        return null;
    }

    const cookies = cookieHeader.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'AuthSession') {
            return value;
        }
    }
    return null;
};

// Enhanced PouchDB factory that automatically includes session authentication
export const createPouchDBWithSession = (
    dbUrl: string,
    options: PouchDB.Configuration.DatabaseConfiguration & { headers?: any } = {},
    sessionToken?: string
): PouchDB.Database => {
    // Get session token from various sources
    const token = sessionToken || 
                  getSessionTokenFromCookies() || 
                  (typeof window !== 'undefined' ? null : getSessionTokenFromHeaders(options.headers as Headers));

    if (token) {
        // Add session cookie to headers
        const headers = {
            ...options.headers,
            'Cookie': `AuthSession=${token}`
        };

        return new PouchDB(dbUrl, {
            ...options,
            headers
        } as any);
    }

    // Fallback to regular PouchDB if no session token
    return new PouchDB(dbUrl, options);
};

// Enhanced version of getUserDb that uses session authentication
export const getUserDbWithSession = (
    userId: string, 
    dbType: 'chats' | 'messages' | 'profile',
    sessionToken?: string
): PouchDB.Database => {
    const couchdbUrl = process.env.COUCHDB_URL || process.env.NEXT_PUBLIC_COUCHDB_URL;
    if (!couchdbUrl) {
        throw new Error("COUCHDB_URL environment variable is not set.");
    }

    // Remove credentials from URL since we're using session authentication
    const url = new URL(couchdbUrl);
    const baseUrl = `${url.protocol}//${url.host}`;
    const dbName = `user_${userId}_${dbType}`;
    const dbUrl = `${baseUrl}/${dbName}`;

    return createPouchDBWithSession(dbUrl, {}, sessionToken);
};

// Utility to refresh PouchDB instance with new session token
export const refreshPouchDBSession = (
    db: PouchDB.Database,
    newSessionToken: string
): PouchDB.Database => {
    // Get the database name from the existing instance
    const dbName = (db as any).name;
    
    // Close the existing connection
    db.close();
    
    // Create a new instance with the updated session token
    return createPouchDBWithSession(dbName, {}, newSessionToken);
};

// Hook for React components to get PouchDB instances with automatic session management
export const usePouchDBWithSession = (
    userId: string,
    dbType: 'chats' | 'messages' | 'profile'
) => {
    // This would typically be used with the CouchDB session context
    // Example usage in a React component:
    /*
    const { isSessionValid, sessionData } = useCouchDBSessionContext();
    const db = useMemo(() => {
        if (isSessionValid && sessionData) {
            return getUserDbWithSession(userId, dbType);
        }
        return null;
    }, [isSessionValid, sessionData, userId, dbType]);
    */
    
    return {
        getUserDbWithSession: (token?: string) => getUserDbWithSession(userId, dbType, token),
        createPouchDBWithSession: (dbUrl: string, token?: string) => createPouchDBWithSession(dbUrl, {}, token)
    };
};

// Middleware function to add session authentication to existing PouchDB instances
export const addSessionAuth = (db: PouchDB.Database, sessionToken: string): void => {
    // Add session cookie to all requests
    (db as any).fetch = (url: string, opts: any = {}) => {
        const headers = {
            ...opts.headers,
            'Cookie': `AuthSession=${sessionToken}`
        };

        return fetch(url, {
            ...opts,
            headers
        });
    };
}; 