import m from "mithril";
import store from "../store";
import Breadcrumbs from "../components/breadcrumbs.jsx";
import BSCard from "../components/bs-card.js";


const VendorView = {
    oncreate: function(vnode) {
        store.navigation.enable(true);
        store.navigation.actions.handlebar();
    },
    view: function(vnode) {
        return (
            <div className="container-fluid mt-2">
                <h5 className="text-muted">Vendor View</h5>
                <Breadcrumbs>
                    <li><a>Home</a></li>
                    <li><a>{vnode.attrs.city}</a></li>
                    <li>{vnode.attrs.vendor}</li>
                </Breadcrumbs>
                <div className="row">
                    <div className="col-3">
                        <BSCard shadow={"light"} padded={false}>
                            <body className={'p-0'}>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">Cras justo odio</li>
                                <li className="list-group-item">Dapibus ac facilisis in</li>
                                <li className="list-group-item">Morbi leo risus</li>
                                <li className="list-group-item">Porta ac consectetur ac</li>
                                <li className="list-group-item">Vestibulum at eros</li>
                            </ul>
                            </body>
                        </BSCard>
                    </div>
                </div>
            </div>
        )
    },
};

export default VendorView;