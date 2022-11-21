import { Link } from '@remix-run/react';
import { Post } from '~/ts/post-api';
import PostMeta from './PostMeta';

type PostListProps = {
    posts: Post[];
};

export default function PostList({ posts }: PostListProps) {
    return (
        <div>
            <ul className="c-posts__list">
                {posts.map((post) => (
                    <li key={post.permalink} className="c-posts__item">
                        <h2
                            className={`c-posts__title ${
                                post.draft ? 'c-posts__title--draft' : ''
                            }`}>
                            <Link
                                to={post.permalink}
                                title={post.title}
                                prefetch="intent">
                                {post.title}
                            </Link>
                        </h2>

                        <p
                            className="c-posts__excerpt u-post-styles"
                            dangerouslySetInnerHTML={{ __html: post.excerpt }}
                        />

                        <div className="c-posts__meta">
                            <PostMeta post={post} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
