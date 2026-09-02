import * as React from "react"
import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { cn } from "@/lib/utils"

export function MainLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />
      <div
        className={cn(
          "transition-all duration-200 min-h-screen flex flex-col",
          isCollapsed ? "lg:pl-[72px]" : "lg:pl-[256px]"
        )}
      >
        <Header onMobileMenuClick={() => setIsMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
