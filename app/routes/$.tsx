import type { Route } from './+types/$';

export function loader({ request }: Route.LoaderArgs) {
  const fourOhFour = new Response('Not Found', { status: 404 });
  if (
    request.url.includes('/.well-known/appspecific/com.chrome.devtools.json')
  ) {
    // Don't trigger any error logging
    return fourOhFour;
  }
  throw fourOhFour;
}
