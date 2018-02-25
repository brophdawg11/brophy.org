import { extend, map, omit, sortBy } from 'lodash';
import cheerio from 'cheerio';
import readingTime from 'reading-time';

export function excerpt(body) {
    const $ = cheerio.load(body);
    return $.html($('p').first())
        .trim()
        .replace(/^<p>/, '')
        .replace(/<\/p>$/, '');
}

export function enhancePost(post) {
    return extend(omit(post, 'body'), {
        excerpt: excerpt(post.body),
        readTime: readingTime(post.body),
    });
}

export function enhancePosts(posts) {
    return map(posts, p => enhancePost(p));
}
