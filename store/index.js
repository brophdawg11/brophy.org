import Vuex from 'vuex';
import mutationHandlers from './mutations';

export default () => new Vuex.Store({
    state: {
        url: 'http://brophy.org',
        title: 'Matt Brophy',
        description: 'Matt Brophy\'s Website',
        rss: {
            title: 'Matt Brophy\'s Blog',
        },
        cssFile: 'css/app.css',
        owner: 'Matt Brophy',
        pageSize: 6,
        asides: [
            '/images/asides/bike.jpg',
            '/images/asides/bike2.jpg',
            '/images/asides/bike3.jpg',
            '/images/asides/bike4.jpg',
            '/images/asides/bikes.jpg',
        ],
    },
    mutations: mutationHandlers,
});
