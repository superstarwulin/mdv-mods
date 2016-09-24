define('mui/mdv-mods/element/datetime',function (require, exports, module) {
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
var Mdv = require('mui/mdv/mdv2'), Base = require('./base'), Common = require('../common/common'), Loader = require('../common/loader'), Event = require('mui/zepto/event'), $ = require('mui/zepto/zepto');
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
                        minValueModel = mdvIn.getModel("minValue") || Mdv.createLiteral(el.getAttribute("data-minValue") || ""),
                        maxValueModel = mdvIn.getModel("maxValue") || Mdv.createLiteral(el.getAttribute("data-maxValue") || ""),
                        typeModel = mdvIn.getModel("type") || Mdv.createLiteral(el.getAttribute("data-type") || "date"),
                        callbacked = false;
        
                    mdvIn.getModel("enable") && mdvIn.getModel("enable").then(function (enable) {
                        el.disabled = enable === false;
                    });
                    //实现值模型
                    self.defineModel("value", Mdv.createModel(function (resolve, reject) {
                        mdvIn.getModel("value") && mdvIn.getModel("value").then(function () {
                            callbacked = true;
                            resolve(el.value);
                        });
                        $(el).on("change blur", function () {
                            callbacked = true;
                            resolve(el.value);
                        });
                        if (!callbacked) {
                            resolve(el.value);
                        }
                    }).thenMdv(Common.mDistinct));
        
                    mdvIn.getModel("value") && mdvIn.getModel("value").then(function (value) {
                        el.value = value || "";
                    });
        
                    var calLoader;
                    $(el).on("click", function (e) {
                        if (e.target != el) {
                            return;
                        }
                        if (calLoader) {
                            calLoader.thenOnce(function (calendar) {
                                calendar.destroy();
                            });
                        }
                        calLoader = Mdv.createLiteral("mui/calendar/calendar").then(Loader.kissyUse).then(function (Calendar) {
                            return Mdv.all([minValueModel.thenOnce(), maxValueModel.thenOnce(), typeModel.thenOnce()]).then(function (values) {
                                return function (minValue, maxValue, type) {
                                    var calendar = new Calendar(el, {
                                        minDate: minValue ? new Date(minValue) : false,
                                        maxDate: maxValue ? new Date(maxValue) : false,
                                        showTime: type == "datetime"
                                    }).getCalendar();
                                    calendar.on(type == "datetime" ? 'timeSelect' : 'select', function (e) {
                                        $(el).trigger("change");
                                    });
                                    return calendar;
                                }.apply(null, values);
                            });
                        });
                        setTimeout(function () {
                            calLoader.thenOnce(function (calendar) {
                                calendar.show();
                            });
                        }, 16);
                    });
                }
            }], [{
                key: "initView",
                value: function initView(el, cfg, holder, callback) {
                    callback(new Element({
                        el: el,
                        value: Base.getModel("value", cfg, el, holder),
                        type: Base.getModel("type", cfg, el, holder),
                        minValue: Base.getModel("minValue", cfg, el, holder),
                        maxValue: Base.getModel("maxValue", cfg, el, holder)
                    }));
                }
            }]);
        return Element;
    }(Base);
module.exports = Element;
});
