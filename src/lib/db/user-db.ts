import PouchDB from "pouchdb-browser";
import find from "pouchdb-find";
import { Effect } from "effect";
import { getUserDbName } from "./common";
import { ChatSettings, defaultChatSettings } from "@/lib/types/settings";
import { Profile } from "next-auth";
import { couchdbUrlNode } from "./node";

PouchDB.plugin(find);


const couchdbUser = process.env.COUCHDB_USER;
const couchdbPassword = process.env.COUCHDB_PASSWORD;
if (!couchdbUrlNode || !couchdbUser || !couchdbPassword) {
    throw new Error("COUCHDB_URL environment variable is not set.");
}

const couchdbUrl = `${couchdbUrlNode.split('//')[0]}//${couchdbUser}:${couchdbPassword}@${couchdbUrlNode.split('//')[1]}`;
console.log('couchdbUrl', couchdbUrl);
// Function to get database name for a user

export const authJsDb =
    //   global.pouchdb ||
    new PouchDB(couchdbUrl + "/auth_db", {
        // The adapter expects a PouchDB instance, not a URL string.
        // The auth details are part of the URL for PouchDB.
        // e.g., http://user:pass@host:port/db
        // skip_setup: true, // Recommended for performance
    });
console.log(`${couchdbUrl}/_users`)
export const userDb = new PouchDB(`${couchdbUrl}/_users`)
// Function to create a CouchDB user
export const createCouchDBUser = Effect.fn("createCouchDBUser")(function* (userId: string, password: string) {
    yield* Effect.tryPromise({
        try: () => userDb.put({
            _id: `org.couchdb.user:${userId}`,
            name: userId,
            password,
            roles: [],
            type: 'user'
        }),
        catch: error => ({ _tag: "CreateUserError" as const, error: error as PouchDB.Core.Error })
    });

    return true;
});

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
export function initializeUserDatabases(userId: string, profile: Profile) {
    return Effect.gen(function* () {
        // First create a CouchDB user with a random password
        const genPassword = () => Math.random().toString(36).slice(-8);
        const password = genPassword() + genPassword() + genPassword() + genPassword(); // 4 level of security =)
        yield* createCouchDBUser(userId, password)

        // Create databases for the user
        const dbs = ['chats', 'messages', 'profile'] as const;

        for (const dbType of dbs) {
            const db = getUserDb(userId, dbType);

            // Create the database
            yield* Effect.tryPromise({
                try: () => db.info(),
                catch: error => ({ _tag: "DatabaseInfoError" as const, error })
            });

            // Set up security for the database to only allow access to this user
            // This requires admin privileges in CouchDB
            yield* Effect.tryPromise({
                try: () => fetch(`${couchdbUrl.split('//')[0]}//${couchdbUrl.split('@')[1]}/${getUserDbName(userId, dbType)}/_security`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${Buffer.from(`${couchdbUser}:${couchdbPassword}`).toString('base64')}` // @TODO: remove get from env
                    },
                    body: JSON.stringify({
                        members: {
                            names: [userId],
                            roles: []
                        },
                        admins: {
                            names: [userId],
                            roles: []
                        }
                    })
                }),
                catch: error => ({ _tag: "SecuritySetupError" as const, error })
            });

            if (dbType === 'profile') {
                yield* Effect.tryPromise({
                    try: () => (db as PouchDB.Database<ChatSettings>).put({
                        ...defaultChatSettings,
                        userProfile: {
                            name: profile.name ?? "",
                            email: profile.email ?? "",
                            userId: userId,
                            profilePicture: profile.picture?.toString() ?? "",
                            plan: "free"
                        }
                    }),
                    catch: error => ({ _tag: "ChatSettingsSetupError" as const, error })
                })
            }
        }

        // Return the credentials so they can be stored if needed
        return {
            username: userId,
            password
        };
    }).pipe(
        Effect.withSpan("initializeUserDatabases", {
            attributes: {
                userId
            }
        }))
}

// Function to delete user databases (for account deletion)
export function deleteUserDatabases(userId: string) {
    return Effect.gen(function* () {
        const dbs = ['chats', 'messages', 'profile'] as const;

        for (const dbType of dbs) {
            const db = getUserDb(userId, dbType);
            yield* Effect.tryPromise({
                try: () => db.destroy(),
                catch: error => ({ _tag: "DeleteDatabaseError" as const, error })
            });
        }

        return true;
    });
}

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
export function storeUserCredentials(authUserId: string, couchDbCreds: { username: string; password: string; }) {
    return Effect.gen(function* () {
        yield* Effect.tryPromise({
            try: () => userCredsDb.put({
                _id: authUserId,
                ...couchDbCreds,
                type: 'user_credentials',
                createdAt: new Date().toISOString()
            }),
            catch: error => ({ _tag: "StoreCredentialsError" as const, error })
        });
        return true;
    });
}

// Function to get CouchDB credentials for an Auth.js user
export function getUserCredentials(authUserId: string) {
    return Effect.gen(function* () {
        const doc = yield* Effect.tryPromise({
            try: () => userCredsDb.get<UserCredentialsDoc>(authUserId),
            catch: error => ({ _tag: "GetCredentialsError" as const, error: error as PouchDB.Core.Error })
        });
        return {
            username: doc.username,
            password: doc.password
        };
    });
} 