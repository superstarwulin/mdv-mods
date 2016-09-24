define('mui/mdv-mods/element/form',function (require, exports, module) {
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
function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
    }
    return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass)
        Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
/*
 @author 游侠
 */
var Mdv = require('mui/mdv/mdv2'), Base = require('./base'), Loader = require('../common/loader'), MString = require('../common/string'), $ = require('mui/zepto/zepto'), Event = require('mui/zepto/event');
var Element = function (_Base) {
        _inherits(Element, _Base);
        function Element() {
            _classCallCheck(this, Element);
            return _possibleConstructorReturn(this, Object.getPrototypeOf(Element).apply(this, arguments));
        }
        _createClass(Element, [{
                key: "initEl",
                value: function initEl(el, mdvIn) {
                    var self = this;
        
                    //定义value_childName的数据模型
                    self.defineModel(/^value_.+/, function (name) {
                        return Mdv.createModel(function (resolve) {
                            var inputName = name.substring(6),
                                elements = [];
        
                            function onChange() {
                                var result = [];
                                for (var i = elements.length - 1; i >= 0; i--) {
                                    if (!(elements[i].type == "radio" && !elements[i].checked)) {
                                        result.push(elements[i].value);
                                    }
                                }
                                resolve(result.join(","));
                            }
        
                            //比较newElements和elements两个数组的不同
                            function equal(newElements, elements) {
                                if (newElements.length != elements.length) {
                                    return false;
                                }
                                for (var i = newElements.length; i >= 0; i--) {
                                    if (newElements[i] != elements[i]) {
                                        return false;
                                    }
                                }
                                return true;
                            }
        
                            function initChild(element) {
                                mdvIn.getModel("holder") && mdvIn.getModel("holder").then(function (holder, callParams) {
                                    if (!holder) {
                                        callParams.ignore = true;
                                    }
                                    return holder.getModel(element) || null;
                                }).then(function (mod, callParams) {
                                    if (!mod) {
                                        callParams.ignore = true;
                                    }
                                    return mod.getModel("load");
                                });
                                $(element).on("change", onChange);
                            }
        
                            self.getModel("refresh").then(function () {
                                //生成指定名称的子元素数组
                                var newElements = $(el).find("input[name='" + inputName + "']").get().concat($(el).find("textarea[name='" + inputName + "']").get()).concat($(el).find("checkbox[name='" + inputName + "']").get()).concat($(el).find("radio[name='" + inputName + "']").get()).concat($(el).find("select[name='" + inputName + "']").get());
                                for (var i = newElements.length - 1; i >= 0; i--) {
                                    if ($(newElements[i]).parent("form").get(0) != el) {
                                        newElements.splice(i, 1);
                                    }
                                }
                                if (newElements.length === 0) {
                                    return resolve(null);
                                }
                                if (equal(newElements, elements)) {
                                    return;
                                }
                                elements = newElements;
                                for (var i = elements.length - 1; i >= 0; i--) {
                                    var element = elements[i];
                                    if (!element._formTag) {
                                        element._formTag = true;
                                        initChild(element);
                                    }
                                }
                                onChange();
                            });
                        });
                    });
                    self.defineModel("refresh", Mdv.createModel(function (resolve) {
                        resolve({});
                    }));
                    self.defineModel("value", Mdv.createModel(function (resolve) {
                        //找到所有Form子元素
                        var names = [],
                            argu,
                            elements = $(el).find("input").get().concat($(el).find("textarea").get()).concat($(el).find("checkbox").get()).concat($(el).find("radio").get()).concat($(el).find("select").get());
                        for (var i = elements.length - 1; i >= 0; i--) {
                            var item = elements[i];
                            if (!item.name || $(item).parent("form").get(0) != el) {
                                elements.splice(i, 1);
                            } else {
                                names.push(item.name);
                            }
                        }
                        //进行名称去重
                        names.sort();
                        for (var i = names.length - 1; i > 0; i--) {
                            if (names[i] == names[i - 1]) {
                                names.splice(i, 1);
                            }
                        }
                        if (!names.length) {
                            resolve({});
                            return;
                        }
                        //并行加载所有子元素的值
                        Mdv.map(names, function (name) {
                            return self.getModel("value_" + name);
                        }).then(function (values) {
                            var result = {},
                                hasNull = false;
                            for (var k = names.length - 1; k >= 0; k--) {
                                var v = names[k];
                                if (values[k] === null) {
                                    hasNull = true;
                                    return false;
                                }
                                if (values[k] || values[k] === 0) {
                                    result[v] = values[k];
                                }
                            }
                            resolve(hasNull ? null : result);
                        });
                    }));
                    //定义url的数据模型
                    self.defineModel("url", MString.mUrl({
                        in: mdvIn.getModel("action"),
                        params: self.getModel("value")
                    }).getModel("out"), 2);
                    self.defineModel("submit", Mdv.createModel(function (resolve) {
                        $(el).on("submit", function () {
                            resolve({});
                            return false;
                        });
                    }));
                    self.getModel("submit").then(function () {
                        self.getModel("value").thenOnce(function (value) {
                            if (value) {
                                el.submit();
                            }
                        });
                    });
                }
            }], [{
                key: "initView",
                value: function initView(el, cfg, holder, callback) {
                    callback(new Element({
                        el: el,
                        holder: holder,
                        action: Base.getModel("action", cfg, el, holder) || el.getAttribute("action") || ""
                    }));
                }
            }]);
        return Element;
    }(Base);
module.exports = Element;    /*
 Mod.prototype.filterRadio = function (loader, value) {
 return this.createBridge(loader, function (x, callback) {
 callback(x == value ? x : "");
 }, function (x, oValue, callback) {
 if (x == value) {
 callback(x);
 }
 });
 }
 Mod.prototype.filterCheckbox = function (loader, value) {
 return this.createBridge(loader, function (x, callback) {
 callback((',' + x + ',').indexOf(',' + value + ',') >= 0 ? value : "");
 }, function (x, oValue, callback) {
 if (x) {
 if ((',' + value + ',').indexOf(',' + oValue + ',') < 0) {
 oValue = oValue + "," + x;
 }
 callback(oValue);
 }
 else {
 oValue = (',' + oValue + ',').replace(',' + value + ',', ',');
 callback(oValue.substr(1, oValue.length - 2));
 }
 });
 }*/
});
