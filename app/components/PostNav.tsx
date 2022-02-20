import { Link } from 'remix';
import { Post } from '~/ts/post-api';

type PostNavProps = {
    previousPost?: Post;
    nextPost?: Post;
};

export default function PostNav({ previousPost, nextPost }: PostNavProps) {
    return (
        <div className="c-post-nav">
            {previousPost && (
                <div className="c-post-nav__link c-post-nav__link--previous">
                    <Link
                        className="c-post-nav__link-arrow"
                        to={previousPost.permalink}
                        title={previousPost.title}>
                        ⏪
                    </Link>
                    &nbsp;
                    <Link
                        to={previousPost.permalink}
                        title={previousPost.title}>
                        {previousPost.title}
                    </Link>
                </div>
            )}

            {nextPost && (
                <div className="c-post-nav__link c-post-nav__link--next">
                    <Link to={nextPost.permalink} title={nextPost.title}>
                        {nextPost.title}
                    </Link>
                    &nbsp;
                    <Link
                        className="c-post-nav__link-arrow"
                        to={nextPost.permalink}
                        title={nextPost.title}>
                        ⏩
                    </Link>
                </div>
            )}
        </div>
    );
}
