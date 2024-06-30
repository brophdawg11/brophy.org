import { Outlet, useLoaderData, useMatches } from '@remix-run/react';

import CircleLinks from '~/components/CircleLinks';
import SiteInfo from '~/components/SiteInfo';

import '~/styles/default.css';

export async function loader() {
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
  } as const;
}

export default function DefaultLayout() {
  const matches = useMatches();
  const data = useLoaderData<typeof loader>();
  // @ts-expect-error handle is typed as unknown
  const isHomepage = matches.some((m) => m.handle?.isHomepage);

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
