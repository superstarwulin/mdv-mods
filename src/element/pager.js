/*
 @author 游侠
 */
var Mdv = require("mui/mdv/mdv2"),
    Base = require("./base"),
    $ = require("mui/zepto/zepto"),
    Event = require("mui/zepto/event");
class Element extends Base {
    initEl(el, mdvIn) {
        var self = this;
        //实现是否启用的模型
        Mdv.all([
            mdvIn.getModel("pageSize"),
            mdvIn.getModel("totalNum"),
            mdvIn.getModel("page")
        ])
            .then(function (values) {
                return (function (pageSize, totalNum, page) {
                    var html = '<div class="dataTables_info">当前显示 ' + (pageSize * (page - 1) + 1) + '~' + Math.min(pageSize * page, totalNum) + ' / 共 <span class="dataTables_info_total">' + totalNum + '</span> 条数据</div>';
                    html += '<div class="dataTables_paginate paging_simple_numbers">';
                    html += '<a class="paginate_button previous ' + (page > 1 ? '' : 'disabled') + '" data-dt-idx="' + (page - 1) + '">上一页</a>';
                    html += '<span>'
                    for (var i = page - 2; i <= page + 2; i++) {
                        if (i < 1 || (i - 1) * pageSize >= totalNum) {
                            continue;
                        }
                        html += '<a class="paginate_button ' + (i != page ? '' : 'current') + '" data-dt-idx="' + i + '">' + i + '</a>';
                    }
                    html += '</span>'
                    html += '<a class="paginate_button next ' + (pageSize * page < totalNum ? '' : 'disabled') + '" data-dt-idx="' + (page + 1) + '">下一页</a>';
                    html += '</div>';
                    el.innerHTML = html;
                }).apply(null, values)
            });
        //实现按钮的值模型
        self.defineModel("page", Mdv.createModel(function (resolve) {
            $(el).on("click", "a[data-dt-idx]", function (event) {
                resolve(event.currentTarget.getAttribute("data-dt-idx") * 1);
            });
        }));
    }

    static initView(el, cfg, holder, callback) {
        callback(new Element({
            el: el,
            totalNum: Base.getModel("totalNum", cfg, el, holder),
            page: Base.getModel("page", cfg, el, holder),
            pageSize: Base.getModel("pageSize", cfg, el, holder)
        }));
    }
}
module.exports = Element;