import { useEffect } from 'react';
import {
    LinksFunction,
    LoaderFunction,
    MetaFunction,
    useLoaderData,
} from 'remix';
import invariant from 'tiny-invariant';
import ExternalLink from '~/components/ExternalLink';
import PostMeta from '~/components/PostMeta';
import PostNav from '~/components/PostNav';
import { FullPost, getPost, getPosts, Post } from '~/ts/post-api';
import prismStyles from '~/styles/prism.css';

type LoaderData = {
    post: FullPost;
    previousPost: Post;
    nextPost: Post;
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
    return {
        title: data.post.title,
        'og:title': data.post.title,
        'twitter:title': data.post.title,
        'og:url': `https://www.brophy.org/post/${data.post.slug}`,
        'twitter:url': `https://www.brophy.org/post/${data.post.slug}`,
    };
};

export const links: LinksFunction = () => {
    return [
        {
            rel: 'stylesheet',
            href: prismStyles,
        },
    ];
};

export const loader: LoaderFunction = async ({
    params,
}): Promise<LoaderData> => {
    const { slug } = params;
    invariant(typeof slug === 'string', 'Invalid slug');
    const post = await getPost(slug);
    const posts = await getPosts();
    const idx = posts.findIndex((p) => p.slug === slug);
    const previousPost = posts[idx + 1];
    const nextPost = posts[idx - 1];
    return { post, previousPost, nextPost };
};

export default function Post() {
    const { post, previousPost, nextPost } = useLoaderData<LoaderData>();

    const url = `https://www.brophy.org${post.permalink}`;
    const twitterUrl = `https://twitter.com/share?text=${post.title}&amp;url=${url}`;
    const twitterDiscussUrl = `https://twitter.com/search?q=${url}`;

    function shareTwitter(e: React.MouseEvent) {
        window.open(twitterUrl, 'twitter-share', 'width=550,height=235');
        e.preventDefault();
    }

    useEffect(() => {
        if (document.querySelectorAll('.codepen').length === 0) {
            return () => {};
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
                        onClick={shareTwitter}>
                        Share on Twitter
                    </a>
                    &nbsp;or&nbsp;
                    <ExternalLink
                        to={twitterDiscussUrl}
                        className="c-post__share-medium">
                        Discuss on Twitter
                    </ExternalLink>
                </div>

                <PostNav previousPost={previousPost} nextPost={nextPost} />
            </footer>
        </article>
    );
}
