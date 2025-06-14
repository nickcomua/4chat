import { NextRequest, NextResponse } from 'next/server';
import { Effect } from 'effect';
import { generateCouchDBSession, validateCouchDBSession, deleteCouchDBSession } from '@/lib/db/couchdb-session';
import { auth } from '@/lib/auth/auth';
import { NodeSdkLive, runNode } from '@/services/node';

// POST - Create new CouchDB session
export function POST(request: NextRequest) {
    return Effect.gen(function* () {
        const session = yield* Effect.promise(() => auth());
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        yield* Effect.log('sessionServer', session);

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

        yield* Effect.log('sessionDataServer', result);

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
            sameSite: 'lax',
            maxAge: 600,
            path: '/'
        });

        return response;
    }).pipe(Effect.withSpan('session-create'), runNode);
}

// GET - Validate existing CouchDB session
export function GET(request: NextRequest) {
    return Effect.gen(function* () {
        const session = yield* Effect.promise(() => auth());
        yield* Effect.log('sessionServer', session);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }


        // Get session token from cookie
        const sessionToken = request.cookies.get('AuthSession')?.value;
        if (!sessionToken) {
            yield* Effect.logError('No session token found');
            return NextResponse.json({ error: 'No session token found' }, { status: 400 });
        }

        yield* Effect.log('sessionToken', sessionToken);

        const result = yield* validateCouchDBSession(sessionToken).pipe(
            Effect.catchAll(error =>
                Effect.tap(
                    Effect.succeed(null),
                    () => Effect.logError('Error validating CouchDB session:', error)
                )
            )
        );

        yield* Effect.log('sessionDataServer', result);

        if (result === null) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            valid: true,
            sessionData: result
        });
    }).pipe(Effect.withSpan('session-get'), runNode);
}

// DELETE - Delete/logout CouchDB session
export function DELETE(request: NextRequest) {
    return Effect.gen(function* () {
        const session: any = yield* Effect.promise(() => auth());
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get session token from cookie
        const sessionToken = request.cookies.get('AuthSession')?.value;
        if (!sessionToken) {
            return NextResponse.json({ error: 'No session token found' }, { status: 400 });
        }

        const success = yield* deleteCouchDBSession(sessionToken).pipe(
            Effect.catchAll(error =>
                Effect.tap(
                    Effect.succeed(false),
                    () => Effect.fail('Error deleting CouchDB session')
                )
            )
        );

        // Create response
        const response = NextResponse.json({
            success,
            message: success ? 'Session deleted successfully' : 'Failed to delete session'
        });

        // Remove the AuthSession cookie
        response.cookies.delete('AuthSession');

        return response;
    }).pipe(Effect.withSpan('session-delete'), runNode);
} 