import m from "mithril";

import store from "../store";

import BSCard from "../components/bs-card.js";

import {buildIcon as icon, createSpecialInputGroup as createInputGroup} from "../util/functions";


const errorAlert = {
    classes: function(status) {
        return status.error ? "alert alert-danger fade show" : "alert alert-danger fade";
    },
    message: function(status) {
        return status.error
    }
};

const Authorize = {
    oncreate: function(vnode) {
        store.navigation.actions("enable", false);
        let emailInput = document.querySelector("input[name='email']");
        emailInput.focus();
    },
    oninit: function(vnode) {
        vnode.state.input = {
            styles: function(type) {
                let standard = "form-control";
                let addition = "";
                if (type) {
                    switch(type) {
                        case "email":
                            addition = "col-12";
                            break;
                        case "password":
                            addition = "col-12";
                            break;
                    }
                }
                return `${standard} ${addition}`;
            },
        };
    },
    onbeforeremove: function(vnode) {
        vnode.dom.classList.add("slide-out-bck-top", "position-absolute");
        vnode.dom.style['z-index'] = 1000;
        return new Promise(resolve => {
            setTimeout(resolve, 5000);
        });
    },
    view: function(vnode) {
        let status = store.user.get("status");
        if (status) {
            //console.log(status);
        }
        return (
            <div className="container-fluid mt-3">
                <div className="row no-gutters">
                    <div className="col-lg-6 mx-auto">
                        <BSCard shadow={"light"} className="px-md-5 py-3">
                            <body className="px-5 py-3">
                                <form className="d-flex flex-column" onsubmit={store.user.actions().authorize}>
                                    {icon({
                                        icon: "fal fa-sign-in fa-10x mx-auto text-muted my-3"
                                    })}
                                    {createInputGroup({
                                        label: "Enter Email",
                                        placeholder: "Enter your email",
                                        type: "email",
                                        name: "email",
                                        autoComplete: "email"
                                    })}
                                    {createInputGroup({
                                        label: "Enter Password",
                                        placeholder: "Enter your password",
                                        type: "password",
                                        name: "password",
                                        autoComplete: "current-password"
                                    })}
                                    {m("div", {
                                        className: errorAlert.classes(status),
                                    }, [
                                        m("span", errorAlert.message(status))
                                    ])}
                                    <button className="btn btn-success my-2" type="submit">Login</button>
                                </form>
                            </body>
                        </BSCard>
                        </div>
                </div>
            </div>
        )
    }
}

export default Authorize;