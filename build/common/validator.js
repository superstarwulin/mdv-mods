define('mui/mdv-mods/common/validator',function (require, exports, module) {
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
/*
 @author 游侠
 */
var Mdv = require('mui/mdv/mdv2'), Common = require('./common');
var Module = function () {
        function Module() {
            _classCallCheck(this, Module);
        }
        _createClass(Module, null, [{
                key: "regExp",
                value: function regExp(x, reg, msg) {
                    return !x || reg.test(x) ? "" : msg || "格式不正确";
                }
            }, {
                key: "email",
                value: function email(v) {
                    return Module.regExp(v, /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, "email格式不正确");
                }
            }, {
                key: "tel",
                value: function tel(v) {
                    return Module.regExp(v, /^\d{3}-\d{8}$|^\d{4}-\d{7}$|^\d{11}$/, "电话号码格式不正确");
                }
            }, {
                key: "positiveInteger",
                value: function positiveInteger(v) {
                    return Module.regExp(v, /^\+?[1-9]\d*$/, "必须输入正整数");
                }
            }, {
                key: "integer",
                value: function integer(v) {
                    return Module.regExp(v, /^[\+-]?[0-9]\d*$/, "必须输入整数");
                }
            }, {
                key: "itemName",
                value: function itemName(v) {
                    return Module.regExp(v, /^[^\"\']{1,1024}$/, "格式不正确");
                }
            }, {
                key: "mRegExp",
                value: function mRegExp(mdvIn) {
                    return Common.syncProcess(mdvIn, ["in", "reg", "message"], regExp);
                }
            }, {
                key: "mLenLimit",
                value: function mLenLimit(mdvIn) {
                    return Common.syncProcess(mdvIn, ["in", "min", "max", "msg"], function (x, min, max, msg) {
                        var len = x && x.length || 0;
                        if (x && min >= 0 && len < min) {
                            return msg || '长度必须大于' + min;
                        }
                        if (x && max >= 0 && len > max) {
                            return msg || '长度必须小于' + max;
                        }
                        return "";
                    });
                }
            }, {
                key: "mNoBlank",
                value: function mNoBlank(mdvIn) {
                    return Common.syncProcess(mdvIn, ["in", "message"], function (x, msg) {
                        return x ? "" : msg || "不能为空";
                    });
                }
            }]);
        return Module;
    }();
module.exports = Module;
});
