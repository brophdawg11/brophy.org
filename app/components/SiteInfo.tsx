import ExternalLink from './ExternalLink';

export interface SiteInfoProps {
    year: number;
}

interface LinkLine {
    href: string;
    title: string;
}
type Line = LinkLine | string;

export default function SiteInfo({ year }: SiteInfoProps) {
    const lines: Line[][] = [
        [
            'built with ',
            {
                href: 'https://vuejs.org/',
                title: 'vue',
            },
            ' and ',
            {
                href: 'https://nuxtjs.org/',
                title: 'nuxt',
            },
        ],
        [
            'stored in ',
            {
                href: 'https://www.github.com/brophdawg11/brophy.org',
                title: 'gitHub',
            },
            ', hosted in ',
            {
                href: 'https://www.netlify.com/',
                title: 'netlify',
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

    return (
        <div>
            {lines.map((line, index) => (
                <p key={index} className="page-footer-line">
                    {line.map((text, index2) =>
                        typeof text === 'string' ? (
                            <span key={index2}>{text}</span>
                        ) : (
                            <ExternalLink key={index2} href={text.href}>
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
