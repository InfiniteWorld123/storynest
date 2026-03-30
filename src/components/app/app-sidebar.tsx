import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "#/components/ui/sidebar";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookMarked,
  BookOpen,
  Bookmark,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const NAV_ITEMS = [
  { label: "Overview",   to: "/app/overview",   icon: LayoutDashboard, badge: undefined },
  { label: "My Stories", to: "/app/stories",    icon: BookOpen,        badge: undefined },
  { label: "Read Later", to: "/app/read-later", icon: Bookmark,        badge: 3         },
  { label: "Settings",   to: "/app/settings",   icon: Settings,        badge: undefined },
] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: smoothEase },
  },
};

const logoVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: smoothEase },
  },
};

function NavItem({
  item,
  isActive,
}: {
  item: (typeof NAV_ITEMS)[number];
  isActive: boolean;
}) {
  const Icon = item.icon;

  return (
    <motion.div variants={itemVariants}>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip={item.label}
          className="relative h-10 overflow-hidden rounded-none pl-4 pr-3 group/item
                     hover:bg-transparent focus-visible:bg-transparent"
          style={isActive ? { color: "var(--accent-warm)" } : undefined}
        >
          <Link to={item.to} activeProps={{ "data-active": "true" }}>
            {/* Active left-border indicator */}
            <AnimatePresence>
              {isActive && (
                <motion.span
                  key="indicator"
                  layoutId="nav-indicator"
                  className="absolute left-0 top-0 h-full w-[3px] rounded-r-full"
                  style={{ backgroundColor: "var(--accent-warm)" }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  exit={{ scaleY: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: smoothEase }}
                />
              )}
            </AnimatePresence>

            {/* Hover background wash */}
            <motion.span
              className="absolute inset-0 rounded-[var(--radius)]"
              style={{ backgroundColor: "var(--accent-warm-muted)" }}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: isActive ? 0 : 1 }}
              transition={{ duration: 0.15 }}
            />

            {/* Icon */}
            <motion.span
              className="relative z-10 flex items-center"
              animate={{ color: isActive ? "var(--accent-warm)" : undefined }}
              transition={{ duration: 0.2 }}
            >
              <Icon
                className="size-4 shrink-0 transition-colors duration-200"
                style={
                  isActive
                    ? { color: "var(--accent-warm)" }
                    : { color: "var(--sidebar-foreground)", opacity: 0.55 }
                }
              />
            </motion.span>

            {/* Label */}
            <motion.span
              className="relative z-10 flex flex-1 items-center gap-2 text-[13px] font-medium tracking-wide
                         group-data-[collapsible=icon]:hidden"
              animate={{
                x: isActive ? 2 : 0,
                color: isActive ? "var(--accent-warm)" : undefined,
              }}
              whileHover={{ x: isActive ? 2 : 3 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              style={!isActive ? { color: "var(--sidebar-foreground)", opacity: 0.72 } : undefined}
            >
              {item.label}
              {item.badge ? (
                <span
                  className="ml-auto inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 font-sans text-[10px] font-bold leading-none"
                  style={{
                    backgroundColor: "var(--accent-warm)",
                    color: "#fff",
                  }}
                >
                  {item.badge}
                </span>
              ) : null}
            </motion.span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </motion.div>
  );
}

export function AppSidebar() {
  const { location } = useRouterState();
  const pathname = location.pathname;

  return (
    <Sidebar collapsible="icon">
      {/* Header — Wordmark */}
      <SidebarHeader className="pb-0">
        <motion.div
          variants={logoVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-3 px-3 py-5"
        >
          {/* Icon mark */}
          <motion.div
            className="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius)]"
            style={{ backgroundColor: "var(--accent-warm-muted)" }}
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <BookMarked
              className="size-4"
              style={{ color: "var(--accent-warm)" }}
            />
          </motion.div>

          {/* Wordmark */}
          <div className="group-data-[collapsible=icon]:hidden">
            <span
              className="font-serif text-[15px] font-semibold leading-none tracking-tight"
              style={{ color: "var(--sidebar-foreground)" }}
            >
              StoryNest
            </span>
            <span
              className="mt-0.5 block font-sans text-[10px] font-medium uppercase tracking-[0.2em] opacity-40"
              style={{ color: "var(--sidebar-foreground)" }}
            >
              Your reading space
            </span>
          </div>
        </motion.div>

        {/* Ornamental rule */}
        <div className="mx-3 mb-3 flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <span
            className="h-px flex-1"
            style={{ backgroundColor: "var(--sidebar-border)" }}
          />
          <span
            className="text-[9px] opacity-30"
            style={{ color: "var(--sidebar-foreground)" }}
          >
            ✦
          </span>
          <span
            className="h-px flex-1"
            style={{ backgroundColor: "var(--sidebar-border)" }}
          />
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="pt-1">
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    pathname === item.to ||
                    (item.to === "/app/stories" &&
                      pathname.startsWith("/app/stories") &&
                      pathname !== "/app/stories/new");
                  return (
                    <NavItem key={item.to} item={item} isActive={isActive} />
                  );
                })}
              </motion.div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — subtle version tagline */}
      <SidebarFooter className="pb-6 group-data-[collapsible=icon]:hidden">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="px-3 font-serif text-[11px] italic opacity-25"
          style={{ color: "var(--sidebar-foreground)" }}
        >
          "Every story deserves a home."
        </motion.p>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
