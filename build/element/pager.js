define('mui/mdv-mods/element/pager',function (require, exports, module) {
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
                    Mdv.all([mdvIn.getModel("pageSize"), mdvIn.getModel("totalNum"), mdvIn.getModel("page")]).then(function (values) {
                        return function (pageSize, totalNum, page) {
                            var html = '<div class="dataTables_info">当前显示 ' + (pageSize * (page - 1) + 1) + '~' + Math.min(pageSize * page, totalNum) + ' / 共 <span class="dataTables_info_total">' + totalNum + '</span> 条数据</div>';
                            html += '<div class="dataTables_paginate paging_simple_numbers">';
                            html += '<a class="paginate_button previous ' + (page > 1 ? '' : 'disabled') + '" data-dt-idx="' + (page - 1) + '">上一页</a>';
                            html += '<span>';
                            for (var i = page - 2; i <= page + 2; i++) {
                                if (i < 1 || (i - 1) * pageSize >= totalNum) {
                                    continue;
                                }
                                html += '<a class="paginate_button ' + (i != page ? '' : 'current') + '" data-dt-idx="' + i + '">' + i + '</a>';
                            }
                            html += '</span>';
                            html += '<a class="paginate_button next ' + (pageSize * page < totalNum ? '' : 'disabled') + '" data-dt-idx="' + (page + 1) + '">下一页</a>';
                            html += '</div>';
                            el.innerHTML = html;
                        }.apply(null, values);
                    });
                    //实现按钮的值模型
                    self.defineModel("page", Mdv.createModel(function (resolve) {
                        $(el).on("click", "a[data-dt-idx]", function (event) {
                            resolve(event.currentTarget.getAttribute("data-dt-idx") * 1);
                        });
                    }));
                }
            }], [{
                key: "initView",
                value: function initView(el, cfg, holder, callback) {
                    callback(new Element({
                        el: el,
                        totalNum: Base.getModel("totalNum", cfg, el, holder),
                        page: Base.getModel("page", cfg, el, holder),
                        pageSize: Base.getModel("pageSize", cfg, el, holder)
                    }));
                }
            }]);
        return Element;
    }(Base);
module.exports = Element;
});
