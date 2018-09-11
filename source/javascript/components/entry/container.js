import m from "mithril";
import BSCard from "../bs-card.js";
import Entry from "./entry.jsx";
import {Entries} from "../../store";
import { sortEntries } from "../../util/functions";

const EntryContainer = {
    oninit: function(vnode) {
        vnode.state.entries = [
            "Loading..."
        ]
    },
    oncreate: function(vnode) {
        Entries
            .actions("load", { type: "all" })
            .then(results => {
                //console.log(results);
                results.entries = sortEntries(results.entries, "duration.start");
                vnode.state.entries = results.entries.map(entry => ({entry: entry, user: results.user}));//.map(entry => m(Entry, {entry: entry, user: results.user}));
                console.debug(`--- ./components/entry/container.oncreate ---`);
                console.debug(`--- Entries.json entries                  ---`);
                console.debug(vnode.state.entries);
                console.debug(`--- ./components/entry/container.oncreate ---`);
                m.redraw();
            })
            .catch(err => {
                //console.log(err);
                vnode.state.entries = ["error Occurred"];
        });
    },
    onupdate: function(vnode) {

    },
    view: function(vnode) {
        return m(BSCard, {shadow: "light"}, [

            m("heading", { className: "border-bottom" }, [
                m("h5", m("a", { className: "collapse-btn w-100" }, [
                    m("span", "Entries"),
                    //add button???
                ]))
            ]),

            m("body", { className: "collapse show" }, [
                m("div", { className: "entry-list" }, [
                    m.trust("<!-- Entry Items >> ./source/javascript/components/entry/entry.jsx -->"),
                    m("ul", { className: "list-group list-group-flush" }, vnode.state.entries.map(entry => {

                        if (typeof entry === "string")
                            return m("div", entry);
                        else {
                            //console.log(entry);
                            return m(Entry, entry)
                        }
                    }))
                ])
            ])

        ])
    },

    /*view1: function(vnode) {
        return (
            <BSCard shadow={"light"}>
                <heading className={"border-bottom"}>
                    <h5>
                        <a className="collapse-btn w-100">
                            <span>Entries</span>
                        </a>
                    </h5>
                </heading>
                <body className={"collapse show"}>
                <div className="entry-list">
                    <ul className="list-group list-group-flush">
                        <Entry />
                        <Entry />
                        <Entry />
                        <Entry />
                    </ul>
                </div>
                </body>
            </BSCard>
        )
    },*/
};

export default EntryContainer;