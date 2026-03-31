import { AppHeader } from "#/components/app/app-header";
import { AppSidebar } from "#/components/app/app-sidebar";
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar";
import { getSession } from "#/server/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: RouteComponent,
  beforeLoad: async () => {
    // Server-side getSession reads cookies via getRequestHeaders()
    const session = await getSession();
    const user = session?.user;

    if (!user) {
      throw redirect({ to: "/sign-in" });
    }

    return { user };
  },
});

function RouteComponent() {
  Route.useRouteContext();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
