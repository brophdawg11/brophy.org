import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import { Outlet, useLoaderData, useMatches } from '@remix-run/react';

import type { CircleLinkProps } from '~/components/CircleLinks';
import CircleLinks from '~/components/CircleLinks';
import SiteInfo from '~/components/SiteInfo';

import defaultStyles from '../styles/default.css';

interface LoaderData {
  headerLinks: CircleLinkProps[];
  footerLinks: CircleLinkProps[];
}

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: defaultStyles,
    },
  ];
};

export const loader: LoaderFunction = (): LoaderData => {
  return {
    headerLinks: [
      {
        url: '/',
        title: 'Home',
        icon: 'home',
      },
      {
        url: '/posts',
        title: 'Blog',
        icon: 'chat',
      },
      {
        url: '/resume',
        title: 'Resume',
        icon: 'doc-text-inv',
      },
    ],
    footerLinks: [
      {
        url: 'https://www.github.com/brophdawg11',
        external: true,
        title: 'GitHub',
        icon: 'github-circled',
      },
      {
        url: 'https://www.instagram.com/brophdawg11',
        external: true,
        title: 'Instagram',
        icon: 'instagram',
      },
      {
        url: 'https://www.twitter.com/brophdawg11',
        external: true,
        title: 'Twitter',
        icon: 'twitter',
      },
      // {
      //     url: '/rss.xml',
      //     external: true,
      //     title: 'RSS',
      //     icon: 'rss-squared',
      // },
    ],
  };
};

export default function DefaultLayout() {
  const matches = useMatches();
  const data: LoaderData = useLoaderData();
  const isHomepage = matches.some(
    (m) =>
      m.handle != null &&
      typeof m.handle === 'object' &&
      'isHomepage' in m.handle &&
      m.handle.isHomepage
  );

  return (
    <div
      className={`
                page-content-wrapper
                ${isHomepage ? 's-homepage' : ''}
            `}>
      <header className="page-header">
        <CircleLinks links={data.headerLinks} />
      </header>

      <div className="page-content">
        <Outlet />
      </div>

      <footer className="page-footer">
        <CircleLinks links={data.footerLinks} className="page-footer__links" />
        <SiteInfo />
      </footer>
    </div>
  );
}
