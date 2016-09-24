define('mui/mdv-mods/common/web',function (require, exports, module) {
var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ('value' in descriptor)
                    descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function (Constructor, protoProps, staticProps) {
            if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
                defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}
var Mdv = require('mui/mdv/mdv2'), MString = require('./string');
var Module = function () {
        function Module() {
            _classCallCheck(this, Module);
        }
        _createClass(Module, null, [{
                key: "global",
                value: function global(name) {
                    return window[name] || null;
                }
            }, {
                key: "locationTo",
                value: function locationTo(href) {
                    if (location.href == href) {
                        return;
                    }
                    if (/^[+-]?\d+$/.test(href)) {
                        return history.go(href * 1);
                    }
                    location.href = href;
                }
            }, {
                key: "locationReload",
                value: function locationReload() {
                    location.reload();
                }
            }, {
                key: "locationReplace",
                value: function locationReplace(href) {
                    location.replace(href);
                }
            }, {
                key: "locationSearch",
                value: function locationSearch(name) {
                    var search = location.search.substring(1);
                    return name ? MString.toParam(search)[name] || "" : search;
                }
            }]);
        return Module;
    }();
module.exports = Module;
});
