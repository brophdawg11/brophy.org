import type { V2_MetaFunction } from '@remix-run/node';
import { LinksFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import appStyles from '~/styles/app.css';

export const meta: V2_MetaFunction = () => {
  return [
    { name: 'charset', content: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'og:site_name', content: 'brophy.org' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:creator', content: '@brophdawg11' },
    ...['image', 'og:image', 'twitter:image'].map((t) => ({
      name: t,
      content: 'https://www.brophy.org/images/logo.png',
    })),
    // Put these at the end where they'll be in children - helps React better
    // re-use the above entries
    { title: 'Matt Brophy | Web Developer' },
    { name: 'description', content: "Matt Brophy's Personal Website" },
  ];
};

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: appStyles,
    },
  ];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="c-error__body">
        <h1>Oh no something went wrong!</h1>
        <p>Please try reloading the page</p>
      </body>
    </html>
  );
}
