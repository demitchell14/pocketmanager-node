import m from "mithril";

import {user, vendors} from "../store";
const VendorList = {
    oninit: function(vnode) {
        vnode.state.vendors = [1];
    },
    oncreate: function(vnode) {
        let vendorsPromise = vendors.get("vendors");//.vendors();
        vendorsPromise.then(response => {
            vnode.state.vendors = response;
            m.redraw();
        }).catch(err => {
            //console.log(err);
            vnode.state.vendors = []
        });
    },

    onupdate: function(vnode) {
    },

    view: function(vnode) {
        return (
            <table className="px-3 mb-0 table table-striped table-hover table-sm">
                <thead>
                    <th>ID</th>
                    <th>Actions</th>
                    <th>Vendor Name</th>
                    <th>Vendor City</th>
                </thead>
                <tbody>
                {vnode.state.vendors.map(function(vendor) {
                    return vendorRow(vendor);
                })}
                </tbody>
            </table>
        )
    }

};


const vendorRow = function(vendor) {
    //console.log(vendor);
    let viewLink, modifyLink;
    switch (window.location.hostname) {
        case "localhost":
            viewLink = `${window.location.hostname}:3001/${vendor.vendor_city}/${vendor.vendor_name}`;
            modifyLink = `/0/${vendor.vendor_city}/${vendor.vendor_name}`;
            break;
    }
    return (
        <tr>
            <td>{vendor.vendor_id}</td>
            <td>
                <a href={viewLink} className="btn btn-sm btn-success mr-1">View</a>
                {m("a", {oncreate: m.route.link, className: "btn btn-sm btn-info mr-1", href: modifyLink}, "Modify")}
                <button className="btn btn-sm btn-danger mr-1">Delete</button>
            </td>
            <td>{vendor.vendor_identifier ? vendor.vendor_identifier : vendor.vendor_name}</td>
            <td>{vendor.vendor_city}</td>
        </tr>
    )
};


export default VendorList;