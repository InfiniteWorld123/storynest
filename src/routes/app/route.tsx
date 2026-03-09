import { createServerFn } from '@tanstack/react-start'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

const getSessionFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { getRequestHeaders } = await import('@tanstack/react-start/server')
  const { auth } = await import('#/lib/auth')
  const headers = getRequestHeaders()
  return auth.api.getSession({ headers })
})

export const Route = createFileRoute('/app')({
  beforeLoad: async () => {
    const session = await getSessionFn();
    if (!session) {
      throw redirect({ to: "/sign-in" });
    }
    return { user: session.user };
  },
  notFoundComponent: () => (
    <p className='px-4 py-8 text-center text-sm text-[hsl(var(--muted-foreground))]'>
      This dashboard page was not found.
    </p>
  ),
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useRouteContext();

  return (
    <div>
      <h1>{user.name}</h1>
      <h2>{user.email}</h2>
      <Outlet />
    </div>
  )
}
