import { getSession } from '#/server/auth.server';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app')({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: "/sign-in" });
    }
    return { user: session.user };
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useRouteContext();

  return (
    <div>
      <h1>{user.name}</h1>
      <Outlet />
    </div>
  )
}
