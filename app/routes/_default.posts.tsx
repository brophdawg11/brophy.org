import { useLoaderData } from '@remix-run/react';

import PostList from '~/components/PostList';
import { getPosts } from '~/ts/post-api';

export async function loader() {
  const posts = await getPosts();
  return { posts };
}

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();
  return <PostList posts={posts} />;
}
