import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useRouteLoaderData,
} from 'react-router';

import '~/styles/app.css';

export function meta() {
  return [
    { title: 'Matt Brophy | Web Developer' },
    { name: 'description', content: "Matt Brophy's Personal Website" },
  ];
}

export function loader() {
  return {
    isProd: process.env.IS_FLY === 'true',
  };
}

export function shouldRevalidate() {
  return false;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>('root');
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
        {data?.isProd ? (
          <>
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-6VHREDE1NE"></script>
            <script
              dangerouslySetInnerHTML={{
                __html: [
                  `window.dataLayer = window.dataLayer || [];`,
                  `function gtag(){window.dataLayer.push(arguments);}`,
                  `gtag('js', new Date());`,
                  `gtag('config', 'G-6VHREDE1NE');`,
                ].join('\n'),
              }}
            />
          </>
        ) : null}
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
