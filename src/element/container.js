/*
 @author 游侠
 */
var Mdv = require("mui/mdv/mdv2"),
    Base = require("./base"),
    $ = require("mui/zepto/zepto");
class Element extends Base {
    initEl(el, mdvIn) {
        var self = this;
        self.defineModel(true, function (name) {
            return mdvIn.getModel("selectors")
                .then(function (selectors) {
                    return $(selectors[name], el).get(0)
                });
        });
    }
    static initView(el, cfg, holder, callback) {
        callback(new Element({
            el: el,
            selectors: Base.getModel("selectors", cfg, el, holder)
        }));
    }
}
module.exports = Element;