


let functions = {
    header: function (req, res) {
        //console.log(this);
        if (this instanceof Array) {

            let hasHeaders = this.filter(search =>
                Object.keys(req.headers)
                    .find(id => id === search));

            let headers = {};
            if (hasHeaders.length > 0) {
                //console.log(hasHeaders);
                try {
                    hasHeaders.map(item => headers[item] = req.headers[item]);

                    //TODO add token expiration and date checking to ensure token is still valid

                    if (this.find(item => item === "token")) {
                        //console.log("We are setting a token");
                        req.session.method = req.session.method || [];
                        let x = req.session.method.find(id => id === "token");
                        if (typeof x === "undefined") req.session.method.push("token");
                    }
                } catch (err) {
                    console.error(err);
                }
            }
            return Object.keys(headers).length > 0 ? {header: headers} : hasHeaders.length > 0;
        }
    },

    session: function (req, res) {
        //console.log(this);
        let keys = Object.keys(this);
        let values = Object.values(this);

        let root = "user";

        const success = keys.every((item, id) => {
            if (/^\d+$/.test(item)) {
                let value = req.session[values[id]];
                return typeof value !== "undefined"
            } else {
                if (typeof req.session[item] === "object") {
                    //console.log("DUMBASS");
                    let value = req.session[item][values[id]];
                    return typeof value !== "undefined"
                }
            }
        });

        let response = { session: {}};
        response.session[root] = req.session[root];
        return success ? response : success;
    }
};

const handleRequirement = function() {
    let handle = [];
    if (this) {
        if (this instanceof Array) {
            this.map(item => {
                if (typeof functions[item] === "function") {
                    console.log(functions[item]);
                    handle.push(functions[item].bind(this))
                }
            })
        } else {
            Object.keys(this).map(item => {
                let key = item,
                    value = this[item];
                //console.log(`${key}: ${value} / ${typeof value}`);

                if (typeof functions[key] === "function") {
                    //console.log(value);
                    handle.push(functions[key].bind(value));
                }
            });
        }
    }
    //console.log(handle);
    return handle;
};

const reducer = function(arr, fn) {
    //console.log("WHAT THE FUCK.");
    let x;
    if (typeof arr === "function") {
        x = arr;
        arr = {};
    }
    if (x)  Object.assign(arr, (typeof x === "function" && x !== undefined ? x(req, res) : x));
    if (fn) Object.assign(arr, (typeof fn === "function" && fn !== undefined ? fn(req, res) : fn));
    //console.log(arr);
    return arr;
};


/**
 *
 * @param opts {Object}
 * @param opts.require {Object}
 * @param opts.mode {string} "block" sets a blacklist, where "allow" sets a whitelist
 * @returns {{middleware: RequestHandler}}
 * @constructor
 */
const AuthorizationService = function(opts) {
    let store = {};
    store.mode = opts.mode || "block";


    if (typeof opts === "object") {
        store.require   = handleRequirement.call(opts.require);
        store.run       = handleRequirement.call(opts.run);
    }

    //console.log(this);

    //console.log(store);
    /**
     * @param req {Request}
     * @param res {Response}
     * @type {any}
     */
    //function primaryFn(req, res, next) {
    let primaryFn = function(req, res, next) {

        //console.log(this);

        let required = store.require.length > 0 ? Object.values(store.require).map(fn =>
            typeof fn === "function" ? fn(req, res) : undefined
        ) : {};
        required = required instanceof Array ? required.reduce(reducer) : {};

        //console.log(required);
        let authorized = Object.keys(required).length > 0 ? Object.keys(opts.require).every(grouping =>
            typeof Object.keys(required).find(group => group === grouping) !== "undefined"
        ) : store.require.length === 0;

        let runnables = store.run.length > 0 ? Object.values(store.run).map((fn) => typeof fn === "function" ? fn(req, res) : undefined) : {};
            runnables = runnables instanceof Array ? runnables.reduce(reducer) : {};
        //console.log(runnables);




            //if mode is set to allow, and all required fields are met, we allow access to the page.
            //if mode is set to block, and all required fields are met, we block the page
        if ((store.mode === "allow" && authorized) || (store.mode === "block" && !authorized)) {

            const AuthorizationService = class {


                constructor() {
                    this.results = {};
                }

                get() {
                    return this.results;
                }
                errors() {
                    return this.results.errors || [];
                }

                add(key, value) {
                    if (typeof value === "undefined") {
                        value = key;
                        key = undefined;
                    }
                    let errors;
                    if (value.errors) {
                        errors = value.errors;
                        value.errors = undefined;
                    }
                    Object.assign(this.results, value);
                    if (errors) {
                        this.results.errors.push(errors);
                        //Object.assign(, errors);
                    }
                    //this.results[key] = value;
                    return this;
                }

            };
            let auth = new AuthorizationService();
            auth.add("runnables", runnables);
            auth.add("required", required);
            console.log(auth.errors());
            req.AuthorizationService = auth;

            next();
            //console.log(req);
        } else {
            res.status(403).json({error: ["You are not authorized to view this page."]});
        }
    };

    return {
        middleware: primaryFn
    };


};

module.exports = AuthorizationService;