import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from '@remix-run/react';

import '~/styles/app.css';

export const meta: MetaFunction = () => {
  return [
    { title: 'Matt Brophy | Web Developer' },
    { name: 'description', content: "Matt Brophy's Personal Website" },
  ];
};

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

export function Layout({ children }: { children: React.ReactNode }) {
  const error = useRouteError();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="og:site_name" content="brophy.org" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@brophdawg11" />
        <meta name="image" content="https://www.brophy.org/images/logo.png" />
        <meta
          name="og:image"
          content="https://www.brophy.org/images/logo.png"
        />
        <meta
          name="twitter:image"
          content="https://www.brophy.org/images/logo.png"
        />
        <Meta />
        <Links />
      </head>
      <body className={error ? 'c-error__body' : undefined}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  return (
    <div>
      <h1>Oh no something went wrong!</h1>
      <p>Please try reloading the page</p>
    </div>
  );
}
