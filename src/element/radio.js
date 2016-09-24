/*
 @author 游侠
 */
var Mdv = require("mui/mdv/mdv2"),
    Base = require("./base"),
    Common = require("../common/common"),
    $ = require("mui/zepto/zepto"),
    Event = require("mui/zepto/event");

function getValue(el) {
    return $(el).find(".on[data-value]").attr("data-value");
}
function setValue(el, value) {
    var els = $(el).find("[data-value]");
    els.each(function (key,itemEl) {
        if (itemEl.getAttribute("data-value") == value) {
            $(itemEl).addClass("on");
        }
        else {
            $(itemEl).removeClass("on");
        }
    })
}

class Element extends Base {
    initEl(el, mdvIn) {
        var self = this,
            callbacked = false;

        mdvIn.getModel("value") && mdvIn.getModel("value")
            .then(function (value) {
                setValue(el, value);
            })

        self.defineModel("value", Mdv.createModel(function (resolve, reject) {
                mdvIn.getModel("value") && mdvIn.getModel("value").then(function () {
                    callbacked = true;
                    resolve(getValue(el));
                })
                $(el).on("click", "[data-value]", function (e) {
                    callbacked = true;
                    setValue(el,e.target.getAttribute("data-value"))
                    resolve(getValue(el));
                })
                if (!callbacked) {
                    resolve(getValue(el));
                }

            })
                .thenMdv(Common.mDistinct)
        );
    }

    static initView(el, cfg, holder, callback) {
        callback(new Element({
            el: el,
            value: Base.getModel("value", cfg, el, holder)
        }));
    }
}
module.exports = Element;