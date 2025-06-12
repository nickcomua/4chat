# CouchDB Session Authentication System

This system provides automatic CouchDB session token management for authenticated users, implementing the [CouchDB Cookie Authentication](https://docs.couchdb.org/en/stable/api/server/authn.html#cookie-authentication) protocol.

## Overview

The system consists of several components that work together to provide seamless CouchDB authentication:

1. **Server-side session management** (`lib/couchdb-session.ts`)
2. **API endpoints** (`app/api/couchdb/session/route.ts`)
3. **React hooks** (`hooks/use-couchdb-session.ts`)
4. **Context provider** (`components/couchdb-session-provider.tsx`)
5. **PouchDB integration** (`lib/pouchdb-with-session.ts`)

## Features

- ✅ Automatic session token generation using CouchDB `/_session` endpoint
- ✅ Auto-refresh tokens before expiration (default: every 5 minutes)
- ✅ Secure HTTP-only cookies for session storage
- ✅ React hooks for easy integration
- ✅ PouchDB integration with automatic session authentication
- ✅ Session validation and cleanup
- ✅ Error handling and retry logic

## Setup

### 1. Environment Variables

Ensure your `COUCHDB_URL` environment variable is set:

```env
COUCHDB_URL=http://admin:password@localhost:5984
```

### 2. Wrap Your App with the Session Provider

```tsx
// app/layout.tsx or your root component
import { CouchDBSessionProvider } from '@/components/couchdb-session-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <SessionProvider> {/* Your Auth.js provider */}
          <CouchDBSessionProvider autoRefresh={true} refreshIntervalMs={300000}>
            {children}
          </CouchDBSessionProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
```

## Usage

### Basic Hook Usage

```tsx
import { useCouchDBSession } from '@/hooks/use-couchdb-session';

function MyComponent() {
  const { 
    isSessionValid, 
    sessionData, 
    isLoading, 
    error, 
    refreshSession, 
    clearSession 
  } = useCouchDBSession();

  if (isLoading) return <div>Connecting to CouchDB...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!isSessionValid) return <div>Not connected to CouchDB</div>;

  return (
    <div>
      <p>Connected as: {sessionData?.username}</p>
      <p>Roles: {sessionData?.roles.join(', ')}</p>
      <button onClick={refreshSession}>Refresh Session</button>
      <button onClick={clearSession}>Logout</button>
    </div>
  );
}
```

### Using the Context Provider

```tsx
import { useCouchDBSessionContext } from '@/components/couchdb-session-provider';

function MyComponent() {
  const { isSessionValid, sessionData } = useCouchDBSessionContext();

  return (
    <div>
      {isSessionValid ? (
        <p>CouchDB connected as {sessionData?.username}</p>
      ) : (
        <p>CouchDB disconnected</p>
      )}
    </div>
  );
}
```

### Session Status Indicator

```tsx
import { CouchDBSessionStatus } from '@/components/couchdb-session-provider';

function Header() {
  return (
    <header>
      <h1>My App</h1>
      <CouchDBSessionStatus />
    </header>
  );
}
```

### PouchDB Integration

```tsx
import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useCouchDBSessionContext } from '@/components/couchdb-session-provider';
import { getUserDbWithSession } from '@/lib/pouchdb-with-session';

function ChatComponent() {
  const { data: authSession } = useSession();
  const { isSessionValid } = useCouchDBSessionContext();

  const chatDb = useMemo(() => {
    if (isSessionValid && authSession?.user?.id) {
      return getUserDbWithSession(authSession.user.id, 'chats');
    }
    return null;
  }, [isSessionValid, authSession?.user?.id]);

  // Use chatDb for PouchDB operations
  const loadChats = async () => {
    if (chatDb) {
      const result = await chatDb.allDocs({ include_docs: true });
      return result.rows.map(row => row.doc);
    }
    return [];
  };

  // ... rest of component
}
```

## API Endpoints

### POST `/api/couchdb/session`

Creates a new CouchDB session for the authenticated user.

**Request:**
```json
{
  "authUserId": "user-id" // Optional, defaults to current user
}
```

**Response:**
```json
{
  "success": true,
  "sessionToken": "session-token-here",
  "userInfo": {
    "ok": true,
    "name": "username",
    "roles": ["role1", "role2"]
  }
}
```

### GET `/api/couchdb/session`

Validates the current CouchDB session.

**Response:**
```json
{
  "success": true,
  "valid": true,
  "sessionData": {
    "username": "username",
    "roles": ["role1", "role2"],
    "authenticated": "cookie"
  }
}
```

### DELETE `/api/couchdb/session`

Deletes the current CouchDB session (logout).

**Response:**
```json
{
  "success": true,
  "message": "Session deleted successfully"
}
```

## Advanced Usage

### Manual Session Management

```tsx
import { generateCouchDBSession, validateCouchDBSession } from '@/lib/couchdb-session';

// Server-side usage
async function createSessionForUser(userId: string) {
  try {
    const sessionData = await generateCouchDBSession(userId);
    console.log('Session created:', sessionData.sessionToken);
    return sessionData;
  } catch (error) {
    console.error('Failed to create session:', error);
  }
}

// Validate existing session
async function checkSession(token: string) {
  const sessionData = await validateCouchDBSession(token);
  if (sessionData) {
    console.log('Valid session for:', sessionData.username);
  } else {
    console.log('Invalid session');
  }
}
```

### Custom Refresh Intervals

```tsx
// Refresh every 2 minutes instead of default 5 minutes
function MyApp() {
  return (
    <CouchDBSessionProvider 
      autoRefresh={true} 
      refreshIntervalMs={120000} // 2 minutes
    >
      {/* Your app */}
    </CouchDBSessionProvider>
  );
}
```

### Client-side Cookie Management

```tsx
import { CouchDBSessionClient } from '@/lib/couchdb-session';

// Manual cookie management (usually not needed)
function manualCookieExample() {
  // Set session cookie
  CouchDBSessionClient.setSessionCookie('session-token', {
    maxAge: 600, // 10 minutes
    secure: true,
    sameSite: 'strict'
  });

  // Get session cookie
  const token = CouchDBSessionClient.getSessionCookie();

  // Remove session cookie
  CouchDBSessionClient.removeSessionCookie();
}
```

## Security Considerations

1. **HTTPS**: Always use HTTPS in production for secure cookie transmission
2. **HttpOnly Cookies**: Server-side cookies are set as HttpOnly to prevent XSS attacks
3. **Session Timeout**: Sessions automatically expire after 10 minutes (CouchDB default)
4. **Auto-refresh**: Sessions are refreshed before expiration to maintain connectivity
5. **User Isolation**: Users can only create sessions for themselves

## Troubleshooting

### Common Issues

1. **"COUCHDB_URL environment variable is not set"**
   - Ensure `COUCHDB_URL` is properly configured in your environment

2. **"Failed to create CouchDB session: 401 Unauthorized"**
   - Check that the user exists in CouchDB's `_users` database
   - Verify the user credentials are correct

3. **"No session token found"**
   - Ensure the user is authenticated with Auth.js first
   - Check that the session creation was successful

4. **Session not refreshing automatically**
   - Verify `autoRefresh` is set to `true`
   - Check browser console for refresh errors
   - Ensure the component is properly wrapped with the provider

### Debug Mode

Enable debug logging by adding this to your component:

```tsx
const { isSessionValid, error } = useCouchDBSession();

useEffect(() => {
  console.log('CouchDB Session Status:', { isSessionValid, error });
}, [isSessionValid, error]);
```

## Integration with Existing Code

To integrate with your existing `user-db.ts` functions, you can now use session-authenticated PouchDB instances:

```tsx
import { getUserDbWithSession } from '@/lib/pouchdb-with-session';
import { useCouchDBSessionContext } from '@/components/couchdb-session-provider';

function useUserDatabase(dbType: 'chats' | 'messages' | 'profile') {
  const { data: authSession } = useSession();
  const { isSessionValid } = useCouchDBSessionContext();

  return useMemo(() => {
    if (isSessionValid && authSession?.user?.id) {
      return getUserDbWithSession(authSession.user.id, dbType);
    }
    return null;
  }, [isSessionValid, authSession?.user?.id, dbType]);
}
```

This provides a seamless upgrade path from your existing database functions while adding automatic session authentication. 