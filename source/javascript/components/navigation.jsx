import m from "mithril";

import {navigation, Notifications} from "../store";
import {buildIcon as icon, clickInsideElement} from "../util/functions";

//import {FontAwesome} from "../util/fontawesome"

const Navigation = {
    oncreate: function(vnode) {
        let nav = vnode.dom.querySelector("#primarynav");
        let links = vnode.dom.querySelectorAll("a");
        links.forEach(function(item) {
            item.addEventListener("click", function(evt) {
                let target = evt.currentTarget;
                let li = target.parentNode,
                    liNodes = li.childNodes;
                let ul = containsList(liNodes);
                if (ul) {
                    evt.preventDefault();
                    target.classList.toggle("active");
                    ul.classList.toggle("show");
                }
            });
        });
        //navigation.actions("handlebar");
    },
    view: function(vnode) {
        return (
            <aside id={"navigation"}>
                <div className="heading">
                    <h4>Navigation</h4>
                    <a style="font-size: 150%"
                       className={`text-white rounded navigation-handler`}
                       onclick={navigation.actions().handlebar}>
                        {icon({
                            icon: {
                                parent: {
                                    type: "span",
                                    className: "fa-layers fa-fw align-middle",
                                    style: "",
                                    children: [
                                        {type: "i", className: "fal fa-bars align-middle"},
                                        Notifications.get("bubble", "all")
                                    ]
                                }
                            }
                            //icon: "fal fa-bars align-middle"
                        })}
                    </a>
                </div>
                <div className={"scroll-sidebar"}>
                    <nav className={"sidebar-nav"}>
                        <ul id={"primarynav"}>
                            {listItem({
                                icon: {
                                    parent: {
                                        type: "span",
                                        className: "fa-layers fa-fw align-middle",
                                        style: "font-size: 150%;",
                                        children: [
                                            {type: "i", className: "fal fa-home"},
                                            Notifications.get("bubble", "home")
                                        ]
                                    },
                                },
                                title: "Dashboard",
                                font150: true,
                                link: "/",
                            })}
                            {listItem({
                                //icon: "fal fa-home",
                                title: "Authorize",
                                font150: true,
                                link: "/authorize",
                            })}
                            {listItem({
                                icon: "fal fa-file-plus",
                                title: "Manage Cities",
                                font150: true,
                                sub: [
                                    {
                                        title: "Create Time Entry",
                                        icon: "fal fa-hourglass mr-2",
                                        font150: true,
                                    },
                                    {
                                        title: "Create Expense Entry",
                                        icon: "fal fa-usd-circle mr-2",
                                        font150: true,
                                    },
                                    {
                                        title: "Create Auto Entry",
                                        icon: "fal fa-car mr-2",
                                        font150: true,
                                    },

                                ]
                            })}
                            {listItem({
                                icon: {
                                    parent: {
                                        type: "span",
                                        className: "fa-layers fa-fw align-middle",
                                        style: "font-size: 150%;",
                                        children: [
                                            {type: "i", className: "fas fa-comments"},
                                            Notifications.get("bubble", "chat")
                                        ]
                                    },
                                },
                                /*icon: m("span", { className: "fa-layers fa-fw align-middle", style: "font-size: 3em;"}, [
                                    m("i", { className: "fas fa-envelope" }),
                                    m("span", { className: "fa-layers-counter fa-layers-bottom-left", style: "background: tomato;" }, "1,555"),
                                ]),*/
                                title: "Manage Vendors",
                                font150: true,
                                sub: [

                                ]
                            })}
                        </ul>
                    </nav>
                </div>
            </aside>
        );
    }
};

let listItem = function(opts) {

    let isLocal = function() {
        if (opts.url) {
            if (opts.url.search(/http/)) {
                return true;
            }
        } else {
            return true;
        }
        return false;
    };
    let apiCall = false;
    /*let apiCall = typeof opts.link === 'string' && opts.link.match(/\/api/);
    let action = function(evt) {
        evt.preventDefault();
        if (apiCall) {
            let route = opts.link.split("/").splice(2).join("/");
            func.api.get(route, true).then(data => {
                State.reset();
            });
            return false;
        }
        return false;
    }*/

    let a = undefined;
    if (apiCall) {
        a = m("a", {onclick: apiCall ? action : "", className: opts.sub ? "has-arrow" : ""},
            [
                (opts._iterated ? icon(opts, true) : ""),
                (<span className="hide-menu">{opts.title}</span>),
                (opts._iterated ? "" : icon(opts))
            ]
        );
    } else {
        a = m("a", {className: opts.sub ? "has-arrow" : "", href: opts.url ? opts.url : opts.link ? opts.link : "", oncreate: m.route.link},
            [
                (opts._iterated ? icon(opts, true) : ""),
                (<span className="hide-menu">{opts.title}</span>),
                (opts._iterated ? "" : icon(opts))
            ]
        );
    }
    return (
        <li className={opts._iterated ? "" : "list-group-item"}>
            {a}
            {opts.sub ? listItemSub(opts.sub) : ""}
        </li>
    );
};

let listItemSub = function(opts) {
    //console.log(opts);
    opts = opts.map(function(item) {
        item._iterated = true;
        return listItem(item);
    });
    return (
        <ul className={"collapse"}>
            {opts}
        </ul>
    );
    //return ;
};


let containsList = function(array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].tagName === "UL") return array[i];
    }
    return false;
};

export default Navigation;
//module.exports = Navigation;