/*
 @author 游侠
 */
var Mdv = require("mui/mdv/mdv2"),
    Base = require("./base"),
    Xtpl = require("mui/xtemplate/");
class Element extends Base {
    /*
     * 将字符串转换为渲染对象
     * */
    static getRender(tpl) {
        if (typeof(tpl) != "string") {
            throw 'tpl must be string'
        }
        return new Xtpl(tpl);
    }

    initEl(el, mdvIn) {
        var self = this;
        self.defineModel("out", Mdv.all([
            mdvIn.getModel("tpl").thenDemandOnce(Element.getRender),
            mdvIn.getModel("data")
        ]).then(function (values) {
            return function (render, data) {
                el.innerHTML = render.render(data);
                return el;
            }.apply(this, values)
        }));
    }

    static initView(el, cfg, holder, callback) {
        callback(new Element({
            el: el,
            data: Base.getModel("data", cfg, el, holder),
            tpl: Base.getModel("tpl", cfg, el, holder)
        }));
    }
}
module.exports = Element;