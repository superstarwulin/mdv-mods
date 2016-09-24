define('mui/mdv-mods/common/array',function (require, exports, module) {
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
var Mdv = require('mui/mdv/mdv2'), Common = require('./common');
var Module = function () {
        function Module() {
            _classCallCheck(this, Module);
        }
        _createClass(Module, null, [{
                key: "isArray",
        
                /**
                 * 判断一个值是否数组
                 */
                value: function isArray(arg) {
                    return Array.isArray ? Array.isArray(arg) : Object.prototype.toString.call(arg) === '[object Array]';
                }
                /**
                 * 生成值的Map对象
                 */
        
            }, {
                key: "toValueMap",
                value: function toValueMap(arr) {
                    var map = {};
                    for (var i = arr.length - 1; i >= 0; i--) {
                        map[arr[i]] = 1;
                    }
                    return map;
                }
                /**
                 * 数组拼接
                 */
        
            }, {
                key: "mConcat",
                value: function mConcat(mdvIn) {
                    return Common.syncProcess(mdvIn, ["in", "item"], function (list, item) {
                        list.push(item);
                        return [].concat(list).concat([item]);
                    });
                }
                /**
                 * 数组筛选
                 */
        
            }, {
                key: "mFilter",
                value: function mFilter(mdvIn) {
                    return Common.syncProcess(mdvIn, ["in", "match"], function (list, match) {
                        var result = [];
                        for (var i = list.length - 1; i >= 0; i--) {
                            if (match(list[i])) {
                                result.unshift(i);
                            }
                        }
                        return result;
                    });
                }
            }, {
                key: "mRange",
                value: function mRange(mdvIn) {
                    mdvIn = new Mdv(mdvIn);
                    if (!mdvIn.getModel("step")) {
                        mdvIn.defineModel("step", Mdv.createLiteral(1));
                    }
                    return Common.syncProcess(mdvIn, ["start", "end", "step"], function (start, end, step) {
                        start *= 1;
                        end *= 1;
                        step *= 1;
                        var result = [];
                        for (var i = start; i <= end; i += step) {
                            result.push(i);
                        }
                        return result;
                    });
                }
        
                /**
                 * 数组筛选
                 */
        
            }, {
                key: "mKeyValue",
                value: function mKeyValue(mdvIn) {
                    mdvIn = new Mdv(mdvIn);
                    var mdvOut = new Mdv();
                    mdvOut.defineModel("out", mdvIn.getModel("in").then(function (list) {
                        return Mdv.all([Mdv.map(list, function (value) {
                            return mdvIn.key ? mdvIn.key(Mdv.createLiteral(value)) : Mdv.createLiteral(value);
                        }), Mdv.map(list, function (value) {
                            return mdvIn.value ? mdvIn.value(Mdv.createLiteral(value)) : Mdv.createLiteral(value);
                        })]).then(function (values) {
                            return function (keys, values) {
                                var obj = {};
                                for (var i = 0; i < list.length; i++) {
                                    obj[keys[i]] = values[i];
                                }
                                return obj;
                            }.apply(null, values);
                        });
                    }));
                    return mdvOut;
                }
        
                /**
                 * 创建可操作的Model模型
                 */
        
            }, {
                key: "mList",
                value: function mList(mdvIn) {
                    mdvIn = new Mdv(mdvIn);
        
                    var mdvOut = new Mdv();
                    mdvOut.defineModel("out", Mdv.createModel(function (resolve, reject) {
                        var list = [];
                        resolve(list);
                        mdvIn.getModel("in") && mdvIn.getModel("in").then(function (l) {
                            resolve(list = l);
                        }, reject);
                        mdvIn.getModel("push") && mdvIn.getModel("push").then(function (v) {
                            list.push(v);
                            resolve(list);
                        });
                        mdvIn.getModel("splice") && mdvIn.getModel("splice").then(function (v) {
                            list.splice(v, 1);
                            resolve(list);
                        });
                        mdvIn.getModel("removeAll") && mdvIn.getModel("removeAll").then(function (match) {
                            for (var i = list.length - 1; i >= 0; i--) {
                                if (match === list[i] || typeof match == "function" && match(list[i])) {
                                    list.splice(i, 1);
                                }
                            }
                            resolve(list);
                        });
                    }));
                    return mdvOut;
                }
            }]);
        return Module;
    }();
module.exports = Module;
});
