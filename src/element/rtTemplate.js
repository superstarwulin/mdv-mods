/*
 @author 游侠
 */
var Mdv = require("mui/mdv/mdv2"),
    Base = require("./base"),
    reactMVVM = require("mui/seller-react-mvvm/");
class Element extends Base {
    initEl(el, mdvIn) {
        var self = this;
        self.defineModel("render", mdvIn.getModel("components")
            .thenOnce(function (components) {
                var rt = reactMVVM.bootstrap({
                    templateString: el.getElementsByTagName("script")[0].innerHTML,
                    container: el,    //渲染时的容器
                    components: components
                });
                rt.fireEvent=function(name){
                    return function(e){
                        self.getModel("event_" + name).resolve(e);
                    }
                }
                return rt;
            }))
        self.defineModel(/^event_(.+)/,function(name){
            return Mdv.createModel();
        });
        Mdv.all([self.getModel("render"), mdvIn.getModel("state")])
            .then(function (values) {
                return (function (render, state) {
                    render.setState(state);
                }).apply(null, values)
            });
    }

    static initView(el, cfg, holder, callback) {
        callback(new Element({
            el: el,
            components: Base.getModel("components", cfg, el, holder),
            state: Base.getModel("state", cfg, el, holder)
        }));
    }
}
module.exports = Element;