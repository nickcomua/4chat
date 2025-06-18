// import { authConfig } from "./src/lib/auth/auth.config"; 
export { auth as middleware } from "@/lib/auth/auth";
// import NextAuth from "next-auth";

// export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  runtime: 'nodejs',
}