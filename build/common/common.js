define('mui/mdv-mods/common/common',function (require, exports, module) {
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
var Mdv = require('mui/mdv/mdv2');
var Module = function () {
        function Module() {
            _classCallCheck(this, Module);
        }
        _createClass(Module, null, [{
                key: "syncProcess",
        
                /**
                 * 使用多参数的函数handle来处理mdvIn,参数由list指定
                 */
                value: function syncProcess(mdvIn, list, handle) {
                    if (!handle) {
                        throw 'handle not defined for [' + list.join(",") + ']';
                    }
                    mdvIn = new Mdv(mdvIn);
                    var mdvOut = new Mdv(),
                        models = [];
                    for (var i = 0; i < list.length; i++) {
                        var model = mdvIn.getModel(list[i]);
                        if (!model) {
                            throw 'model ' + list[i] + ' not exists';
                        }
                        models.push(model);
                    }
                    mdvOut.defineModel("out", Mdv.all(models).thenDemand(function (values) {
                        return handle.apply(null, values);
                    }));
                    return mdvOut;
                }
        
                /**
                 * 否
                 */
        
            }, {
                key: "not",
                value: function not(v) {
                    return !v;
                }
        
                /**
                 * 转化成字符串
                 */
        
            }, {
                key: "toString",
                value: function toString(x) {
                    return x || x === 0 ? x.toString() : "";
                }
        
                /**
                 * 判断一个值是否为空
                 */
        
            }, {
                key: "isNull",
                value: function isNull(arg) {
                    return arg === null;
                }
        
                /**
                 * 不做任何处理
                 */
        
            }, {
                key: "mDirect",
                value: function mDirect(mdvIn) {
                    return Module.syncProcess(mdvIn, ["in"], function (value) {
                        return value;
                    });
                }
        
                /**
                 * 在in模型变更的时候，out输出另一个模型的值
                 */
        
            }, {
                key: "mIf",
                value: function mIf(mdvIn) {
                    mdvIn = new Mdv(mdvIn);
                    var mdvOut = new Mdv();
                    mdvOut.defineModel("out", mdvIn.getModel("in").then(function (value) {
                        return value ? mdvIn.getModel("true") : mdvIn.getModel("false");
                    }));
                    return mdvOut;
                }
        
                /**
                 * 在in模型变更的时候，out输出另一个模型的值
                 */
        
            }, {
                key: "mReplace",
                value: function mReplace(mdvIn) {
                    mdvIn = new Mdv(mdvIn);
                    var mdvOut = new Mdv();
                    mdvOut.defineModel("out", mdvIn.getModel("in").then(function (value) {
                        return mdvIn.getModel("value").thenOnce();
                    }));
                    return mdvOut;
                }
        
                /**
                 * 去重，仅在数据变化时透传
                 */
        
            }, {
                key: "mDistinct",
                value: function mDistinct(mdvIn) {
                    mdvIn = new Mdv(mdvIn);
                    var mdvOut = new Mdv();
                    mdvOut.defineModel("out", Mdv.createModel(function (resolve) {
                        var lastValue = undefined;
                        mdvIn.getModel("in").then(function (value, callParams) {
                            if (lastValue === value) {
                                callParams.ignore = true;
                                return;
                            }
                            resolve(value, callParams);
                        });
                    }));
                    return mdvOut;
                }
        
                /**
                 * 返回数据流之中每个值记录下来的数组
                 */
        
            }, {
                key: "mHistory",
                value: function mHistory(mdvIn) {
                    mdvIn = new Mdv(mdvIn);
                    var mdvOut = new Mdv();
                    mdvOut.defineModel("out", Mdv.createModel(function (resolve, reject) {
                        var result = [];
                        mdvIn.getModel("in").then(function (value) {
                            result.push(value);
                            resolve(result);
                        });
                    }));
                    return mdvOut;
                }
            }]);
        return Module;
    }();
module.exports = Module;
});
