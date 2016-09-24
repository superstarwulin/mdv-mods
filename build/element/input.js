define('mui/mdv-mods/element/input',function (require, exports, module) {
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
var Mdv = require('mui/mdv/mdv2'), Base = require('./base'), Common = require('../common/common'), $ = require('mui/zepto/zepto'), Event = require('mui/zepto/event');
function getValue(el) {
    if ((el.type == 'radio' || el.type == 'checkbox') && !el.checked) {
        return '';
    }
    return el.value || '';
}
function setValue(el, value) {
    if ((el.type == 'radio' || el.type == 'checkbox') && !value) {
        el.checked = false;
        return;
    }
    el.checked = true;
    if (el.type == 'radio' && el.name && el.checked) {
        var pFrm = $(el).parent('form');
        if (pFrm) {
            var radios = pFrm.query('input[name=\'' + el.name + '\']');
            for (var i = radios.length - 1; i >= 0; i--) {
                if (radios[i] == el || radios[i].type != 'radio') {
                    continue;
                }
                $(radios[i]).trigger('change');
            }
        }
    }
    el.value = value || value === 0 ? value : '';
    $(el).trigger('change');
}
var Element = function (_Base) {
        _inherits(Element, _Base);
        function Element() {
            _classCallCheck(this, Element);
            return _possibleConstructorReturn(this, Object.getPrototypeOf(Element).apply(this, arguments));
        }
        _createClass(Element, [{
                key: "initEl",
                value: function initEl(el, mdvIn) {
                    var self = this,
                        callbacked = false;
        
                    mdvIn.getModel("enable") && mdvIn.getModel("enable").then(function (enable) {
                        el.disabled = enable === false;
                    });
        
                    mdvIn.getModel("value") && mdvIn.getModel("value").then(function (value) {
                        setValue(el, value);
                    });
                    //实现click的事件模型
                    self.defineModel("click", Mdv.createModel(function (resolve, reject) {
                        $(el).on("click", resolve);
                    }).then());
        
                    self.defineModel("value", Mdv.createModel(function (resolve, reject) {
                        mdvIn.getModel("value") && mdvIn.getModel("value").then(function () {
                            callbacked = true;
                            resolve(getValue(el));
                        });
                        $(el).on("change", function () {
                            callbacked = true;
                            resolve(getValue(el));
                        });
                        if (!callbacked) {
                            resolve(getValue(el));
                        }
                    }).thenMdv(Common.mDistinct));
        
                    self.defineModel("valueRealTime", Mdv.createModel(function (resolve, reject) {
                        self.getModel("value").then(function () {
                            resolve(getValue(el));
                        });
                        $(el).on("keypress input", function () {
                            resolve(getValue(el));
                        });
                    }).thenMdv(Common.mDistinct));
                }
            }], [{
                key: "initView",
                value: function initView(el, cfg, holder, callback) {
                    callback(new Element({
                        el: el,
                        value: Base.getModel("value", cfg, el, holder),
                        enable: Base.getModel("enable", cfg, el, holder)
                    }));
                }
            }]);
        return Element;
    }(Base);
module.exports = Element;
});
