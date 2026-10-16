export const ROUTES_PATH = '/routes'

export const routePath = (routeId: string) =>
  `${ROUTES_PATH}/${encodeURIComponent(routeId)}`
