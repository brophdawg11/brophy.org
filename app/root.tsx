import {
    Links,
    LinksFunction,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from 'remix';
import type { MetaFunction } from 'remix';
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
