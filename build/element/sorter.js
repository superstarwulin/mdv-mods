define('mui/mdv-mods/element/sorter',function (require, exports, module) {
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
                    Mdv.all([mdvIn.getModel("name"), mdvIn.getModel("sort")]).then(function (values) {
                        return function (name, sort) {
                            //清理sort格式
                            if (sort == name + " desc") {
                                //逆向
                                $(el).addClass("order-current");
                                $(el).addClass("order-desc");
                            } else if (sort == name + " asc" || sort == name) {
                                //正向
                                $(el).addClass("order-current");
                                $(el).removeClass("order-desc");
                            } else {
                                $(el).removeClass("order-current");
                                $(el).removeClass("order-desc");
                            }
                        }.apply(null, values);
                    });
                    //实现按钮的值模型
                    self.defineModel("out", Mdv.createModel(function (resolve) {
                        $(el).on("click", function () {
                            Mdv.all([mdvIn.getModel("name").thenOnce(), mdvIn.getModel("sort").thenOnce()]).then(function (values) {
                                return function (name, sort) {
                                    if (sort == name + " asc" || sort == name) {
                                        //逆向
                                        resolve(name + " desc");
                                    } else {
                                        resolve(name);
                                    }
                                }.apply(null, values);
                            });
                        });
                    }));
                }
            }], [{
                key: "initView",
                value: function initView(el, cfg, holder, callback) {
                    callback(new Element({
                        el: el,
                        sort: Base.getModel("sort", cfg, el, holder),
                        name: Base.getModel("name", cfg, el, holder)
                    }));
                }
            }]);
        return Element;
    }(Base);
module.exports = Element;
});
