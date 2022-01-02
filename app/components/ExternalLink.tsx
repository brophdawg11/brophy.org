import * as React from 'react';

export interface ExternalLinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export default function ExternalLink({ children, ...rest }: ExternalLinkProps) {
    return (
        <a {...rest} target="_blank" rel="noopener">
            {children}
        </a>
    );
}
