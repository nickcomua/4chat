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
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 247.7 53"
                    className="size-full text-[--wordmark-color]"
                  >
                    <path
                      fill="currentcolor"
                      d="M205.6,50.3c1.9-1,3.5-2.2,4.7-3.6v4.4v0.4h0.4h7.7h0.4v-0.4V13.5v-0.4h-0.4h-7.7h-0.4v0.4v4.3
                  c-1.2-1.4-2.8-2.6-4.6-3.5c-2.2-1.2-4.8-1.8-7.8-1.8c-3.3,0-6.3,0.8-9,2.5c-2.7,1.7-4.9,4-6.4,6.9l0,0c-1.6,3-2.4,6.4-2.4,10.2
                  c0,3.8,0.8,7.3,2.4,10.3c1.6,3,3.7,5.4,6.4,7.1c2.7,1.7,5.7,2.6,8.9,2.6C200.6,52.1,203.3,51.5,205.6,50.3z M208.7,25.7l0.3,0.5
                  c0.8,1.7,1.2,3.7,1.2,6c0,2.5-0.5,4.7-1.5,6.6c-1,1.9-2.4,3.3-4,4.2c-1.6,1-3.4,1.5-5.3,1.5c-1.9,0-3.6-0.5-5.3-1.5
                  c-1.7-1-3-2.4-4-4.3c-1-1.9-1.5-4.1-1.5-6.6c0-2.5,0.5-4.7,1.5-6.5c1-1.8,2.3-3.2,4-4.1c1.6-1,3.4-1.4,5.3-1.4
                  c1.9,0,3.7,0.5,5.3,1.4C206.4,22.5,207.7,23.9,208.7,25.7z"
                    ></path>
                    <path
                      fill="currentcolor"
                      d="M99.6,21.4L99.6,21.4l-0.3,0.5c-1.6,3-2.4,6.5-2.4,10.4s0.8,7.4,2.4,10.4c1.6,3,3.8,5.3,6.6,7
                  c2.8,1.7,6,2.5,9.6,2.5c4.5,0,8.2-1.2,11.3-3.5c3-2.3,5.1-5.4,6.2-9.3l0.1-0.5h-0.5h-8.3H124l-0.1,0.3c-0.7,1.9-1.7,3.3-3.1,4.3
                  c-1.4,0.9-3.1,1.4-5.3,1.4c-3,0-5.4-1.1-7.2-3.3l0,0c-1.8-2.2-2.7-5.3-2.7-9.3c0-4,0.9-7,2.7-9.2c1.8-2.2,4.2-3.2,7.2-3.2
                  c2.2,0,3.9,0.5,5.3,1.5c1.4,1,2.4,2.4,3.1,4.2l0.1,0.3h0.3h8.3h0.5l-0.1-0.5c-1-4.1-3.1-7.3-6.1-9.5c-3-2.2-6.8-3.3-11.4-3.3
                  c-3.6,0-6.8,0.8-9.6,2.5l0,0C103.2,16.4,101.1,18.6,99.6,21.4z"
                    ></path>
                    <g>
                      <polygon
                        fill="currentcolor"
                        points="237.8,13.2 237.8,3.9 229.1,3.9 229.1,13.2 224.8,13.2 224.8,20.5 229.1,20.5 229.1,52.1 230,51.2 
                    230,51.2 232,49.2 237.8,43.2 237.8,20.5 246.8,20.5 246.8,13.2 	"
                      ></polygon>
                      <path fill="currentcolor" d="M71.7,3.4H51.5l-7.1,7.2h18.8"></path>
                      <path
                        fill="currentcolor"
                        d="M166.8,14.5l-0.1-0.1c-2.3-1.3-4.9-1.9-7.7-1.9c-2.4,0-4.6,0.5-6.7,1.3c-1.6,0.7-3,1.7-4.2,2.8V0.1l-8.6,8.8
                    v42.7h8.6V30.1c0-3.2,0.8-5.7,2.4-7.3c1.6-1.7,3.7-2.5,6.4-2.5s4.8,0.8,6.4,2.5c1.6,1.7,2.3,4.2,2.3,7.4v21.4h8.5V29
                    c0-3.5-0.6-6.4-1.9-8.9C170.8,17.6,169,15.7,166.8,14.5z"
                      ></path>
                      <path
                        fill="currentcolor"
                        d="M43,3.4H0v0.5l0,0v3.2v3.7h3.5l0,0h11.9v40.8H24V10.7h11.8L43,3.4z"
                      ></path>
                    </g>
                    <path
                      fill="currentcolor"
                      d="M71.9,25.4l-0.2-0.2h0c-2.2-2.3-5.3-3.7-9.1-4.2L73.4,9.8V3.4H54.8l-9.4,7.2h17.7L52.5,21.8v5.9h7
                  c2.5,0,4.4,0.7,5.9,2.2c1.4,1.4,2.1,3.4,2.1,6.1c0,2.6-0.7,4.7-2.1,6.2c-1.4,1.5-3.4,2.2-5.9,2.2c-2.5,0-4.4-0.7-5.7-2
                  c-1.4-1.4-2.1-3.1-2.3-5.2l0-0.5h-8.1l0,0.5c0.2,4.6,1.8,8.1,4.8,10.5c2.9,2.4,6.7,3.7,11.3,3.7c5,0,9-1.4,11.9-4.2
                  c2.9-2.8,4.4-6.6,4.4-11.3C75.6,31.5,74.4,28,71.9,25.4z"
                    ></path>
                    <rect x="84.3" y="44.2" fill="currentcolor" width="6.9" height="6.9"></rect>
                  </svg>
                </div>
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
