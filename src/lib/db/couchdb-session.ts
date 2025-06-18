import { Effect } from 'effect';
import { getUserCredentials } from './user-db';

// Session data interfaces
export interface CouchDBSessionInfo {
    readonly sessionToken: string;
    readonly userInfo: {
        readonly name: string;
        readonly roles: readonly string[];
    };
    readonly cookieHeader: string;
}

export interface CouchDBSessionData {
    readonly username: string;
    readonly roles: readonly string[];
    readonly authenticated: string;
}

// Helper to get session URL
const getSessionUrl = () => {
    const couchdbUrl = process.env.NEXT_PUBLIC_COUCHDB_URL;
    if (!couchdbUrl) {
        throw new Error("NEXT_PUBLIC_COUCHDB_URL environment variable is not set");
    }
    return `${couchdbUrl}/_session`;
};

// Generate CouchDB session
export function generateCouchDBSession(authUserId: string) {
    return Effect.gen(function* () {
        console.log('Generating session for authUserId:', authUserId);

        // Get user credentials from the database
        const credentials: { username: string; password: string } = yield* getUserCredentials(authUserId).pipe(
            Effect.catchAll((e) => Effect.fail(
                {
                    _tag: "SessionGenerationError" as const, error: e.error.message
                }
            )),
            Effect.withSpan('get-user-credentials')
        );

        console.log('Retrieved credentials for user:', credentials.username);

        const sessionUrl = getSessionUrl();

        // Make request to CouchDB /_session endpoint
        const response: Response = yield* Effect.tryPromise({
            try: () => fetch(sessionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: credentials.username,
                    password: credentials.password
                })
            }),
            catch: error => ({ _tag: "SessionGenerationError" as const, error:
                'Failed to make session request to CouchDB'
            })
        }).pipe(Effect.withSpan('couchdb-session-request'));

        if (!response.ok) {
            const errorText = yield* Effect.tryPromise({
                try: () => response.text(),
                catch: () => 'Unknown error'
            });
            return yield* Effect.fail({ _tag: "SessionGenerationError" as const, error:
                `Failed to create CouchDB session: ${response.status} ${response.statusText} - ${errorText}`
            });
        }

        // Extract the session cookie from response headers
        const setCookieHeader = response.headers.get('set-cookie');
        if (!setCookieHeader) {
            return yield* Effect.fail({ _tag: "SessionGenerationError" as const, error: 'No session cookie received from CouchDB' });
        }

        // Parse the AuthSession cookie value
        const authSessionMatch = setCookieHeader.match(/AuthSession=([^;]+)/);
        if (!authSessionMatch) {
            return yield* Effect.fail({ _tag: "SessionGenerationError" as const, error: 'AuthSession cookie not found in response' });
        }

        const sessionToken = authSessionMatch[1];
        const responseData = yield* Effect.tryPromise({
            try: () => response.json(),
            catch: error => ({ _tag: "SessionGenerationError" as const, error:
                'Failed to parse session response JSON'
            })
        }).pipe(Effect.withSpan('parse-session-response'));

        return {
            sessionToken,
            userInfo: {
                name: (responseData as any).name || credentials.username,
                roles: (responseData as any).roles || []
            },
            cookieHeader: setCookieHeader
        };
    }).pipe(Effect.withSpan('couchdb-session-generate'));
}

// Validate existing CouchDB session
export function validateCouchDBSession(sessionToken: string) {
    return Effect.gen(function* () {
        const sessionUrl = getSessionUrl();
        yield* Effect.log('sessionUrl', document);
        const response = yield* Effect.tryPromise({
            try: () => fetch(sessionUrl, {
                method: 'GET',
                credentials: "same-origin",
                headers: {
                    'Accept': 'application/json',
                    'Cookie': `AuthSession=${sessionToken}`
                }
            }),
            catch: error => ({ _tag: "SessionValidationError" as const, error:
                'Failed to validate session with CouchDB'
            })
        }).pipe(Effect.withSpan('couchdb-validate-request'));

        if (!response.ok) {
            return null;
        }

        const sessionData = yield* Effect.tryPromise({
            try: () => response.json(),
            catch: error => ({ _tag: "SessionValidationError" as const, error:
                'Failed to parse session validation response'
            })
        }).pipe(Effect.withSpan('parse-validation-response'));

        // Check if user is authenticated
        const data = sessionData as any;
        yield* Effect.log('sessionDataValidate', data);
        if (data.userCtx && data.userCtx.name) {
            return {
                username: data.userCtx.name,
                roles: data.userCtx.roles || [],
                authenticated: data.info?.authenticated || 'cookie'
            };
        }

        return null;
    }).pipe(
        Effect.catchTag("SessionValidationError", () => Effect.succeed(null)),
        Effect.withSpan('couchdb-session-validate')
    );
}

// Delete/logout CouchDB session
export function deleteCouchDBSession(sessionToken: string) {
    return Effect.gen(function* () {
        const sessionUrl = getSessionUrl();

        const response = yield* Effect.tryPromise({
            try: () => fetch(sessionUrl, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Cookie': `AuthSession=${sessionToken}`
                }
            }),
            catch: error => ({ _tag: "SessionDeletionError" as const, error:
                'Failed to delete session from CouchDB'
            })
        }).pipe(Effect.withSpan('couchdb-delete-request'));

        return response.ok;
    }).pipe(
        Effect.catchTag("SessionDeletionError", () => Effect.succeed(false)),
        Effect.withSpan('couchdb-session-delete')
    );
}