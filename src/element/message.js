/*
 @author 游侠
 */
var Mdv = require("mui/mdv/mdv2"),
    Base = require("./base"),
    $ = require("mui/zepto/zepto");
class Element extends Base {
    initEl(el, mdvIn) {
        var self = this;
        //在数据变化时显示层
        mdvIn.getModel("in").then(function (message) {
            if (message) {
                el.innerText = message;
                $(el).show();
            }
            else {
                $(el).hide();
            }
        })
    }

    static initView(el, cfg, holder, callback) {
        callback(new Element({
            el: el,
            in: Base.getModel("in", cfg, el, holder)
        }));
    }
}
module.exports = Element;