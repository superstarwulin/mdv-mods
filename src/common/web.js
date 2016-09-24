var Mdv = require("mui/mdv/mdv2"),
    MString = require("./string");

class Module {
    static global(name) {
        return window[name] || null;
    }

    static locationTo(href) {
        if (location.href == href) {
            return;
        }
        if (/^[+-]?\d+$/.test(href)) {
            return history.go(href * 1);
        }
        location.href = href;
    }

    static locationReload() {
        location.reload();
    }

    static locationReplace(href) {
        location.replace(href);
    }

    static locationSearch(name) {
        var search = location.search.substring(1);
        return name ? (MString.toParam(search)[name] || "") : search;
    }
}
module.exports = Module;