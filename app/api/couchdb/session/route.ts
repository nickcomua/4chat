import { NextRequest, NextResponse } from 'next/server';
import { generateCouchDBSession, validateCouchDBSession, deleteCouchDBSession } from '@/lib/couchdb-session';
import { auth } from '@/lib/auth';

// POST - Create new CouchDB session
export async function POST(request: NextRequest) {
    // try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.log('sessionServer', session);
        const sessionData = await generateCouchDBSession(session.user.id.toLowerCase());
        console.log('sessionDataServer', sessionData);
        // Create response with session token
        const response = NextResponse.json({
            success: true,
            sessionToken: sessionData.sessionToken,
            userInfo: sessionData.userInfo
        });

        // Set the AuthSession cookie in the response
        response.cookies.set('AuthSession', sessionData.sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 600, // 10 minutes (CouchDB default)
            path: '/'
        });
        return response;
    // } catch (error) {
    //     console.error('Error creating CouchDB session:', error);
    //     return NextResponse.json(
    //         { error: 'Failed to create session' },
    //         { status: 500 }
    //     );
    // }
}

// GET - Validate existing CouchDB session
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.log('sessionServer', session);
        // Get session token from cookie
        const sessionToken = request.cookies.get('AuthSession')?.value;
        if (!sessionToken) {
            return NextResponse.json({ error: 'No session token found' }, { status: 400 });
        }
        console.log('sessionToken', sessionToken);
        const sessionData = await validateCouchDBSession(sessionToken);
        console.log('sessionDataServer', sessionData);
        if (!sessionData) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            valid: true,
            sessionData
        });
    } catch (error) {
        console.error('Error validating CouchDB session:', error);
        return NextResponse.json(
            { error: 'Failed to validate session' },
            { status: 500 }
        );
    }
}

// DELETE - Delete/logout CouchDB session
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get session token from cookie
        const sessionToken = request.cookies.get('AuthSession')?.value;
        if (!sessionToken) {
            return NextResponse.json({ error: 'No session token found' }, { status: 400 });
        }

        const success = await deleteCouchDBSession(sessionToken);

        // Create response
        const response = NextResponse.json({
            success,
            message: success ? 'Session deleted successfully' : 'Failed to delete session'
        });

        // Remove the AuthSession cookie
        response.cookies.delete('AuthSession');

        return response;
    } catch (error) {
        console.error('Error deleting CouchDB session:', error);
        return NextResponse.json(
            { error: 'Failed to delete session' },
            { status: 500 }
        );
    }
} 