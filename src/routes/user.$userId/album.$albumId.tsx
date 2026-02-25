import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/$userId/album/$albumId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/user/$userId/album/$albumId"!</div>
}
