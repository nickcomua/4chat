export const couchdbUrlWeb = process.env.NEXT_PUBLIC_COUCHDB_URL!;
if (!couchdbUrlWeb) {
    throw new Error("COUCHDB_URL environment variable is not set.");
}

export const getUserDbName = (userId: string, dbType: 'chats' | 'messages' | 'profile') => `user_${userId}_${dbType}`;
