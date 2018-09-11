import m from "mithril";

import FontAwesome from "./util/fontawesome";

import {user, Notifications} from "./store";


// -- Heading / Top banner/bar
import topbarComponent from "./components/topbar.jsx";
const topbarContainer   = document.getElementById("topbar");

// -- Navigation sidepanel
import navbarComponent from "./components/navigation.jsx";
const navbarContainer   = document.getElementById("navigation");

// -- Primary app container containing route handling.
import appComponent from "./routes";
const appContainer      = document.getElementById("app");

m.route.prefix("");

m.mount(topbarContainer, topbarComponent);
m.mount(navbarContainer, navbarComponent);
m.route(appContainer, "/", appComponent);

FontAwesome()
    .then(success => console.debug("FontAwesome Initialized."))
    .catch(err => console.log("Failed to initialize FontAwesome."));

Notifications.actions("init")
    .then(res => console.debug("Notifications Initialized"))
    .catch(err => {
        console.log(err);
        console.error("Failed to initialize Notifications.")
    });

window.onkeydown = function(evt) {
    console.log(evt);
};
document.addEventListener("contextmenu", function(evt) {
    //alert(evt)
});