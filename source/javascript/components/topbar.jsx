import {Notifications, navigation, Config} from "../store";

const m     = require("mithril");


import {buildIcon} from "../util/functions"

const TopBar = {
    view: function(vnode) {
        //console.log(navigation.get("enabled"));
        return (
            <header id={"header"} className="heading">
                <nav className="navbar border-bottom" style="position:inherit;">
                    <div className="navbar-header">
                        <a style={"font-size: 150%;"} className={"rounded navigation-handler"}
                           onclick={navigation.actions().handlebar}>
                            {buildIcon({ //navigation.get("enabled")
                                icon: {
                                    parent: {
                                        type: "span",
                                        className: `fa-layers fa-fw align-middle ${navigation.get("enabled") ? "" : "d-none"}`,
                                        style: "",
                                        children: [
                                            {type: "i", className: "fal fa-bars align-middle"},
                                            Notifications.get("bubble", "all")
//                                            {
//                                                type: "span",
//                                                className: "fa-layers-counter",
//                                                style: "background: tomato; font-size: 170%; margin: -0.3rem -0.3rem 0 0",
//                                                innerHTML: "5"
//                                            }
                                        ]
                                    }
                                }//<i className={"fa fal fa-bars align-middle"} />
                            })}
                        </a>
                        {m("a", {className: "navbar-brand", href: "/", oncreate: m.route.link}, [
                            m("h4", Config.get("title"))
                        ])}

                    </div>
                </nav>
            </header>
        );
    }
};

module.exports = TopBar;