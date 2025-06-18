import { NextRequest, NextResponse } from 'next/server';
import { Effect } from 'effect';
import { generateCouchDBSession } from '@/lib/db/couchdb-session';
import { auth } from '@/lib/auth/auth';
import { runNode } from '@/lib/services/node';
import { couchdbUrlWeb } from '@/lib/db/common';
// POST - Create new CouchDB session
export function POST(request: NextRequest) {
    return Effect.gen(function* () {
        const session = yield* Effect.promise(() => auth());
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }


        const result = yield* generateCouchDBSession(session.user.id.toLowerCase()).pipe(
            Effect.catchAll(e =>
                Effect.tap(
                    Effect.succeed(NextResponse.json(
                        { error: 'Failed to create session' },
                        { status: 500 }
                    )), () => Effect.logError(e))
            )
        );

        // If error response, return early
        if (result instanceof NextResponse) {
            return result;
        }

        // Create response with session token
        const response = NextResponse.json({
            success: true,
            sessionToken: result.sessionToken,
            userInfo: result.userInfo
        });

        // Set the AuthSession cookie in the response
        response.cookies.set('AuthSession', result.sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            domain: new URL(couchdbUrlWeb).hostname,
            sameSite: 'lax',
            maxAge: 600,
            path: '/'
        });

        return response;
    }).pipe(Effect.withSpan('session-create'), runNode);
}