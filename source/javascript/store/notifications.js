//import {Api} from "./config";
import {Config} from "../store";
import m from "mithril";
import {FontAwesome} from "../util/fontawesome"

let store = {
    notifications: {},
    loaded: false
};

const _style = {
    "background": "tomato",
    "font-size": "170%",
    "margin": "-0.25rem -0.25rem 0 0",
}, style = Object.keys(_style).reduce((acc, key) => {
    return `${key}:${_style[key]};` + `${acc}:${_style[acc]};`;
});


const getters = {
    bubble: function(type) {

        //console.log(count);
        //TODO reduce handles tree structure {parent:{child:value,child:{child_child:value, child_child:value}}
        //console.log(store.notifications);
        let defaults = {};
        if (Object.keys(store.notifications).length > 0) {
            defaults = {
                type: "span",
                className: "fa-layers-counter",
                style: style,
                innerHTML: type === "all" ? Object.values(store.notifications).reduce((acc, next) => acc + next) : store.notifications[type]
            };
        }

        return type ? store.loaded && (type === "all" || store.notifications[type]) ? defaults : undefined : undefined;
    },
    entries: async function(opts) {
        //console.log(Api);
        //console.log(opts);
    },
};

const actions = {
    init: async function(opts, reload) {
        let fa = await FontAwesome()
            .catch(err => console.error(err));

        /* Simulated Notifications loader */
        let x = await new Promise(resolve => setTimeout(resolve, Math.random() * 100 * 20));
        //store.notifications.chat = 3;
        store.notifications.home = 2;

        store.loaded = true;
        m.redraw();
        return store;
    }
};


export default {
    get: function(func,...opts) {
        if (typeof func === 'string') {
            if (typeof getters[func] === 'function') {
                opts.unshift("");
                return getters[func].call(...opts);
            } else
                return getters[func];
        } else
            return getters;
    },
    actions: function(func, ...opts) {
        if (typeof func === 'string') {
            if (typeof actions[func] === 'function') {
                opts.unshift("");
                return actions[func].call(...opts);
            }
            else
                return undefined;
        } else
            return actions;
    },
}