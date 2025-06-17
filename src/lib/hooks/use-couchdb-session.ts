import { useEffect, useRef, useState } from 'react';
import type { Session } from 'next-auth';

interface CouchDBSessionData {
    username: string;
    roles: string[];
    authenticated: string;
}

interface UseCouchDBSessionReturn {
    isSessionValid: boolean;
    sessionData: CouchDBSessionData | null;
    isLoading: boolean;
    error: string | null;
    refreshSession: () => Promise<void>;
    clearSession: () => Promise<void>;
}

export const useCouchDBSession = (
    autoRefresh: boolean = true,
    refreshIntervalMs: number = 300000 // 5 minutes
): UseCouchDBSessionReturn => {
    const [isSessionValid, setIsSessionValid] = useState(false);
    const [sessionData, setSessionData] = useState<CouchDBSessionData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Function to create a new CouchDB session
    const createSession = async (): Promise<boolean> => {

        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/couchdb/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // body: JSON.stringify({ authUserId: authSession.user.id })
            });

            if (response.ok) {
                const data = await response.json();
                setIsSessionValid(true);
                setSessionData({
                    username: data.userInfo.name,
                    roles: data.userInfo.roles || [],
                    authenticated: 'cookie'
                });
                return true;
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to create session');
                setIsSessionValid(false);
                setSessionData(null);
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            setIsSessionValid(false);
            setSessionData(null);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Function to validate existing CouchDB session
    const validateSession = async (): Promise<boolean> => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_COUCHDB_URL}/_session`, {
                method: 'GET',
                credentials: "same-origin",
            });

            if (response.ok) {
                const data = await response.json();
                if (data.ok && data.userCtx.name) {
                    setIsSessionValid(true);
                    setSessionData({
                        username: data.userCtx.name,
                        roles: data.userCtx.roles,
                        authenticated: 'cookie'
                    });
                    setError(null);
                    return true;
                }
            }

            // If validation fails, try to create a new session
            return await createSession();
        } catch (err) {
            // If validation fails, try to create a new session
            return await createSession();
        }
    };

    // Function to refresh session (exposed to component)
    const refreshSession = async (): Promise<void> => {
        await createSession();
    };

    // Function to clear session
    const clearSession = async (): Promise<void> => {
        try {
            await fetch('/api/couchdb/session', {
                method: 'DELETE'
            });
        } catch (err) {
            console.error('Error clearing CouchDB session:', err);
        } finally {
            setIsSessionValid(false);
            setSessionData(null);
            setError(null);
        }
    };

    // Setup auto-refresh interval
    useEffect(() => {
        if (autoRefresh && isSessionValid) {
            intervalRef.current = setInterval(async () => {
                console.log('Auto-refreshing CouchDB session...');
                await createSession();
            }, refreshIntervalMs);

            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        }
    }, [autoRefresh, isSessionValid, refreshIntervalMs]);

    // Initialize session when auth session is available
    useEffect(() => {
        validateSession();
    }, []);

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return {
        isSessionValid,
        sessionData,
        isLoading,
        error,
        refreshSession,
        clearSession
    };
}; 