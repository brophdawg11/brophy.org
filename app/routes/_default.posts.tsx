import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import PostList from '~/components/PostList';
import type { Post } from '~/ts/post-api';
import { getPosts } from '~/ts/post-api';

type LoaderData = {
  posts: Post[];
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const posts = await getPosts();
  return { posts };
};

export default function Posts() {
  const { posts } = useLoaderData<LoaderData>();
  return <PostList posts={posts} />;
}
