import ExternalLink from './ExternalLink';

interface LinkLine {
    href: string;
    title: string;
}
type Line = LinkLine | string;

export default function SiteInfo() {
    const lines: Line[][] = [
        [
            'built with ',
            {
                href: 'https://reactjs.org/',
                title: 'react',
            },
            ' and ',
            {
                href: 'https://remix.run/',
                title: 'remix',
            },
        ],
        [
            'stored in ',
            {
                href: 'https://www.github.com/brophdawg11/brophy.org',
                title: 'github',
            },
            ', hosted in ',
            {
                href: 'https://fly.io/',
                title: 'fly.io',
            },
        ],
        [
            'icons from ',
            {
                href: 'https://fontawesome.com/',
                title: 'font-awesome',
            },
            ' via ',
            {
                href: 'http://fontello.com/',
                title: 'fontello',
            },
        ],
    ];
    const year = new Date().getFullYear();

    return (
        <div>
            {lines.map((line, index) => (
                <p key={index} className="page-footer-line">
                    {line.map((text, index2) =>
                        typeof text === 'string' ? (
                            <span key={index2}>{text}</span>
                        ) : (
                            <ExternalLink key={index2} to={text.href}>
                                {text.title}
                            </ExternalLink>
                        )
                    )}
                </p>
            ))}

            <p className="page-footer-line">
                &copy; Copyright {year} Matt Brophy
            </p>
        </div>
    );
}
