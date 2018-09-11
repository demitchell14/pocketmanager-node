//import {Api} from "./config";
import {Config} from "../store";
import m from "mithril";

let store = {};

const getters = {
    entries: async function(opts) {
        //console.log(Api);
        console.log(opts);
        /*m.request({
            url: "/v1/api/vendors.json"
        }).then(res => store.vendors = res).then(res => {
            m.redraw();
            return res;
        })*/
    },
};

const actions = {
    load: async function(opts, reload) {
        //console.log(Api);
        let promise, timer;
        const token = await new Promise(resolve => {
            timer = setInterval(function() {
                const tk = Config.get("token");
                if (typeof tk !== "undefined") {
                    clearTimeout(timer);
                    resolve(tk);
                }
            }, 200);
        });
        if ((typeof reload === "boolean" && reload) || typeof store.entries === "undefined") {
            promise = await m.request({
                url: Config.get("Api").entries,
                headers: {
                    token: token
                }
            }).catch(err => err);

            if (promise.error) {
                throw promise.error;
            }

            store.entries = promise;
        } else promise = store.entries;
        return promise;
    }
};


export default {
    get: function(func,...opts) {
        if (typeof func === 'string') {
            if (typeof getters[func] === 'function') {
                opts.unshift("");
                return getters[func].call(opts);
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