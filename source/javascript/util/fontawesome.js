import {config} from "@fortawesome/fontawesome-svg-core";

const include = {
    fal: import("@fortawesome/pro-light-svg-icons"),
    far: import("@fortawesome/pro-regular-svg-icons"),
    fas: import("@fortawesome/pro-solid-svg-icons"),
    fab: import("@fortawesome/free-brands-svg-icons"),

    fontAwesome: import("@fortawesome/fontawesome-svg-core"),
};
//config.searchPseudoElements = true;
let _fontAwesome,
    icons;

const fontAwesome = async function() {
    let timer;
    return await new Promise(resolve => {
        timer = setInterval(function() {
            if (typeof _fontAwesome !== "undefined") resolve(_fontAwesome);
        }, 100);
    }). then(success => {
        clearInterval(timer);
        return success
    });
};

const initFontAwesome = async () => {
    icons = await Promise.all(Object.values(include));
    _fontAwesome = icons.pop();

    icons.map((set, idx) => _fontAwesome.library.add(set[Object.keys(include)[idx]]));
    //_fontAwesome.config.searchPseudoElements = true;
    _fontAwesome.dom.watch();
};

const initFontAwesome2 = async () => {
    _fontAwesome = (await import("@fortawesome/fontawesome-svg-core"));
    icons = (await import("@fortawesome/pro-light-svg-icons"));

    _fontAwesome.library.add(icons.fal);
    _fontAwesome.dom.watch();
};

export const FontAwesome = fontAwesome;
export default initFontAwesome;