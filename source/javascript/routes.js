import m from "mithril";
import {user, Config} from "./store";
import moment from "moment";

let timer, lastCheck;
let isAuthorized = async function() {

    let sessionTimer = function() {
        if (lastCheck instanceof moment) {
            let now = moment(),
                difference = now.diff(lastCheck),
                //max = (1000 * 60),
                max = Config.get("session", "max-length");
            console.debug(
`Session: difference: ${moment.duration(difference).asSeconds().toFixed(0)} seconds,
                max: ${moment.duration(max).asSeconds().toFixed(0)} seconds`
            );
            return difference > max;
        } else {
            lastCheck = moment();
            return true;
        }
    };

    let session = await user.actions("session", sessionTimer());//.session();
    return session.loggedIn;
};

export default {
    "/": {
        onmatch: async function(args, requestedPath) {
            const options = {
                requestedPath: requestedPath
            };
            if (await isAuthorized())
                return await import("./routes/dashboard.jsx").then(response => response.default);
            else
                m.route.set("/authorize", {forward: requestedPath});
        }
    },
    "/authorize": {
        onmatch: async function(args, requestedPath) {
            return await import("./routes/authorize.jsx").then(response => response.default);
        }
    },

    "/create/:type": {
        onmatch: async function(args, requestedPath) {
            if (await isAuthorized())
                return await import("./routes/generator.jsx").then(response => response.default);
            else
                m.route.set("/authorize", {forward: requestedPath});
        }
    },

    "/0/:city": {
        onmatch: async function(args, requestedPath) {
            if (await isAuthorized())
                return await import("./routes/cityview.jsx").then(response => response.default);
            else
                m.route.set("/authorize", {forward: requestedPath});
        }
    },

    "/0/:city/:vendor": {
        onmatch: async function(args, requestedPath) {
            if (await isAuthorized())
                return await import("./routes/vendorview.jsx").then(response => response.default);
            else
                m.route.set("/authorize", {forward: requestedPath});
        }
    }

};