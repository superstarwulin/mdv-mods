define('mui/mdv-mods/element/select',function (require, exports, module) {
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
        			function getValue() {
        				if (el.multiple) {//多选暂未支持
        				} else {
        						var selectedOption = el.options[el.selectedIndex];
        						return selectedOption && selectedOption.value || "";
        					}
        			}
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
        			mdvIn.getModel("options") && mdvIn.getModel("options").then(function (options) {
        				var allKey = "0";
        				if (options.hasOwnProperty("_")) {
        					allKey = "_";
        				}
        				if (options.hasOwnProperty(allKey)) {
        					el.add(new Option(options[allKey], ""), null);
        				}
        				for (var key in options) {
        					if (!options.hasOwnProperty(key) || key == allKey) {
        						continue;
        					}
        					el.add(new Option(options[key], key), null);
        				}
        				self.getModel("value").resolve(getValue(el));
        			});
        
        			mdvIn.getModel("value") && mdvIn.getModel("value").then(function (value) {
        				var options = el.options;
        				if (el.multiple) {//多选暂未支持
        				} else {
        						var found = false;
        						for (var i in options) {
        							if (value && options[i].value == value) {
        								found = true;
        								el.selectedIndex = i;
        								break;
        							}
        						}
        						if (!found) {
        							el.selectedIndex = -1;
        						}
        					}
        			});
        		}
        	}], [{
        		key: "initView",
        		value: function initView(el, cfg, holder, callback) {
        			callback(new Element({
        				el: el,
        				value: Base.getModel("value", cfg, el, holder),
        				options: Base.getModel("options", cfg, el, holder)
        			}));
        		}
        	}]);
        return Element;
    }(Base);
module.exports = Element;
});
