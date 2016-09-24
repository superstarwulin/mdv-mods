define('mui/mdv-mods/element/button',function (require, exports, module) {
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
var Mdv = require('mui/mdv/mdv2'), Base = require('./base'), $ = require('mui/zepto/zepto'), Event = require('mui/zepto/event');
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
                    //实现是否启用的模型
                    mdvIn.getModel("enable") && mdvIn.getModel("enable").then(function (enable) {
                        el.disabled = !enable;
                    });
                    //实现click的事件模型
                    self.defineModel("click", Mdv.createModel(function (resolve, reject) {
                        $(el).on("click", resolve);
                    }).then());
                    //实现按钮的值模型
                    self.defineModel("value", self.getModel("click").then(function () {
                        if (el.disabled) {
                            getParams.ignore = true;
                            return;
                        }
                        return mdvIn.getModel("value") ? mdvIn.getModel("value").thenOnce() : el.value;
                    }));
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
