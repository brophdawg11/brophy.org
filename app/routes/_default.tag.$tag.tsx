import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';

import PostList from '~/components/PostList';
import type { Post } from '~/ts/post-api';
import { getPosts } from '~/ts/post-api';

interface LoaderData {
  tag: string;
  posts: Post[];
}

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const { tag } = params;
  const posts = await getPosts();
  invariant(typeof tag === 'string', 'No tag provided');
  return {
    tag,
    posts: posts.filter((p) => p.tags.includes(tag)),
  };
};

export default function Posts() {
  const { tag, posts } = useLoaderData<LoaderData>();
  return (
    <div>
      <h1 className="tag__title">
        Posts tagged with <span className="tag__tag">{tag}</span>
      </h1>
      <PostList posts={posts} />
    </div>
  );
}
