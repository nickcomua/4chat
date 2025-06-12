import PouchDB from "pouchdb";
import find from "pouchdb-find";

PouchDB.plugin(find);

const couchdbUrlBase = process.env.COUCHDB_URL;
const couchdbUser = process.env.COUCHDB_USER;
const couchdbPassword = process.env.COUCHDB_PASSWORD;
if (!couchdbUrlBase || !couchdbUser || !couchdbPassword) {
    throw new Error("COUCHDB_URL environment variable is not set.");
}

const couchdbUrl = `${couchdbUrlBase.split('//')[0]}//${couchdbUser}:${couchdbPassword}@${couchdbUrlBase.split('//')[1]}`;
console.log('couchdbUrl', couchdbUrl);
// Function to get database name for a user
export const getUserDbName = (userId: string, dbType: 'chats' | 'messages' | 'profile') => {
    return `user_${userId}_${dbType}`;
};
export const authJsDb =
//   global.pouchdb ||
new PouchDB(couchdbUrl + "/auth_db", {
  // The adapter expects a PouchDB instance, not a URL string.
  // The auth details are part of the URL for PouchDB.
  // e.g., http://user:pass@host:port/db
  // skip_setup: true, // Recommended for performance
});
export const userDb = new PouchDB(`${couchdbUrl}/_users`)
// Function to create a CouchDB user
export const createCouchDBUser = async (userId: string, password: string) => {
    try {
        await userDb.put({
            _id: `org.couchdb.user:${userId}`,
            name: userId,
            password,
            roles: [],
            type: 'user'
        })

        return true;
    } catch (error) {
        console.error('Error creating CouchDB user:', error);
        throw error;
    }
};

// Function to get or create a user-specific database
export const getUserDb = (userId: string, dbType: 'chats' | 'messages' | 'profile') => {
    const dbName = getUserDbName(userId, dbType);
    return new PouchDB(`${couchdbUrl}/${dbName}`, {
        // The adapter expects a PouchDB instance, not a URL string
        // The auth details are part of the URL for PouchDB
        // e.g., http://user:pass@host:port/db
    });
};

// Function to initialize databases for a new user
export const initializeUserDatabases = async (userId: string) => {
    try {
        // First create a CouchDB user with a random password
        const genPassword = () => Math.random().toString(36).slice(-8);
        const password = genPassword() + genPassword() + genPassword() + genPassword(); // 4 level of security =)
        await createCouchDBUser(userId, password);

        // Create databases for the user
        const dbs = ['chats', 'messages', 'profile'] as const;

        for (const dbType of dbs) {
            const db = getUserDb(userId, dbType);

            // Create the database
            await db.info();

            // Set up security for the database to only allow access to this user
            // This requires admin privileges in CouchDB

            await fetch(`${couchdbUrl.split('//')[0]}//${couchdbUrl.split('@')[1]}/${getUserDbName(userId, dbType)}/_security`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`admin:admin`).toString('base64')}` // @TODO: remove get from env
                },
                body: JSON.stringify({
                    members: {
                        names: [userId],
                        roles: []
                    },
                    admins: {
                        names: [userId, 'admin'], // @TODO: remove admin
                        roles: []
                    }
                })
            });
        }

        // Return the credentials so they can be stored if needed
        return {
            username: userId,
            password
        };
    } catch (error) {
        console.error('Error initializing user databases:', error);
        throw error;
    }
};

// Function to delete user databases (for account deletion)
export const deleteUserDatabases = async (userId: string) => {
    try {
        const dbs = ['chats', 'messages', 'profile'] as const;

        for (const dbType of dbs) {
            const db = getUserDb(userId, dbType);
            await db.destroy();
        }

        return true;
    } catch (error) {
        console.error('Error deleting user databases:', error);
        throw error;
    }
};

// Interface for user credentials document
interface UserCredentialsDoc {
    _id: string;
    username: string;
    password: string;
    type: 'user_credentials';
    createdAt: string;
}

// Create a PouchDB instance for storing user credentials
const userCredsDb = new PouchDB<UserCredentialsDoc>(`${couchdbUrl}/user_credentials`, {
    // The adapter expects a PouchDB instance, not a URL string
    // The auth details are part of the URL for PouchDB
    // e.g., http://user:pass@host:port/db
});

// Function to store CouchDB credentials for an Auth.js user
export const storeUserCredentials = async (authUserId: string, couchDbCreds: { username: string; password: string }) => {
    try {
        await userCredsDb.put({
            _id: authUserId,
            ...couchDbCreds,
            type: 'user_credentials',
            createdAt: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error('Error storing user credentials:', error);
        throw error;
    }
};

// Function to get CouchDB credentials for an Auth.js user
export const getUserCredentials = async (authUserId: string) => {
    // try {
        const doc = await userCredsDb.get<UserCredentialsDoc>(authUserId);
        return {
            username: doc.username,
            password: doc.password
        };
    // } catch (error) {
    //     console.error('Error getting user credentials:', error);
    //     throw error;
    // }
}; 