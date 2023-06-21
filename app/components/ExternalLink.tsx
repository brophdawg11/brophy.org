import * as React from 'react';

export interface ExternalLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
}

export default function ExternalLink({
  children,
  to,
  ...rest
}: ExternalLinkProps) {
  return (
    <a {...rest} href={to} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
