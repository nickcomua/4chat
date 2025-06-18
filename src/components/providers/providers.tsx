"use client"

import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import { CouchDBSessionProvider, useCouchDBSessionContext } from "@/components/providers/couchdb-session-provider"
import { Provider as _PouchDBProvider, ProviderArguments } from 'use-pouchdb'
import { couchdbUrlBase, getUserDbName } from "@/lib/db/common";
import PouchDB from "pouchdb-browser";
import pouchdbFind from 'pouchdb-find';
import pouchdbMapReduce from 'pouchdb-mapreduce';
import pouchdbMemory from 'pouchdb-adapter-memory';
import { useEffect } from "react"
PouchDB.plugin(pouchdbFind);
PouchDB.plugin(pouchdbMapReduce);
PouchDB.plugin(pouchdbMemory);

interface ProvidersProps {
  children: React.ReactNode;
  // authSession: any; // Auth.js session object
}
const PouchDBProvider = _PouchDBProvider as (args: ProviderArguments) => JSX.Element
const DbsProvider = ({ children }: { children: React.ReactNode }) => {
  // const chatsDbIdb = new PouchDB("chats", {
  //   skip_setup: true,
  // })
  const chatsDb = new PouchDB("chats", {
    skip_setup: true,
    // adapter: "memory"
  })
  // const messagesDbIdb = new PouchDB("messages", {
  //   skip_setup: true,
  // })
  const messagesDb = new PouchDB("messages", {
    skip_setup: true,
    // adapter: "memory"
  })
  // const profileDbIdb = new PouchDB("profile", {
  //   skip_setup: true,
  // })
  const profileDb = new PouchDB("profile", {
    skip_setup: true,
    // adapter: "memory"
  })


  // useEffect(() => {
  //   const chatsSync = chatsDbIdb.sync(chatsDb, {
  //     live: true
  //   })
  //   const messagesSync = messagesDbIdb.sync(messagesDb, {
  //     live: true
  //   })
  //   const sync = profileDbIdb.sync(profileDb, {
  //     live: true
  //   })
  //   return () => { 
  //     sync.cancel();
  //     sync.cancel();
  //     sync.cancel();
  //   }
  // }, [])
  const { sessionData } = useCouchDBSessionContext();
  useEffect(() => {
    if (!sessionData) return;
    const chatsDbRemote = new PouchDB(`${couchdbUrlBase}/${getUserDbName(sessionData?.username ?? '', 'chats')}`, {
      skip_setup: true
    })
    const messagesDbRemote = new PouchDB(`${couchdbUrlBase}/${getUserDbName(sessionData?.username ?? '', 'messages')}`, {
      skip_setup: true
    })
    const profileDbRemote = new PouchDB(`${couchdbUrlBase}/${getUserDbName(sessionData?.username ?? '', 'profile')}`, {
      skip_setup: true
    })
    const chatsSync = chatsDb.sync(chatsDbRemote, {
      live: true
    }).on('change', function (change) {
      // console.log("change", change)
    }).on('error', function (err) {
      console.log("error", err)
    });
    const messagesSync = messagesDb.sync(messagesDbRemote, {
      live: true
    }).on('change', function (change) {
      // console.log("change", change)
    }).on('error', function (err) {
      console.log("error", err)
    });
    const profileSync = profileDb.sync(profileDbRemote, {
      live: true
    }).on('change', function (change) {
      // console.log("change", change)
    }).on('error', function (err) {
      console.log("error", err)
    });
    return () => {
      chatsSync.cancel();
      messagesSync.cancel();
      profileSync.cancel();
      chatsDbRemote.close();
      messagesDbRemote.close();
      profileDbRemote.close();
    }
  }, [sessionData])
  return (
    <PouchDBProvider
      default="chats"
      databases={{
        chats: chatsDb,
        messages: messagesDb,
        profile: profileDb,
      }}>
      {children as any}
    </PouchDBProvider>
  )
}

export function Providers({ children }: ProvidersProps) {
  return (
    <CouchDBSessionProvider>
      <DbsProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </DbsProvider>
    </CouchDBSessionProvider>
  )
} 