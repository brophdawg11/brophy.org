import type { Route } from './+types/_default.post.$slug';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import { useEffect } from 'react';
import invariant from 'tiny-invariant';

import ExternalLink from '~/components/ExternalLink';
import PostMeta from '~/components/PostMeta';
import PostNav from '~/components/PostNav';
import { getPost, getPosts } from '~/ts/post-api';

import '~/styles/prism.css';

export function meta({ data, matches }: Route.MetaArgs) {
  if (!data?.post) {
    return [{ title: 'Error' }];
  }

  const rootMatchMeta = matches[0].meta;
  return [
    rootMatchMeta.filter(
      (m) => !('title' in m) && 'name' in m && m.name !== 'description',
    ),
    { title: data.post.title },
    { name: 'og:title', content: data.post.title },
    { name: 'twitter:title', content: data.post.title },
    {
      name: 'og:url',
      content: `https://www.brophy.org/post/${data.post.slug}`,
    },
    {
      name: 'twitter:url',
      content: `https://www.brophy.org/post/${data.post.slug}`,
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;
  invariant(typeof slug === 'string', 'Invalid slug');
  if (slug === 'error') {
    throw new Error('wat');
  }
  if (slug === '404') {
    throw new Response(`Unable to find a post with slug "${slug}"`, {
      status: 404,
    });
  }
  const post = await getPost(slug);
  const posts = await getPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  const previousPost = posts[idx + 1];
  const nextPost = posts[idx - 1];
  return { post, previousPost, nextPost };
}

export default function PostView({ loaderData }: Route.ComponentProps) {
  const { post, previousPost, nextPost } = loaderData;

  const url = `https://www.brophy.org${post.permalink}`;
  const twitterUrl = `https://twitter.com/share?text=${post.title}&amp;url=${url}`;
  const twitterDiscussUrl = `https://twitter.com/search?q=${url}`;

  function shareTwitter(e: React.MouseEvent) {
    window.open(twitterUrl, 'twitter-share', 'width=550,height=235');
    e.preventDefault();
  }

  useEffect(() => {
    if (document.querySelectorAll('.codepen').length === 0) {
      return () => {
        // no-op
      };
    }
    const el = document.createElement('script');
    el.src = 'https://static.codepen.io/assets/embed/ei.js';
    el.async = true;
    document.head.appendChild(el);
    return () => el.parentNode?.removeChild(el);
  });

  return (
    <article>
      <header>
        <h1 className="c-post__title">{post.title}</h1>
        <div className="c-post__meta">
          <PostMeta post={post} />
        </div>
      </header>

      <div
        className="c-post__content u-post-styles"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />

      <footer>
        <div className="c-post__share">
          <p className="c-post__share-lead-in">Enjoy this post?</p>
          <a
            className="c-post__share-medium"
            href={twitterUrl}
            target="_blank"
            onClick={shareTwitter}
            rel="noreferrer">
            Share on Twitter
          </a>
          &nbsp;or&nbsp;
          <ExternalLink to={twitterDiscussUrl} className="c-post__share-medium">
            Discuss on Twitter
          </ExternalLink>
        </div>

        <PostNav previousPost={previousPost} nextPost={nextPost} />
      </footer>
    </article>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div className="c-post__error">
          <h1>🤔 {error.data.message}</h1>
          <br />
          <br />
          <Link to="/posts">Go back to the post listing</Link>
        </div>
      );
    }
  }

  throw error;
}
