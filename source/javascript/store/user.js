import m from "mithril";
//import {Api} from "./config";
import {Config} from "../store";

let store = {
    id: false,
};

const actions = {
    session: async function(reload) {
        if (reload || typeof store.session === "undefined") {
            return await m.request({
                url: "/v1/api/session",
                //TODO add token authorization
                //contentType: "text/plain",
                //deserialize: val => val
            }).then(ret => {
                console.debug("--- ./store/user.session ---");
                console.debug(`Logged In: ${ret.loggedIn}`);
                if (ret.loggedIn) {
                    store.loggedIn = ret.loggedIn;
                    store.session = ret.session;
                    Config.actions("token", "set", ret.session.token);
                    console.debug(store.session);
                }
                console.debug("--- ./store/user.session ---");
                return ret;
            });
        } else
            return await store;
    },
    authorize: async function(e) {
        e.preventDefault();
        const inputs = this.querySelectorAll("input");
        let formdata = new FormData();

        inputs.forEach(item => formdata.append(item.name, item.value));

        return await m.request({
            method: "POST",
            url: "/v1/api/session/auth",
            data: formdata
            //TODO add token authorization
        }).then(response => {
            console.debug("--- ./store/user.authorize ---");
            if (response.loggedIn) {

                store.loggedIn = response.loggedIn;
                store.session = response.session;
                Config.actions("token", "set", response.session.token);
                console.debug(store.session);
                m.route.set(m.route.param("forward") ? m.route.param("forward") : "/");
            } else {
                store.loggedIn = false;
                store.error = response.error;
                console.debug(store.error);
            }
            console.debug("--- ./store/user.authorize ---");
        })
    },
    getCities: async function(reload) {
        return await load({
            url: "/v1/api/session/cities",
            method: "GET"
            //TODO add token authorization
        }, "activeCities", reload);
    },
};

const getters = {
    accessible: function(path) {
        //TODO Make accessibility manageable by the user rights
        console.log(store);
        console.log(typeof store.session);
        return typeof store.session === "object";
    },
    cities: function() {
        return store.activeCities || [];
    },
    session: function() {
        return store.session || {};
    },
    status: function() {
        const error = store.error;
        store.error = undefined;
        return {
            loggedIn: store.loggedIn,
            error: error,
            session: store.session,
        }
    }
};


const load = async function(options, storage, reload) {
    if (reload || typeof store[storage] === "undefined") {
        return await m.request({
            url: typeof options === "object" ? options.url : options,
        }).then(ret => store[storage] = ret);
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
}