import path from 'path';
import fs from 'fs/promises';

import cheerio from 'cheerio';
import { marked } from 'marked';
import prism from 'prismjs';
import invariant from 'tiny-invariant';
import parseFrontMatter from 'front-matter';
import readingTime from 'reading-time';
import vagueTime from 'vague-time';

const loadLanguages = require('prismjs/components/');
loadLanguages(['bash', 'json', 'typescript', 'markdown']);

let postsCache: Post[] | null = null;
const postCache: Record<string, FullPost> = {};

export type PostMarkdownAttributes = {
  title: string;
  author: string;
  postDate: string;
  tags: string;
  draft?: boolean;
  crossPostName?: string;
  crossPostUrl?: string;
  crossPostExcerpt?: string;
};

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

const postsPath = path.join(__dirname, '..', 'posts');

function isValidPostAttributes(
  attributes: any
): attributes is PostMarkdownAttributes {
  return attributes?.title;
}

function excerpt(html: string): string {
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
