/*
 @author 游侠
 */
var Mdv = require("mui/mdv/mdv2"),
    Base = require("./base"),
    MLoader = require("../common/loader");
class Element extends Base {
    initEl(el, mdvIn) {
        var self = this;
        self.defineModel("render", Mdv.createLiteral('mui/seller-charts/echarts/echarts')
            .thenOnce(MLoader.require)
            .thenOnce(function (echarts) {
                return echarts.init(el)
            }))
        self.defineModel(/^event_(.+)/,function(name){
            return Mdv.createModel();
        });
        Mdv.all([self.getModel("render"), mdvIn.getModel("option")])
            .then(function (values) {
                return (function (render, option) {
                    render.setOption(option,true);
                }).apply(null, values)
            });
    }

    static initView(el, cfg, holder, callback) {
        callback(new Element({
            el: el,
            option: Base.getModel("option", cfg, el, holder)
        }));
    }
}
module.exports = Element;