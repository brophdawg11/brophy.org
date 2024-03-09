import fs from 'fs/promises';
import path from 'node:path';
import url from 'node:url';

import cheerio from 'cheerio';
import parseFrontMatter from 'front-matter';
import { marked } from 'marked';
import prism from 'prismjs';
import readingTime from 'reading-time';
import invariant from 'tiny-invariant';
import vagueTime from 'vague-time';
import loadLanguages from 'prismjs/components/index.js';

loadLanguages(['bash', 'json', 'typescript', 'markdown']);

let postsCache: Post[] | null = null;
const postCache: Record<string, FullPost> = {};

export interface PostMarkdownAttributes {
  title: string;
  author: string;
  postDate: string;
  tags: string;
  draft?: boolean;
  crossPostName?: string;
  crossPostUrl?: string;
  crossPostExcerpt?: string;
}

export type Post = Omit<PostMarkdownAttributes, 'tags' | 'crossPostExcerpt'> & {
  slug: string;
  tags: string[];
  permalink: string;
  excerpt: string;
  readingTime: string;
  relativeDate: string;
};

export type FullPost = Post & {
  body: string;
};

const postsPath = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  '..',
  '..',
  'posts'
);

function isValidPostAttributes(
  attributes: unknown
): attributes is PostMarkdownAttributes {
  return (
    attributes != null &&
    typeof attributes === 'object' &&
    'title' in attributes
  );
}

function excerpt(html: string): string {
  // eslint-disable-next-line import/no-named-as-default-member
  const $ = cheerio.load(html);
  return $.html($('p').first())
    .trim()
    .replace(/^<p>/, '')
    .replace(/<\/p>$/, '');
}

function md(str: string) {
  return marked.parse(str, {
    highlight: (code, lang) =>
      prism.highlight(code, prism.languages[lang], lang),
  });
}

async function readFullPost(filename: string): Promise<FullPost> {
  const file = await fs.readFile(path.join(postsPath, filename));
  const fileContents = file.toString();
  const { attributes, body } = parseFrontMatter(fileContents);
  invariant(
    isValidPostAttributes(attributes),
    `${filename} has bad meta data!`
  );
  const slug = filename.replace(/\.md$/, '');
  const html = md(body);
  return {
    ...attributes,
    body: html,
    tags: (attributes.tags ?? '').split(','),
    slug,
    permalink: `/post/${slug}`,
    excerpt: attributes.crossPostExcerpt
      ? excerpt(md(attributes.crossPostExcerpt))
      : excerpt(html),
    readingTime: readingTime(body).text,
    relativeDate: vagueTime.get({ to: attributes.postDate }),
  };
}

async function readPost(filename: string): Promise<Post> {
  const fullPost = await readFullPost(filename);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { body, ...rest } = fullPost;
  return { ...rest };
}

export async function getPosts(): Promise<Post[]> {
  if (!postsCache) {
    const dir = await fs.readdir(postsPath);
    const posts = await Promise.all(dir.map(readPost));
    postsCache = posts
      .filter((p) => process.env.SHOW_DRAFT_POSTS === 'true' || !p.draft)
      // Reverse chronological order
      .sort((a, b) =>
        a.postDate < b.postDate ? 1 : a.postDate > b.postDate ? -1 : 0
      );
  }
  return postsCache;
}

export async function getPost(slug: string): Promise<FullPost> {
  if (!postCache[slug]) {
    postCache[slug] = await readFullPost(`${slug}.md`);
  }
  return postCache[slug];
}
