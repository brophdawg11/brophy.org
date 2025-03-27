import type { Route } from './+types/_default.posts';
import PostList from '~/components/PostList';
import { getPosts } from '~/ts/post-api';

export async function loader() {
  const posts = await getPosts();
  return { posts };
}

export default function Posts({ loaderData }: Route.ComponentProps) {
  return <PostList posts={loaderData.posts} />;
}
