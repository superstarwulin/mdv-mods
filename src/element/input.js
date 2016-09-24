/*
 @author 游侠
 */
var Mdv = require("mui/mdv/mdv2"),
    Base = require("./base"),
    Common = require("../common/common"),
    $ = require("mui/zepto/zepto"),
    Event = require("mui/zepto/event");

function getValue(el) {
    if ((el.type == "radio" || el.type == "checkbox") && !el.checked) {
        return "";
    }
    return el.value || "";
}
function setValue(el, value) {
    if ((el.type == "radio" || el.type == "checkbox") && !value) {
        el.checked = false;
        return;
    }
    el.checked = true;
    if (el.type == "radio" && el.name && el.checked) {
        var pFrm = $(el).parent("form");
        if (pFrm) {
            var radios = pFrm.query("input[name='" + el.name + "']");
            for (var i = radios.length - 1; i >= 0; i--) {
                if (radios[i] == el || radios[i].type != "radio") {
                    continue;
                }
                $(radios[i]).trigger("change");
            }
        }
    }
    el.value = (value || value===0)?value:"";
    $(el).trigger("change");
}

class Element extends Base {
    initEl(el,mdvIn) {
        var self = this,
            callbacked = false;

        mdvIn.getModel("enable") && mdvIn.getModel("enable")
            .then(function (enable) {
                el.disabled = enable === false;
            })


        mdvIn.getModel("value") && mdvIn.getModel("value")
            .then(function (value) {
                setValue(el, value);
            })
        //实现click的事件模型
        self.defineModel("click", Mdv.createModel(function (resolve, reject) {
            $(el).on("click", resolve);
        }).then());

        self.defineModel("value", Mdv.createModel(function (resolve, reject) {
                mdvIn.getModel("value") && mdvIn.getModel("value").then(function () {
                    callbacked = true;
                    resolve(getValue(el));
                })
                $(el).on("change", function () {
                    callbacked = true;
                    resolve(getValue(el));
                })
                if (!callbacked) {
                    resolve(getValue(el));
                }

            })
                .thenMdv(Common.mDistinct)
        );

        self.defineModel("valueRealTime", Mdv.createModel(function (resolve, reject) {
                self.getModel("value").then(function () {
                    resolve(getValue(el));
                })
                $(el).on("keypress input", function () {
                    resolve(getValue(el));
                });
            })
                .thenMdv(Common.mDistinct)
        );
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