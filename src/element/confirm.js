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
        //实现输出模型
        self.defineModel("out", Mdv.createModel(function (resolve, reject) {
            $(el).on("click", ".j_Ok", function () {
                $(el).hide();
                self.getModel("show").thenOnce(resolve)
            })
            $(el).on("click", ".j_Cancel", function () {
                $(el).hide();
            })
            $(el).on("click", ".j_Close", function () {
                $(el).hide();
            })
        }));
        self.defineModel("show", Mdv.createModel());
        //在数据变化时显示层
        mdvIn.getModel("in").then(function (value) {
            self.getModel("show").resolve(value);
            $(el).show();
            mdvIn.getModel("holder") && mdvIn.getModel("holder").then(function(holder){
                holder && holder.renderElement(el);
            })
        })
    }

    static initView(el, cfg, holder, callback) {
        callback(new Element({
            el: el,
            holder:holder,
            in: Base.getModel("in", cfg, el, holder)
        }));
    }
}
module.exports = Element;