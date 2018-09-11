import m from "mithril";
import { Config } from "../store";

let store = {};

const actions = {
    generate: async function(opts) {
        if (opts instanceof FormData) {
            opts = {data: opts};
            console.log(opts);
        }
        return load({
            url: "/v1/api/generate/vendor",
            method: "POST",
            data: opts.data
        }, "lastGeneratedVendor")
    },
};

const getters = {
    vendors1: async function(reload) {
        return load({
            url: "/v1/api/vendors.json"
        }, "vendors")
    },
    vendors: function(reload) {
        if (reload || typeof store.vendors === "undefined") {
            return m.request({
                url: "/v1/api/vendors.json"
            }).then(res => store.vendors = res).then(res => {
                m.redraw();
                return res;
            });
        } else return new Promise(resolve => resolve(store.vendors));
    }
};


const load = async function(options, storage, reload) {
    if (reload || typeof store[storage] === "undefined") {
        return await m.request(options).then(ret => store[storage] = ret);
    } else
        return await store[storage];
}

export default {
    get: function(func,...opts) {
        if (typeof func === 'string') {
            if (typeof getters[func] === 'function') {
                opts.unshift("");
                return getters[func].call(opts);
            }
            else
                return undefined;
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
    actions1: actions
}