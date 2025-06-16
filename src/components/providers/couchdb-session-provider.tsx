import React, { createContext, useContext, ReactNode } from 'react';
import { useCouchDBSession } from '@/lib/hooks/use-couchdb-session';

interface CouchDBSessionData {
    username: string;
    roles: string[];
    authenticated: string;
}

interface CouchDBSessionContextType {
    isSessionValid: boolean;
    sessionData: CouchDBSessionData | null;
    isLoading: boolean;
    error: string | null;
    refreshSession: () => Promise<void>;
    clearSession: () => Promise<void>;
}

const CouchDBSessionContext = createContext<CouchDBSessionContextType | undefined>(undefined);

interface CouchDBSessionProviderProps {
    children: ReactNode;
    authSession?: any; // Auth.js session object
    autoRefresh?: boolean;
    refreshIntervalMs?: number;
}

export const CouchDBSessionProvider: React.FC<CouchDBSessionProviderProps> = ({
    children,
    // authSession,
    autoRefresh = true,
    refreshIntervalMs = 300000 // 5 minutes
}) => {
    const sessionData = useCouchDBSession(autoRefresh, refreshIntervalMs);
    return (
        <CouchDBSessionContext.Provider value={sessionData}>
            {children}
        </CouchDBSessionContext.Provider>
    );
};

export const useCouchDBSessionContext = (): CouchDBSessionContextType => {
    const context = useContext(CouchDBSessionContext);
    if (context === undefined) {
        throw new Error('useCouchDBSessionContext must be used within a CouchDBSessionProvider');
    }
    return context;
};

// Optional: Session status indicator component
export const CouchDBSessionStatus: React.FC = () => {
    const { isSessionValid, sessionData, isLoading, error } = useCouchDBSessionContext();

    if (isLoading) {
        return (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span>Connecting to CouchDB...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center space-x-2 text-sm text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>CouchDB Error: {error}</span>
            </div>
        );
    }

    if (isSessionValid && sessionData) {
        return (
            <div className="flex items-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Connected as {sessionData.username}</span>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span>CouchDB Disconnected</span>
        </div>
    );
}; 