"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, LogIn, X, Pin } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const [searchValue, setSearchValue] = useState("")

  return (
    <div
      className={`group peer ${isOpen ? "block" : "hidden"} text-sidebar-foreground md:block`}
      data-state={isOpen ? "expanded" : "collapsed"}
      data-collapsible=""
      data-variant="inset"
      data-side="left"
    >
      <div className="relative h-svh w-[var(--sidebar-width)] bg-transparent ease-snappy group-data-[state=collapsed]:w-0 group-data-[state=collapsed]:md:w-[var(--sidebar-width-icon)] group-data-[side=right]:rotate-180 transition-[width]"></div>
      <div className="fixed inset-y-0 h-svh w-[var(--sidebar-width)] transition-[transform,opacity,width] ease-snappy md:flex left-0 group-data-[state=expanded]:translate-x-0 group-data-[state=collapsed]:-translate-x-full group-data-[state=collapsed]:md:translate-x-0 group-data-[state=collapsed]:w-0 group-data-[state=collapsed]:md:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)] p-2 group z-50 border-none">
        <div
          data-sidebar="sidebar"
          className="flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
        >
          {/* Sidebar Header */}
          <div
            data-sidebar="header"
            className="flex flex-col gap-2 relative m-1 mb-0 space-y-1 p-0 !pt-safe group-data-[state=collapsed]:md:opacity-0 group-data-[state=collapsed]:md:pointer-events-none group-data-[state=collapsed]:max-md:hidden transition-opacity duration-150"
          >
            <h1 className="flex h-8 shrink-0 items-center justify-center text-lg text-muted-foreground transition-opacity delay-75 duration-75">
              <Link
                className="relative flex h-8 w-24 items-center justify-center text-sm font-semibold text-foreground"
                href="/"
              >
                <div className="h-3.5 select-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-full text-[--wordmark-color]"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <span className="ml-2">C4 Chat</span>
              </Link>
            </h1>
            <div className="px-1">
              <Link
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-reflect button-reflect rounded-lg bg-[rgb(162,59,103)] p-2 font-semibold text-primary-foreground shadow hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 disabled:dark:hover:bg-primary/20 disabled:dark:active:bg-primary/20 h-9 px-4 py-2 w-full select-none text-sm"
                href="/"
              >
                <span className="w-full select-none text-center" data-state="closed">
                  New Chat
                </span>
              </Link>
            </div>
            <div className="border-b border-chat-border px-3">
              <div className="flex items-center">
                <Search className="-ml-[3px] mr-3 !size-4 text-muted-foreground" />
                <input
                  role="searchbox"
                  aria-label="Search threads"
                  placeholder="Search your threads..."
                  className="w-full bg-transparent py-2 text-sm text-foreground placeholder-muted-foreground/50 placeholder:select-none focus:outline-none"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Sidebar Content */}
          <div
            data-sidebar="content"
            className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden small-scrollbar scroll-shadow relative pb-2 group-data-[state=collapsed]:md:opacity-0 group-data-[state=collapsed]:md:pointer-events-none group-data-[state=collapsed]:max-md:hidden transition-opacity duration-150"
          >
            <div style={{ overflow: "anchor", flex: "0 0 auto", position: "relative", width: "100%" }}>
              <div style={{ position: "absolute", width: "100%", left: 0, top: 0, visibility: "visible" }}>
                <div data-sidebar="group" className="relative flex w-full min-w-0 flex-col p-2">
                  <div
                    data-sidebar="group-label"
                    className="flex h-8 shrink-0 select-none items-center rounded-md text-xs font-medium outline-none ring-sidebar-ring transition-[margin,opa] duration-200 ease-snappy focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 px-1.5 text-color-heading"
                  >
                    <span>Today</span>
                  </div>
                  <div data-sidebar="group-content" className="w-full text-sm">
                    <ul data-sidebar="menu" className="flex w-full min-w-0 flex-col gap-1">
                      <span data-state="closed" style={{ userSelect: "none" }}>
                        <li data-sidebar="menu-item" className="group/menu-item relative">
                          <Link
                            className="group/link relative flex h-9 w-full items-center overflow-hidden rounded-lg px-2 py-1 text-sm outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring hover:focus-visible:bg-sidebar-accent bg-sidebar-accent text-sidebar-accent-foreground"
                            href="/chat/1efab525-b3c2-4846-9edb-992ac3b95aaf"
                          >
                            <div className="relative flex w-full items-center">
                              <button data-state="closed" className="w-full">
                                <div className="relative w-full">
                                  <input
                                    aria-label="Thread title"
                                    aria-describedby="thread-title-hint"
                                    aria-readonly="true"
                                    readOnly
                                    tabIndex={-1}
                                    className="hover:truncate-none h-full w-full rounded bg-transparent px-1 py-1 text-sm text-muted-foreground outline-none pointer-events-none cursor-pointer overflow-hidden truncate"
                                    title="Greeting"
                                    type="text"
                                    value="Greeting"
                                  />
                                </div>
                              </button>
                              <div className="pointer-events-auto absolute -right-1 bottom-0 top-0 z-50 flex translate-x-full items-center justify-end text-muted-foreground transition-transform group-hover/link:translate-x-0 group-hover/link:bg-sidebar-accent">
                                <div className="pointer-events-none absolute bottom-0 right-[100%] top-0 h-12 w-8 bg-gradient-to-l from-sidebar-accent to-transparent opacity-0 group-hover/link:opacity-100"></div>
                                <button
                                  className="rounded-md p-1.5 hover:bg-muted/40"
                                  tabIndex={-1}
                                  data-action="pin-thread"
                                  aria-label="Pin thread"
                                  data-state="closed"
                                >
                                  <Pin className="size-4" />
                                </button>
                                <button
                                  className="rounded-md p-1.5 hover:bg-destructive/50 hover:text-destructive-foreground"
                                  tabIndex={-1}
                                  data-action="thread-delete"
                                  aria-label="Delete thread"
                                  data-state="closed"
                                >
                                  <X className="size-4" />
                                </button>
                              </div>
                            </div>
                          </Link>
                        </li>
                      </span>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div
            data-sidebar="footer"
            className="flex flex-col gap-2 m-0 p-2 pt-0 group-data-[state=collapsed]:md:opacity-0 group-data-[state=collapsed]:md:pointer-events-none group-data-[state=collapsed]:max-md:hidden transition-opacity duration-150"
          >
            <Link
              aria-label="Login"
              role="button"
              className="flex w-full select-none items-center gap-4 rounded-lg p-4 text-muted-foreground hover:bg-sidebar-accent"
              href="/auth"
            >
              <LogIn className="size-4" />
              <span>Login</span>
            </Link>
          </div>

          {/* Icon-only view for collapsed desktop */}
          <div className="hidden group-data-[state=collapsed]:md:flex flex-col items-center justify-start pt-4 space-y-6 mt-16">
            <Search
              className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Search threads"
            />
            <LogIn className="size-6 text-muted-foreground hover:text-foreground cursor-pointer" aria-label="Login" />
          </div>

          {/* Resize Handle */}
          <div
            className="absolute right-0 top-0 h-full w-2 cursor-col-resize hover:bg-border/50 transition-colors"
            onMouseDown={(e) => {
              e.preventDefault()
              const startX = e.clientX
              const startWidth = Number.parseInt(
                getComputedStyle(document.documentElement).getPropertyValue("--sidebar-width"),
              )

              const handleMouseMove = (e: MouseEvent) => {
                const newWidth = Math.max(200, Math.min(400, startWidth + (e.clientX - startX)))
                document.documentElement.style.setProperty("--sidebar-width", `${newWidth}px`)
              }

              const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove)
                document.removeEventListener("mouseup", handleMouseUp)
              }

              document.addEventListener("mousemove", handleMouseMove)
              document.addEventListener("mouseup", handleMouseUp)
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}
