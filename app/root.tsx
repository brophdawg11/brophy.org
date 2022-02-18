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
import pkg from '../package.json';

export const meta: MetaFunction = () => {
    return {
        title: 'Matt Brophy | Web Developer',
        charset: 'utf-8',
        viewport: 'width=device-width, initial-scale=1',
        description: pkg.description,
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
