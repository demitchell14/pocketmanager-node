import m from "mithril";

import Breadcrumbs from "../components/breadcrumbs.jsx";
//import BSCard from "../components/bs-card.js";
import EntryContainer from "../components/entry/container.js";

import { user, navigation } from "../store";
import {FontAwesome} from "../util/fontawesome";

const Dashboard = {
    oninit: function(vnode) {
        //User
    },
    oncreate: function(vnode) {
        FontAwesome().then(success => {
            //console.log("font awesome icons loaded");
            navigation.actions("enable", true);
        });
    },
    onupdate: function(vnode) {
    },

    view: function(vnode) {
        return m("div", { className: "container-fluid mt-3" }, [

            m(Breadcrumbs, [
                m("li", "Dashboard")
            ]),

            //m.trust("<!-- Charts Row >> ./source/js/routes/dashboard.jsx -->"),

            m("div", { className: "row" }, [

                m("div", { className: "col" }, [
                    m.trust("<!-- Entry Container >> ./source/javascript/components/entry/container.js -->"),
                    m(EntryContainer, {}),
                ])

            ])

        ]);
    },

    /*view1: function(vnode) {
        return (
            <div className="container-fluid mt-3">
                <Breadcrumbs>
                    <li>Dashboard</li>
                </Breadcrumbs>

                {m.trust("<!-- Charts Row >> ./source/js/routes/dashboard.jsx -->")}
                <div className="row">
                    <div className="col">
                        {m.trust("<!-- Entry Listing -->")}
                        {m(EntryContainer, {})}
                    </div>
                </div>
                <hr className="my-4"/>
                <div className="row">
                </div>

            </div>
        )
    }*/
};

export default Dashboard;