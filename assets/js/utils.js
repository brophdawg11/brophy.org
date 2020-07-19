/* eslint-disable import/prefer-default-export */

export function getPostsContentChain($content) {
    return $content()
        .only(['slug', 'title', 'permalink', 'tags', 'excerpt', 'postDate', 'readingTime'])
        .where({
            draft: { $ne: true },
            extension: { $eq: '.md' },
        })
        .sortBy('postDate', 'desc');
}
