import m from "mithril";
import moment from "moment";
import { user } from "../store";


/*
                                icon: {
                                    parent: {
                                        type: "span",
                                        className: "fa-layers fa-fw align-middle",
                                        style: "font-size: 3em;",
                                        children: [
                                            {type: "i", className: "fas fa-envelope"},
                                            {
                                                type: "span",
                                                className: "fa-layers-counter fa-layers-bottom-left",
                                                style: "background: tomato;",
                                                innerHTML: "1,555"
                                            }
                                        ]
                                    },
                                },
 */
const _buildIconElement = function(opts, leftAligned) {
    if (typeof opts.icon === "object") {
        let fml = "";
        let icon = opts.icon;
        if (icon.parent) {
            const build = function(children) {
                //console.log(children);

                return children.map(function(layer) {
                    //console.log(layer);
                    if (typeof layer === "object") {
                        let type = layer.type;
                        let innerHTML = layer.innerHTML;
                        layer.type = undefined;
                        layer.innerHTML = undefined;
                        if (typeof type === "string")
                            return m(type, layer, innerHTML);
                        else m("span");
                    }
                });
            };
            let p = icon.parent;
            let type = p.type;
            let children = p.children;
            p.type = undefined;
            p.children = undefined;
            fml = m(type, p, build(children))
            //console.log(fml);
            return fml;
        }
        return "";
    }
    if (typeof opts === "string") {
        opts = {icon: opts};
    }
    opts.icon += " fa-fw ";
    opts.icon += `${leftAligned ? "left" : "right"}`;
    if (typeof opts === "object") {
        let style = "",
            classes = "",
            transform = "";

        if (opts.icon && typeof opts.icon === "string") {
            classes += opts.icon;
        }
        if (opts.style && typeof opts.style === "string") {
            style += opts.style;
        }
        if (opts.font150) {
            style += "font-size: 150%";
            classes += " align-top ";
        }
        if (opts.transform) {
            transform = opts.transform;
        }

        return m("i", {
            className: `${classes}`,
            style: `${style ? style : ""}`,
            "data-fa-transform": transform ? transform : ""
        });
    }
};

/**
 * @return {m[]}
 */
let _getCityList = function() {
    const cities = user.get("cities"); //.cities();
    //console.log(cities);
    if (cities.length > 0)
        return cities.map(city => m("option", {value: city.folder}, city.name));
    else
        return m("option", {value: -1}, "loading...");
};


/**
 * Function to check if we clicked inside an element with a particular class
 * name.
 *
 * @param {Object} e The event
 * @param {String} className The class name to check against
 * @return {Boolean}
 */
function _clickInsideClass( e, className ) {
    var el = e.srcElement || e.target;

    if (el.classList.contains(className)) {
        return el;
    } else {
        while (el = el.parentNode) {
            if (el.classList && el.classList.contains(className)) {
                return el;
            }
        }
    }

    return false;
}

/**
 *
 * @param opts {Object}
 * @param {string} [opts.type=""] - input type
 * @param {string} [opts.label=""] - label element text
 * @param {(boolean|string)} [opts.autoComplete=false]
 * @param {(boolean|string)} [opts.details=false]
 * @param {string} opts.name - default: ""
 *
 * @return {m}
 */
let _createSpecialInputGroup = function(opts) {
    let options = {
        type: "text",
        label: "",
        autoComplete: false,
        details: false,
        name: "",
    };
    Object.assign(options, opts);

    return m("div", {className: "form-group special"}, [
        (options.details ? (
            m("span", {className: "form-text"}, options.details)
        ) : ""),
        m("input", {
            type: options.type,
            autoComplete: options.autoComplete ? options.autoComplete : undefined,
            className: "form-control pushaway-input",
            placeholder: " ",
            name: options.name,
        }),
        m("label", {className: "pushaway-label"}, options.label),
        m("span", {className: "forcus-border"}, ""),
    ])
};

/**
 *
 * @param opts {Object}
 * @param {string} [opts.type=text] - input type (default: text)
 * @param {string} [opts.label=""] - label element text (default: "")
 * @param {(boolean|string)} [opts.autoComplete=false] - default: false
 * @param {(boolean|string)} [opts.details=false] - default: false
 * @param {string} opts.name - default: ""
 * @param {string} [opts.placeholder=""]
 * @param {boolean} [opts.input=false]
 *
 * @return {m}
 */
let _createInputGroup = function(opts) {
    let options = {
        type: "text",
        label: "",
        autoComplete: false,
        details: false,
        name: "",
        placeholder: "",
        inline: false,
    };
    Object.assign(options, opts);

    if (options.input) {
        let input = options.input;
        input.attrs = input.attrs || {};
        Object.assign(input.attrs, {
            className: `form-control ${options.inline ? "col" : ""}`,
            name: options.name
        });
    }

    return m("div", {className: options.inline ? "form-row" : "form-group"}, [
        options.label !== "" ? m("label", {className: `form-check-label ${options.inline ? "col-auto align-self-center mr-1" : ""}`}, options.label) : "",
        typeof options.input === "undefined" ? m("input", {
            type: options.type,
            autoComplete: options.autoComplete ? options.autoComplete : undefined,
            className: `form-control ${options.inline ? "col" : ""}`,
            placeholder: options.placeholder,
            name: options.name,
            value: options.value
        }) : options.input,
        (options.details ? (
            m("small", {className: "form-text text-muted ml-2"}, m.trust(options.details))
        ) : ""),

    ]);

};


const _buildFormData = function(inputs) {
    let data = new FormData();
    inputs.forEach(item => {
        let name = item.name || "";
        const iterable = name.match(/(.*)_[0-9+]$/);
        if (iterable) {
            name = iterable[1];
        }
        data.append(name, item.value);
        console.log(name, ", ", item.value);
    });
    return data;
};

const _sortEntries = function(entries, order, isAsc) {
    order = [order];
    if (order[0].indexOf(".") > 0) {
        order = order[0].split(".");
    }
    entries = entries.sort((entry,next) => {
        let target, compare;
        order.map(depth => target ? target = target[depth] : target = entry[depth]);
        order.map(depth => compare ? compare = compare[depth] : compare = next[depth]);

        switch(order.join(".")) {
            case "duration.end":
            case "duration.start":
                let a = moment(target),
                    b = moment(compare);

                return (typeof isAsc === "boolean" && isAsc) ? a.diff(b) < 0 : a.diff(b) > 0;
        }
        return 0;
    });
    //console.log(entries);
    return entries;
};


export const sortEntries = _sortEntries;
export const buildFormData = _buildFormData;
export const getCityList = _getCityList;
export const createInputGroup = _createInputGroup;
export const createSpecialInputGroup = _createSpecialInputGroup;
export const buildIcon = _buildIconElement;
export const clickInsideElement = _clickInsideClass;