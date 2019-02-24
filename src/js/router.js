import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// Expose a factory function to ensure a new router per request
export default function createRouter(/* store */) {
    return new Router({
        mode: 'history',
        scrollBehavior(/* to, from, savedPosition */) {
            return { x: 0, y: 0 };
        },
        routes: [{
            path: '/',
            name: 'Home',
            component: () => import(
                /* webpackChunkName: "home" */
                '@components/views/Home.vue'),
        }, {
            path: '/posts',
            name: 'Posts',
            component: () => import(
                /* webpackChunkName: "posts" */
                '@components/views/Posts.vue'),
        }, {
            path: '/post/:slug',
            name: 'Post',
            component: () => import(
                /* webpackChunkName: "post" */
                '@components/views/Post.vue'),
        }, {
            path: '/tag/:tag',
            name: 'Tag',
            component: () => import(
                /* webpackChunkName: "tag" */
                '@components/views/Tag.vue'),
        }, {
            path: '/resume',
            name: 'Resume',
            component: () => import(
                /* webpackChunkName: "resume" */
                '@components/views/Resume.vue'),
        }],
    });
}
