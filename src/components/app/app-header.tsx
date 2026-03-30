import { SidebarTrigger } from "#/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { ThemeToggle } from "#/components/theme/theme-toggle";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const MOCK_USER = { name: "Alex Morgan", initials: "AM" };

const PAGE_TITLES: Record<string, string> = {
  "/app/overview":    "Overview",
  "/app/stories":     "My Stories",
  "/app/stories/new": "New Story",
  "/app/read-later":  "Read Later",
  "/app/settings":    "Settings",
};

function usePageTitle() {
  const { location } = useRouterState();
  const pathname = location.pathname;
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/app/stories/") && pathname.includes(".edit"))
    return "Edit Story";
  return "StoryNest";
}

function SearchBar() {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      className="relative hidden sm:flex items-center"
      animate={{ width: focused ? 200 : 160 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="flex h-8 w-full cursor-text items-center gap-2 rounded-[var(--radius)] px-3
                   transition-all duration-200"
        style={{
          backgroundColor: focused
            ? "var(--accent-warm-muted)"
            : "var(--secondary)",
          boxShadow: focused
            ? "0 0 0 1.5px var(--accent-warm)"
            : "0 0 0 1px var(--border)",
        }}
        onClick={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        tabIndex={0}
      >
        <Search
          className="size-3.5 shrink-0 transition-colors duration-200"
          style={{ color: focused ? "var(--accent-warm)" : "var(--muted-foreground)" }}
        />
        <span
          className="text-[12px] font-normal transition-colors duration-200 select-none"
          style={{ color: focused ? "var(--foreground)" : "var(--muted-foreground)" }}
        >
          Search stories…
        </span>
      </div>
    </motion.div>
  );
}

function UserAvatar() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          className="relative ml-1 size-8 rounded-full overflow-hidden focus-visible:outline-none"
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          aria-label="Open user menu"
        >
          {/* Ring */}
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{ boxShadow: "0 0 0 2px var(--accent-warm)" }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          />
          {/* Initials */}
          <span
            className="flex size-full items-center justify-center rounded-full
                       font-sans text-[11px] font-bold uppercase tracking-wider select-none"
            style={{
              backgroundColor: "var(--accent-warm-muted)",
              color: "var(--accent-warm)",
              border: "1.5px solid var(--border)",
            }}
          >
            {MOCK_USER.initials}
          </span>
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuLabel>
          <span className="block font-sans text-xs font-semibold">
            {MOCK_USER.name}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate({ to: "/app/settings" })}>
          <span className="text-sm">Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => navigate({ to: "/" })}
          className="text-destructive"
        >
          <span className="text-sm">Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppHeader() {
  const pageTitle = usePageTitle();

  return (
    <motion.header
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-14 shrink-0 items-center gap-3 px-4"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      {/* Sidebar trigger */}
      <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}>
        <SidebarTrigger
          className="-ml-1 text-muted-foreground hover:text-foreground
                     hover:bg-transparent transition-colors duration-150"
        />
      </motion.div>

      {/* Divider */}
      <span
        className="h-4 w-px shrink-0 opacity-30"
        style={{ backgroundColor: "var(--foreground)" }}
      />

      {/* Page title — animated on route change */}
      <AnimatePresence mode="wait">
        <motion.h1
          key={pageTitle}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="font-serif text-[15px] italic font-medium leading-none"
          style={{ color: "var(--foreground)" }}
        >
          {pageTitle}
        </motion.h1>
      </AnimatePresence>

      {/* Right controls */}
      <div className="ml-auto flex items-center gap-1">
        <SearchBar />

        {/* Theme toggle */}
        <ThemeToggle />

        <UserAvatar />
      </div>
    </motion.header>
  );
}
