import m from "mithril";


export default {
    oninit: function(vnode) {
        vnode.state = {
            shadow: "",
            heading: false,
            body: false
        };
        //console.log(vnode);

        setShadow(vnode);
    },
    view: function(vnode) {
        return m("div", {className: `card ${vnode.state.shadow} ${vnode.attrs.className || ""}`}, [
            vnode.children.map(child => {
                if (child.tag === "heading") return _setHead(child);
                if (child.tag === "body") return _setBody(child);
                return "";
            })
        ])
    }
}


const _setHead = function(target) {
    return m("div",
        {className: `card-heading ${target.attrs ? target.attrs.className || ""      : ""}`}, [
            m("div", target.children)
        ])
}

const _setBody = function(target) {
    return m("div",
        {className: `card-body ${target.attrs ? target.attrs.className || "" : ""}`}, [
            m("div", target.children)
        ]);
};
let setShadow = function(vnode) {
    if (vnode.attrs.shadow) {
        switch (vnode.attrs.shadow){
            case "light":
                vnode.state.shadow = "shadow-lt";
                break;
            case "dark":
                vnode.state.shadow = "shadow-dk";
                break;
            default:
                if (vnode.attrs.shadow.includes("shadow"))
                    vnode.state.shadow = vnode.attrs.shadow;
                else
                    vnode.state.shadow = "shadow";
        }
    }
};