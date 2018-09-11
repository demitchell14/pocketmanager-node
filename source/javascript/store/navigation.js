import m from "mithril";

let store = {
    isEnabled: true,
    state: {
        hidden: "nav-hidden",
        inactive: "nav-hidden",
        active: "nav-open",
        disabled: "nav-block",
    },
};

const actions = {
    handlebar: function(evt) {
            let wrapper = document.getElementById("wrapper");
            //console.log(store);
            if (store.isEnabled) {
                if (evt) {
                    wrapper.classList.toggle(store.state.active);
                    wrapper.classList.toggle(store.state.inactive);
                }
                wrapper.classList.remove(store.state.disabled);
            }
        //console.log(evt);
    },
    enable: function(status, wait) {
        store.isEnabled = status;
        //console.log(store);
        let run = function() {
            const wrapper = document.getElementById("wrapper");
            if (status === false) {
                wrapper.classList.remove(store.state.active, store.state.inactive);
                wrapper.classList.add(store.state.disabled);
            } else {
                //enabling navigation, remove blockers
                wrapper.classList.remove(store.state.disabled);
                wrapper.classList.add(store.state.inactive);
                if (store.state.hidden !== store.state.inactive)
                    wrapper.classList.remove(store.state.hidden);
            }

        };
        if (status === true) {
            if (window.innerWidth > 425)
                store.state.inactive = "nav-mini";
        }
        if (typeof wait === "number") {
            setTimeout(run, wait);
        } else run();
        //actions.handlebar();
        m.redraw();
    },
};

const getters = {
    enabled: function() {
        return store.isEnabled;
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

export const C = {
    enable: function(status) {
        if (status === false) {
            document.getElementById("wrapper").classList.remove("nav-open", "nav-mini");
        }
        store.isEnabled = status;
    },
    get: function(opt) {

    },
    actions: {
        handlebar: function(evt) {
            let wrapper = document.getElementById("wrapper");
            if (store.isEnabled)
                wrapper.classList.toggle("nav-open");
            //console.log(evt);
        }
    }
}