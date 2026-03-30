import { AppHeader } from "#/components/app/app-header";
import { AppSidebar } from "#/components/app/app-sidebar";
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar";
import { getSession } from "#/lib/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: "/sign-in" });
    }
    return { user: session.data?.user };
  },
});

function RouteComponent() {
  const { user } = Route.useRouteContext();
  // console.log(user);
  console.log("test app route")
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
