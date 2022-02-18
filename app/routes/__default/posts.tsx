import { LoaderFunction, useLoaderData } from 'remix';
import PostList from '~/components/PostList';
import { getPosts } from '~/ts/post-api';

export const loader: LoaderFunction = async () => {
    const posts = await getPosts();
    return { posts };
};

export default function Posts() {
    const { posts } = useLoaderData();
    return <PostList posts={posts} />;
}
