import m from "mithril";
import moment from "moment";
//import BSCard from "../bs-card.js";
import {buildIcon} from "../../util/functions";
import {Notifications} from "../../store";

const display = function(vnode, type) {
    const methods = {
        icon: function(entry) {
            const a = [
                m("span", { className: "fa-stack align-middle", style: "font-size: 1.5em;"}, [
                    m("i", { className: "fas fa-circle fa-stack-2x" }),
                    m("i", { className: "fas fa-flag fa-stack-1x fa-inverse fa-spin" }),
                ]),

//                m("span", { className: "fa-layers fa-fw align-middle", style: "font-size: 3em;"}, [
//                    m("i", { className: "fas fa-envelope" }),
//                    m("span", { className: "fa-layers-counter fa-layers-bottom-left", style: "background: tomato;" }, "1,555"),
//                ]),
            ]
            return a;
        },
        time: function(entry) {
            let _moment;
            if (typeof entry.duration === "object" && entry.duration.start) {
                _moment = moment(entry.duration.start);
                let date = _moment.format("MM/DD/YYYY h:mm a");

                //let duration = moment.duration(entry.duration.duration);
                return date;
            } else {
                return "unknown date";
            }
        },
        wage: function(entry) {
            //console.log(entry);
            let rate, wage = 0, rates = Object.keys(entry.rate);
            if (rates.length === 1) {
                rate = entry.rate[rates[0]];
            } else {
                rate = 0;
                //TODO add handling of multiple rates
                // Reduce to a single rate to be displayed
            }
            if (typeof entry.duration === "object" && entry.duration.duration) {
                let duration = moment.duration(entry.duration.duration);
                wage = (duration.asHours() * rate);
            }

            return m("span", `\$${wage.toFixed(2)}`);
        },
        duration: function(entry) {
            console.log(entry);
            let duration = "0 hours";
            if (typeof entry.duration === "object" && entry.duration.duration) {
                let mom = moment.duration(entry.duration.duration);
                let hours = mom.asHours().toFixed(0),
                    minutes = Math.floor((mom.asHours() % 1 * 60) / 15) * 15;

                duration = `${hours} hours ${minutes} minutes`
            }
            return m("span", duration);
        },
    };
    let entry = vnode.attrs.entry;
    return methods[type].call(null, entry);
};

const Entry = {
    oninit: function(vnode) {
        vnode.state.durationMode = "wage";
        vnode.state.change = function(evt) {
            //TODO possibly give popup with extra info ???
            vnode.state.durationMode === "duration" ? vnode.state.durationMode = "wage" : vnode.state.durationMode = "duration";
            return false;
            //m.redraw();
        }
    },
    oncreate: function(vnode) {
        vnode.dom.addEventListener("click", function(evt) {
            //console.log(evt);
        })
        //console.log(vnode.dom);
    },
    onupdate: function(vnode) {
        //console.log("Update");
    },

    view: function(vnode) {
        let user = vnode.attrs.user,
            entry = vnode.attrs.entry;

        //vnode.state.expand = true;

        /*
          <span class="fa-layers fa-fw" style="background:MistyRose">
            <i class="fas fa-envelope"></i>
            <span class="fa-layers-counter" style="background:Tomato">1,419</span>
          </span>
         */
        return m("li", { className: "list-group-item entry-item" }, [
            m("div", { className: "media align-items-center"}, [
                m("a", { className: "entry-icon" }, [

                    display(vnode, "icon")

                    //m("img", { src: "images/timeStop.gif", "max-width": 60})
                ]),

                m("div", {
                    className: "media-body entry-details"
                    //onclick: function() {}
                }, [
                    // -- Heading Bar
                    m("div", { className: "d-flex align-items-center flex-wrap entry-enter" }, [
                        m("h5", entry.client.name),
                        m("small", {
                            className: "ml-auto entry-minor",
                            onclick: vnode.state.change
                        }, display(vnode, vnode.state.durationMode))
                    ]),
                    // -- End Heading Bar

                    m("div", { className: "d-flex align-items-center" }, [
                        m("small", display(vnode, "time")),
                        m("a", {className: "small ml-auto text-muted"}, (`Project: ${entry.projectId}`))
                    ]),

                    m("p", { className: "small ml-1 mb-0 text-muted" }, entry.details),

                    vnode.state.expand ? m("div", { className: "collapse entry-expand show" }, [
                        m("div", [
                            m("div", { className: "d-flex justify-content-around pb-1" }, [
                                m("small", { className: "font-weight-bold text-success"}, "billable"),
                                m("small", [ "Rate By: ", m("span", { className: "text-primary"}, "User")])
                            ])
                        ])
                    ]) : ""
                ])
            ])
        ]);

        /*
                        <div className="collapse entry-expand ">
                            <div>
                                <div className="d-flex justify-content-around pb-1">
                                    <small className="font-weight-bold text-success">Billable</small>
                                    <small className="">Rate By: <span
                                        className="text-primary">User</span></small>
                                </div>
                            </div>
                        </div>
         */
    },
    viewN: function(vnode) {
        let user = vnode.attrs.user,
            entry = vnode.attrs.entry;

        console.log(vv(vnode))

        //console.log(entry.duration);
        //console.log(moment(entry.duration.start));
        //? moment(entry.duration.start) : "Unknown"
        return (
            <li className="list-group-item entry-item">
                <div className="media align-items-center">
                    <a href="#timehandler" className="entry-icon">
                        <img src="images/timeStop.gif" max-width="60"/>
                    </a>
                    <div className="media-body entry-details">
                        <div data-target="time.asp?key=134"
                             className="d-flex align-items-center flex-wrap entry-enter">
                            <h5>{entry.client.name}</h5>
                            <small className="ml-auto" onclick={vnode.state.change}>{display(vnode, vnode.state.durationMode)}</small>
                        </div>
                        <div className="d-flex align-items-center">
                            <small>{display(vnode, "time")}</small>
                            <a href="#!/" className="small ml-auto text-muted">{`Project ID: ${entry.projectId}`}</a>
                        </div>
                        <p className="small ml-1 mb-0 text-muted">{entry.details}</p>
                    </div>
                </div>
                <div className="collapse entry-expand ">
                    <div>
                        <div className="d-flex justify-content-around pb-1">
                            <small className="font-weight-bold text-success">Billable</small>
                            <small className="">Rate By: <span
                                className="text-primary">User</span></small>
                        </div>
                    </div>
                </div>
            </li>
        )
    },
};

export default Entry;