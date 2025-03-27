import invariant from 'tiny-invariant';

import type { Route } from './+types/_default.tag.$tag';
import PostList from '~/components/PostList';
import { getPosts } from '~/ts/post-api';

export async function loader({ params }: Route.LoaderArgs) {
  const { tag } = params;
  const posts = await getPosts();
  invariant(typeof tag === 'string', 'No tag provided');
  return {
    tag,
    posts: posts.filter((p) => p.tags.includes(tag)),
  };
}

export default function Posts({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1 className="tag__title">
        Posts tagged with <span className="tag__tag">{loaderData.tag}</span>
      </h1>
      <PostList posts={loaderData.posts} />
    </div>
  );
}
