define('mui/mdv-mods/element/base',function (require, exports, module) {
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
var Mdv = require('mui/mdv/mdv2'), Dom = require('../common/dom');
var Element = function (_Mdv) {
        _inherits(Element, _Mdv);
        function Element(mdvIn) {
            _classCallCheck(this, Element);
            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Element).call(this));
            mdvIn = new Mdv(mdvIn);
            var self = _this, initModel = mdvIn.getModel('el').thenOnce(function (el) {
                    self.initEl(el, mdvIn);
                    return self;
                });
            self.defineModel(true, function (name) {
                return initModel.then(function (self) {
                    var model = self.getModel(name, -7);
                    if (!model) {
                        throw 'model ' + name + ' not exists';
                    }
                    return model || null;
                });
            }, -8);
            return _this;
        }
        _createClass(Element, null, [{
                key: "initView",
                value: function initView(el, cfg, holder, callback) {
                    var mdvIn = Dom.getMdv(el, holder);
                    mdvIn.addObject(cfg, 2);
                    mdvIn.defineModel("el", Mdv.createLiteral(el), 5);
                    callback(new Element(mdvIn));
                }
            }, {
                key: "getModel",
                value: function getModel(attr, cfg, el, holder) {
                    return cfg[attr] !== undefined ? cfg[attr] : holder.getModel(el.getAttribute("mdv-model-" + attr)) || undefined;
                }
            }, {
                key: "getProcess",
                value: function getProcess(attr, cfg, el, holder) {
                    return typeof cfg[attr] === "function" ? cfg[attr] : holder.getProcess(el.getAttribute("mdv-process-" + attr)) || undefined;
                }
            }]);
        return Element;
    }(Mdv);
module.exports = Element;
});
