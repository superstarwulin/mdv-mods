define('mui/mdv-mods/element/uploader',function (require, exports, module) {
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
var Mdv = require('mui/mdv/mdv2'), Common = require('./common'), Base = require('./base'), $ = require('mui/zepto/zepto'), Event = require('mui/zepto/event');
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
        			self.defineModel("change", Mdv.createModel(function (resolve, reject) {
        				$(el).on("change", resolve);
        			}));
        			//实现输出模型
        			self.defineModel("out", self.get("change").thenDemand(function () {
        				return el.files[0];
        			}).thenMdv(Element.mOssToken, {
        				server: "/inside/ajax/file/getFile.do?_input_charset=utf-8"
        			}, "in", "out").then(function (ossToken) {
        				return Mdv.createModel(function (resolve) {
        					Mdv.createLiteral(ossToken).thenMdv(Element.mOssUrl, {
        						in: el.files[0],
        						server: "//tmall-inside.cn-hangzhou.oss-pub.aliyun-inc.com/"
        					}, "token", "out").then(function () {
        						resolve(ossToken);
        					});
        				});
        			}));
        		}
        	}], [{
        		key: "ossToken",
        		value: function ossToken(fileObj, server) {
        			return Loader.json(server, {
        				fileType: fileObj.type,
        				fileName: fileObj.name
        			}, "post").then(function (result) {
        				return result.model;
        			});
        		}
        	}, {
        		key: "mOssToken",
        		value: function mOssToken(mdvIn) {
        			return Common.syncProcess(mdvIn, ["in", "server"], ossUrl);
        		}
        	}, {
        		key: "ossUrl",
        		value: function ossUrl(fileObj, ossToken, server) {
        			var form = new FormData();
        			for (var key in ossToken) {
        				if (key != "url" && key != "fileName" && ossToken.hasOwnProperty(key)) {
        					form.append(key, value);
        				}
        			}
        			form.append("file", fileObj);
        			return Loader.json(server, form, "post", {
        				processData: false,
        				contentType: false,
        				crossDomain: true
        			});
        		}
        	}, {
        		key: "mOssUrl",
        		value: function mOssUrl(mdvIn) {
        			return Common.syncProcess(mdvIn, ["in", "token", "server"], ossUrl);
        		}
        	}, {
        		key: "initView",
        		value: function initView(el, cfg, holder, callback) {
        			callback(new Element({
        				el: el
        			}));
        		}
        	}]);
        return Element;
    }(Base);
module.exports = Element;
});
