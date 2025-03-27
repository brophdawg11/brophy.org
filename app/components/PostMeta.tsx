import { Link } from 'react-router';

import type { Post } from '~/ts/post-api';

interface PostMetaProps {
  post: Post;
}

export default function PostMeta({ post }: PostMetaProps) {
  let formattedDate = post.postDate;
  try {
    const date = new Date(post.postDate);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    const [, month, day, year] = date.toDateString().split(' ');
    formattedDate = `${month} ${day}, ${year}`;
  } catch (e) {
    // No-op
  }

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
