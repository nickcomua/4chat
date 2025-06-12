import NextAuth from "next-auth";

import { PouchDBAdapter } from "@auth/pouchdb-adapter";
import { authConfig } from "./auth.config";
import { authJsDb, initializeUserDatabases, storeUserCredentials, userDb } from "./user-db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  debug: process.env.NODE_ENV !== 'production',
  // adapter: PouchDBAdapter({
  //   pouchdb: authJsDb,
  // }),
  
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user , profile}) {
      try {
        const userId = (profile?.sub ?? user.id)?.toLowerCase(); // @todo add  effect ts workflow
        if (!userId) {
          console.error("User ID is undefined");
          return false;
        }

        // Initialize databases and create CouchDB user
        console.log("userId", userId);
        const existCheck = await userDb.get(`org.couchdb.user:${userId}`).catch(() => false);
        if (existCheck) {
          console.log("User already exists");
          return true;
        }

        const couchDbCreds = await initializeUserDatabases(userId);

        // Store the credentials for later use
        await storeUserCredentials(userId, couchDbCreds);

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    }
  }
});