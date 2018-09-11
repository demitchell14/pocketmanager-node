
import store from "../store";

const getters = {
    title: "Pocket Manager",
    session: {
        "max-length": (1000 * 60),
    },

    Api: function() {
        return _api.v1;
    }
};

const actions = {
    token: function(action, ...opts) {

        let set = value => getters.token = value;
        switch(action) {
            case "set":
                return set(opts[0]);
            default:
                return { set: set };
        }
    }
};

let _api = {
    v1: {
        entries: "/v1/api/entries.json"
    },
};

//_api.v1.entries.url = "/v1/api/entries.json";
//_api.v1.entries.heading = "";

export default {
    get: function(func,...opts) {
        if (typeof func === 'string') {
            if (typeof getters[func] === 'function') {
                opts.unshift("");
                return getters[func].call(opts);
            } else {
                if (typeof getters[func] === "object" && typeof opts !== "undefined") {
                    return getters[func][opts[0]];
                }
                return getters[func];
            }
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
    Api: _api
};
export const Api = _api;