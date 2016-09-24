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
            mdvIn.getModel("name"),
            mdvIn.getModel("sort")
        ])
            .then(function (values) {
                return (function (name, sort) {
                    //清理sort格式
                    if (sort == name + " desc") {//逆向
                        $(el).addClass("order-current");
                        $(el).addClass("order-desc");
                    }
                    else if (sort == name + " asc" || sort == name) {//正向
                        $(el).addClass("order-current");
                        $(el).removeClass("order-desc");
                    }
                    else {
                        $(el).removeClass("order-current");
                        $(el).removeClass("order-desc");
                    }
                }).apply(null, values)
            });
        //实现按钮的值模型
        self.defineModel("out", Mdv.createModel(function (resolve) {
            $(el).on("click", function () {
                Mdv.all([
                    mdvIn.getModel("name").thenOnce(),
                    mdvIn.getModel("sort").thenOnce()
                ])
                    .then(function (values) {
                        return (function (name, sort) {
                            if (sort == name + " asc" || sort == name) {//逆向
                                resolve(name + " desc");
                            }
                            else {
                                resolve(name);
                            }
                        }).apply(null, values)
                    });
            });
        }));
    }

    static initView(el, cfg, holder, callback) {
        callback(new Element({
            el: el,
            sort: Base.getModel("sort", cfg, el, holder),
            name: Base.getModel("name", cfg, el, holder)
        }));
    }
}
module.exports = Element;