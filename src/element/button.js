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
        mdvIn.getModel("enable") && mdvIn.getModel("enable").then(function (enable) {
            el.disabled = !enable;
        })
        //实现click的事件模型
        self.defineModel("click", Mdv.createModel(function (resolve, reject) {
            $(el).on("click", resolve);
        }).then());
        //实现按钮的值模型
        self.defineModel("value", self.getModel("click")
            .then(function () {
                if (el.disabled) {
                    getParams.ignore = true;
                    return;
                }
                return mdvIn.getModel("value") ? mdvIn.getModel("value").thenOnce() : el.value;
            }));
    }

    static initView(el, cfg, holder, callback) {
        callback(new Element({
            el: el,
            value: Base.getModel("value", cfg, el, holder),
            enable: Base.getModel("enable", cfg, el, holder)
        }));
    }
}
module.exports = Element;