import NextAuth from "next-auth";

import { PouchDBAdapter } from "@auth/pouchdb-adapter";
import { authConfig } from "./auth.config";
import { authJsDb, initializeUserDatabases, storeUserCredentials, userDb } from "../db/user-db";
import { Effect } from "effect";
import { NodeSdkLive, runNode } from "@/services/node";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  debug: process.env.NODE_ENV !== 'production',
  // adapter: PouchDBAdapter({
  //   pouchdb: authJsDb,
  // }),

  callbacks: {
    ...authConfig.callbacks,
    signIn({ user, profile }) {
      return Effect.gen(function* () {
        const userId = (profile?.sub ?? user.id)?.toLowerCase(); // @todo add  effect ts workflow
        if (!userId) {
          yield* Effect.logError("User ID is undefined");
          return false;
        }

        // Initialize databases and create CouchDB user
        yield* Effect.log("userId", userId);
        const existCheck = yield* Effect.tryPromise({
          try: () => userDb.get(`org.couchdb.user:${userId}`), catch: (e) => ({
            _tag: "GetUserError" as const, error: e as PouchDB.Core.Error
          })
        }).pipe(
          Effect.catchIf((e) => e.error.status === 404, () => Effect.succeed(false)),
        );
        if (existCheck) {
          yield* Effect.log("User already exists");
          return true;
        }

        const couchDbCreds = yield* initializeUserDatabases(userId);
        yield* Effect.log("couchDbCreds", couchDbCreds);
        // Store the credentials for later use
        yield* storeUserCredentials(userId, couchDbCreds);

        return true;
      }).pipe(
        // Effect.catchAllCause((e) => Effect.tap(Effect.succeed(false), () => Effect.logError("signIn error", e))),
        Effect.withSpan("signIn", {
          attributes: {
            userId: (profile?.sub ?? user.id)?.toLowerCase()
          }
        }),
        runNode,
      );
    }
  }
});