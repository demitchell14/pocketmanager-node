import m from "mithril";

import Breadcrumbs from "../components/breadcrumbs.jsx";
import BSCard from "../components/bs-card.js";
import VendorList from "../components/vendorlist.jsx";

import {createInputGroup, getCityList, buildFormData} from "../util/functions";

import store, { user, vendors } from "../store";

const Generator = {
    oninit: function(vnode) {
        if (vnode.attrs.type === "vendor") {
            user.actions("getCities", true).then((xhr) => {
                console.debug(`successfully loaded ${xhr.length} cities from database.`);
            })
        }
        //console.log(user.get.userData());
        console.log(user.get("session"));
        console.log(store);
    },
    oncreate: function(vnode) {

        store.navigation.enable(true);
    },
    onupdate: function(vnode) {
    },

    view: function(vnode) {
        if (vnode.attrs.type === "vendor") {
            return (
                <div className="container-fluid mt-3">
                    <h1>Generator for Cities and Vendors</h1>

                    <div className="row">
                        <div className="mx-auto col-lg-4">
                            <form id="generate_vendor">
                                {createInputGroup({
                                    label: "Select a City",
                                    name: "city_name",
                                    input: m("select", {}, getCityList()),
                                    details: "Select the city you wish to create a vendor for."
                                })}

                                {createInputGroup({
                                    label: "Folder Name:",
                                    placeholder: "Enter short vendor name",
                                    name: "folder_name",
                                    details: "This doubles as both the location where your files are stored and as part of the URL to visit the vendor's page." +
                                        '<b class="text-danger">This may only contain letters and numbers.</b>'
                                })}

                                {createInputGroup({
                                    label: "Vendor Name:",
                                    name: "vendor_name",
                                    placeholder: "Enter full vendor name",
                                    details: "Give the full name of the vendor",
                                })}

                                <small className="text-secondary">You may allow multiple people to moderate each vendor
                                    page. To include a person, simply enter their email in the field below.
                                </small>
                                <div className="d-flex">
                                    <label className="pt-2 mr-2">Clients:</label>
                                    <div className="flex-grow-1">
                                        {aa()}



                                    </div>
                                </div>
                                <button type="button" form="generate_vendor" onclick={formsubmit} className="btn btn-primary">I'm me</button>
                            </form>
                        </div>
                    </div>
                </div>
            )
        }
    }
};

let aa = function() {
    let inps = [];
    for (let x = 0; x < 8; x++) {
        inps.push(createInputGroup({
            name: `client_${x}`,
            value: `client test ${x}`
        }))
    }
    console.log(inps);
    return inps;
};

const formsubmit = function(evt) {
    const form = document.querySelector("#generate_vendor");
    const inputs = form.querySelectorAll("input, select");

    let s = vendors.actions("generate", buildFormData(inputs));//.generate(data);
    s.then(data => console.log(data));
}

export default Generator;