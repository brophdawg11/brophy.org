import { Link } from '@remix-run/react';
import { Post } from '~/ts/post-api';

type PostMetaProps = {
  post: Post;
};

export default function PostMeta({ post }: PostMetaProps) {
  let formattedDate = post.postDate;
  try {
    const date = new Date(post.postDate);
    const [, month, day, year] = date.toDateString().split(' ');
    formattedDate = `${month} ${day}, ${year}`;
  } catch (e) {}

  return (
    <p className="post-meta">
      <span title={formattedDate} className="c-meta__date">
        {post.relativeDate}
      </span>

      <span className="post-meta__divider1">|</span>

      {!post.crossPostUrl ? (
        <>
          <span>{post.readingTime}</span>
          <br className="post-meta__br" />
          <span className="post-meta__divider2">|</span>
        </>
      ) : null}

      {post.tags.map((tag) => (
        <span key={tag} className="post-meta__link">
          <Link to={`/tag/${tag}/`} title={tag} prefetch="intent">
            {tag}
          </Link>
        </span>
      ))}
    </p>
  );
}
