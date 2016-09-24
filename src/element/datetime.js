/*
 @author 游侠
 */
var Mdv = require("mui/mdv/mdv2"),
    Base = require("./base"),
    Common = require("../common/common"),
    Loader = require("../common/loader"),
    Event = require("mui/zepto/event"),
    $ = require("mui/zepto/zepto");
class Element extends Base {
    initEl(el, mdvIn) {
        var self = this,
            minValueModel = mdvIn.getModel("minValue") || Mdv.createLiteral(el.getAttribute("data-minValue") || ""),
            maxValueModel = mdvIn.getModel("maxValue") || Mdv.createLiteral(el.getAttribute("data-maxValue") || ""),
            typeModel = mdvIn.getModel("type") || Mdv.createLiteral(el.getAttribute("data-type") || "date"),
            callbacked = false;

        mdvIn.getModel("enable") && mdvIn.getModel("enable")
            .then(function (enable) {
                el.disabled = enable === false;
            })
        //实现值模型
        self.defineModel("value", Mdv.createModel(function (resolve, reject) {
                mdvIn.getModel("value") && mdvIn.getModel("value").then(function () {
                    callbacked = true;
                    resolve(el.value);
                })
                $(el).on("change blur", function () {
                    callbacked = true;
                    resolve(el.value);
                })
                if (!callbacked) {
                    resolve(el.value);
                }

            })
                .thenMdv(Common.mDistinct)
        );

        mdvIn.getModel("value") && mdvIn.getModel("value").then(function (value) {
            el.value = value || "";
        });

        var calLoader;
        $(el).on("click", function (e) {
            if (e.target != el) {
                return;
            }
            if (calLoader) {
                calLoader.thenOnce(function (calendar) {
                    calendar.destroy();
                });
            }
            calLoader = Mdv.createLiteral("mui/calendar/calendar")
                .then(Loader.kissyUse)
                .then(function (Calendar) {
                    return Mdv.all([
                        minValueModel.thenOnce(),
                        maxValueModel.thenOnce(),
                        typeModel.thenOnce()
                    ]).then(function (values) {
                        return (function (minValue, maxValue, type) {
                            var calendar = new Calendar(el, {
                                minDate: minValue ? new Date(minValue) : false,
                                maxDate: maxValue ? new Date(maxValue) : false,
                                showTime: type == "datetime"
                            }).getCalendar();
                            calendar.on(type == "datetime" ? 'timeSelect' : 'select', function (e) {
                                $(el).trigger("change")
                            });
                            return calendar;
                        }).apply(null, values);
                    });
                })
            setTimeout(function(){
                calLoader.thenOnce(function (calendar) {
                    calendar.show();
                });
            },16);
        })
    }

    static initView(el, cfg, holder, callback) {
        callback(new Element({
            el: el,
            value: Base.getModel("value", cfg, el, holder),
            type: Base.getModel("type", cfg, el, holder),
            minValue: Base.getModel("minValue", cfg, el, holder),
            maxValue: Base.getModel("maxValue", cfg, el, holder),
        }));
    }
}
module.exports = Element;