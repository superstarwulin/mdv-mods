/*
 @author 游侠
 */
var Mdv = require("mui/mdv/mdv2"),
    Dom = require("../common/dom");
class Element extends Mdv {
    constructor(mdvIn) {
        super();
        mdvIn = new Mdv(mdvIn);
        var self = this,
            initModel = mdvIn.getModel("el").thenOnce(function (el) {
                self.initEl(el, mdvIn);
                return self;
            });
        self.defineModel(true, function (name) {
            return initModel.then(function (self) {
                var model = self.getModel(name, -7);
                if (!model) {
                    throw 'model ' + name + ' not exists'
                }
                return model || null;
            })
        }, -8);
    }

    static initView(el, cfg, holder, callback) {
        var mdvIn = Dom.getMdv(el, holder);
        mdvIn.addObject(cfg, 2);
        mdvIn.defineModel("el", Mdv.createLiteral(el), 5)
        callback(new Element(mdvIn));
    }

    static getModel(attr, cfg, el, holder) {
        return cfg[attr] !== undefined ? cfg[attr] : (holder.getModel(el.getAttribute("mdv-model-" + attr)) || undefined);
    }
    static getProcess(attr, cfg, el, holder) {
        return typeof cfg[attr] === "function" ? cfg[attr] : (holder.getProcess(el.getAttribute("mdv-process-" + attr)) || undefined);
    }
}
module.exports = Element;