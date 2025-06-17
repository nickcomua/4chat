"use client"

import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import { CouchDBSessionProvider, useCouchDBSessionContext } from "@/components/providers/couchdb-session-provider"
import { Provider as PouchDBProviderOriginal } from 'use-pouchdb'

// Type assertion to work around React 19 compatibility issue
const PouchDBProvider = PouchDBProviderOriginal as any
import { couchdbUrlBase, getUserDbName } from "@/lib/db/common";
import PouchDB from "pouchdb";
import pouchdbFind from 'pouchdb-find';
import pouchdbMapReduce from 'pouchdb-mapreduce';
import { useEffect } from "react"
PouchDB.plugin(pouchdbFind);
PouchDB.plugin(pouchdbMapReduce);

interface ProvidersProps {
  children: React.ReactNode;
  // authSession: any; // Auth.js session object
}

const DbsProvider = ({ children }: { children: React.ReactNode }) => {
  // @todo: add local db to pouchdb
  const chatsDb = new PouchDB("chats",{ 
    skip_setup: true
  })
  const messagesDb = new PouchDB("messages",{
    skip_setup: true
  })
  const profileDb = new PouchDB("profile",{
    skip_setup: true
  })

  // const localDb = new PouchDB("local",{
  //   skip_setup: true
  // })
  const { sessionData } = useCouchDBSessionContext();
  useEffect(() => {
    if (!sessionData) return;
    const chatsDbRemote = new PouchDB(`${couchdbUrlBase}/${getUserDbName(sessionData?.username ?? '', 'chats')}`,{
      skip_setup: true
    })
    const messagesDbRemote = new PouchDB(`${couchdbUrlBase}/${getUserDbName(sessionData?.username ?? '', 'messages')}`,{
      skip_setup: true
    })
    const profileDbRemote = new PouchDB(`${couchdbUrlBase}/${getUserDbName(sessionData?.username ?? '', 'profile')}`,{
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
    <PouchDBProvider pouchdb={chatsDb}>
      <PouchDBProvider pouchdb={messagesDb}>
        <PouchDBProvider pouchdb={profileDb}>
            {children as any}
        </PouchDBProvider>
      </PouchDBProvider>
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