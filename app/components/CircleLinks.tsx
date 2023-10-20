import { Link } from '@remix-run/react';

import ExternalLink from './ExternalLink';

interface LinkBodyProps {
  icon: string;
  title: string;
}

export interface CircleLinkProps {
  url: string;
  title: string;
  icon: string;
  external?: boolean;
}

export interface CircleLinksProps {
  links: CircleLinkProps[];
  className?: string;
}

function LinkBody({ icon, title }: LinkBodyProps) {
  return (
    <>
      <span className={`fa fa-${icon}`} />
      <span className="circle-links__p">{title}</span>
    </>
  );
}

function CircleLink({ url, title, icon, external }: CircleLinkProps) {
  return external ? (
    <ExternalLink to={url} title={title} className="circle-links__a">
      <LinkBody icon={icon} title={title} />
    </ExternalLink>
  ) : (
    <Link to={url} title={title} prefetch="intent" className="circle-links__a">
      <LinkBody icon={icon} title={title} />
    </Link>
  );
}

export default function CircleLinks({ links, className }: CircleLinksProps) {
  return (
    <nav className={`circle-links ${className ?? ''}`}>
      {links.map((link) => (
        <CircleLink key={link.url} {...link} />
      ))}
    </nav>
  );
}
