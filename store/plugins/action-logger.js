/* eslint-disable no-console */

// Functions borrowed from:
// https://github.com/vuejs/vuex/blob/dev/src/util.js
// https://github.com/vuejs/vuex/blob/dev/src/plugins/logger.js

function repeat(str, times) {
    return (new Array(times + 1)).join(str);
}

function pad(num, maxLength) {
    return repeat('0', maxLength - num.toString().length) + num;
}

function find(list, f) {
    return list.filter(f)[0];
}

function deepCopy(obj, cache = []) {
    // just return if obj is immutable value
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // if obj is hit, it is in circular structure
    const hit = find(cache, c => c.original === obj);
    if (hit) {
        return hit.copy;
    }

    const copy = Array.isArray(obj) ? [] : {};
    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
    cache.push({
        original: obj,
        copy,
    });

    Object.keys(obj).forEach(key => {
        copy[key] = deepCopy(obj[key], cache);
    });

    return copy;
}

export default function actionLoggerPlugin(store) {
    store.subscribeAction((action, state) => {
        const isServer = process.env.VUE_ENV === 'server';
        const time = new Date();
        const hours = pad(time.getHours(), 2);
        const minutes = pad(time.getMinutes(), 2);
        const seconds = pad(time.getSeconds(), 2);
        const ms = pad(time.getMilliseconds(), 3);
        const formattedTime = ` @ ${hours}:${minutes}:${seconds}.${ms}`;
        const message = `action ${action.type}${formattedTime}`;
        const currState = isServer ? '{ ... }' : deepCopy(state);
        const loggedAction = isServer ? action.type : action;

        try {
            console.groupCollapsed(message);
        } catch (e) {
            console.log(message);
        }

        console.log('%c action ', 'color: #03A9F4; font-weight: bold', loggedAction);
        console.log('%c current state', 'color: #03A9F4; font-weight: bold', currState);

        try {
            console.groupEnd();
        } catch (e) {
            console.log('—— log end ——');
        }
    });
}
