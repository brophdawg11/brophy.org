import type { MetaFunction } from '@remix-run/node';
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

export const meta: MetaFunction = () => {
  return {
    title: 'Matt Brophy | Web Developer',
    charset: 'utf-8',
    viewport: 'width=device-width, initial-scale=1',
    description: "Matt Brophy's Personal Website",
    'og:site_name': 'brophy.org',
    'twitter:card': 'summary',
    'twitter:creator': '@brophdawg11',
    ...['image', 'og:image', 'twitter:image'].reduce(
      (acc, t) =>
        Object.assign(acc, {
          [t]: 'https://www.brophy.org/images/logo.png',
        }),
      {}
    ),
  };
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
