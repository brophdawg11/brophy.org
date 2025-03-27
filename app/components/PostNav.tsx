import { Link } from 'react-router';

import type { Post } from '~/ts/post-api';

interface PostNavProps {
  previousPost?: Post;
  nextPost?: Post;
}

export default function PostNav({ previousPost, nextPost }: PostNavProps) {
  return (
    <div className="c-post-nav">
      {previousPost ? (
        <div className="c-post-nav__link c-post-nav__link--previous">
          <Link
            className="c-post-nav__link-arrow"
            to={previousPost.permalink}
            title={previousPost.title}
            prefetch="intent">
            ⏪
          </Link>
          &nbsp;
          <Link
            to={previousPost.permalink}
            title={previousPost.title}
            prefetch="intent">
            {previousPost.title}
          </Link>
        </div>
      ) : null}

      {nextPost ? (
        <div className="c-post-nav__link c-post-nav__link--next">
          <Link
            to={nextPost.permalink}
            title={nextPost.title}
            prefetch="intent">
            {nextPost.title}
          </Link>
          &nbsp;
          <Link
            className="c-post-nav__link-arrow"
            to={nextPost.permalink}
            title={nextPost.title}
            prefetch="intent">
            ⏩
          </Link>
        </div>
      ) : null}
    </div>
  );
}
