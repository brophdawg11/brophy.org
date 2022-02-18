import { LoaderFunction, useLoaderData } from 'remix';
import PostList from '~/components/PostList';
import { getPosts, Post } from '~/ts/post-api';

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
