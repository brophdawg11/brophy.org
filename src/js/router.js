import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// Expose a factory function to ensure a new router per request
export default function createRouter(/* store */) {
    return new Router({
        mode: 'history',
        routes: [{
            path: '/',
            name: 'Home',
            // Enable code splitting at the route level using async components
            component: () => import(
                /* webpackChunkName: "home" */
                '@components/views/Index.vue',
            ),
        }, {
            path: '/posts',
            name: 'Posts',
            // Enable code splitting at the route level using async components
            component: () => import(
                /* webpackChunkName: "posts" */
                '@components/views/Posts.vue',
            ),
        }, {
            path: '/post/:slug',
            name: 'Post',
            // Enable code splitting at the route level using async components
            component: () => import(
                /* webpackChunkName: "post" */
                '@components/views/Post.vue',
            ),
        }, {
            path: '/resume',
            name: 'Resume',
            // Enable code splitting at the route level using async components
            component: () => import(
                /* webpackChunkName: "resume" */
                '@components/views/Resume.vue',
            ),
        }],
    });
}
