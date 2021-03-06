var Mdv = require("mui/mdv/mdv2");
var Array = require("./array");
var Loader = require("./loader");
class Module {
    static getDom(ele){
        return Mdv.createLiteral(ele)
            .then(Module.queryDom)
            .then(function (v) {
                return v[0] || null;
            });
    }
    static getHtml(el){
        return el.innerHTML;
    }
    static getValue(el){
        return el.value;
    }
    static getComputedStyle(elem, name) {
        var val = '', computedStyle;
        try {
            if (computedStyle = document.defaultView && document.defaultView.getComputedStyle(elem, null)) {
                val = computedStyle.getPropertyValue(name) || computedStyle[name];
            }
        } catch (ex) {

        }
        try {
            if (val === '') {
                val = elem.currentStyle[name];
            }
            ;
        } catch (ex) {
        }

        if (val === '') {
            val = elem.style[name];
        }
        return val;
    }

    static queryDom(ele) {
        if (ele.nodeType) {
            return [ele];
        }
        if (typeof ele.get === 'function') {
            ele = ele.get();
        }
        if (Array.isArray(ele)) {
            return Mdv.map(ele, function(el){
                return Mdv.createLiteral(el)
                    .then(Module.queryDom);
            }).then(function (values) {
                var result = [];
                for (var i = 0; i < values.length; i++) {
                    result = result.concat(values[i]);
                }
                return result;
            });
        }
        if (window.$) {
            return $(ele).get();
        }
        if (window.KISSY) {
            var DOM = KISSY.DOM;
            if (DOM) {
                return DOM.query(ele);
            }
            if (KISSY.UA) {
                return Mdv.createLiteral("dom")
                    .then(Loader.kissyUse)
                    .then(function (DOM) {
                        return DOM.query(ele);
                    })
            }
        }
        if (document.querySelectorAll) {
            var result = [], nodeList = document.querySelectorAll(ele);
            for (var i = 0; i < nodeList.length; i++) {
                result.push(nodeList[i]);
            }
            return result;
        }
        return document.getElementsByClassName(ele.substring(1));
    }
    static getMdv(el, holder) {
        var mdv = new Mdv(),
            attrs = el.attributes;
        for (var idx in attrs) {
            var key = attrs[idx].name;
            if (/^mdv-model-/.test(key)) {
                var model = holder.getModel(el.getAttribute(key));
                if(!model){throw 'model '+el.getAttribute(key)+' not exists';}
                mdv.defineModel(key.substring(10), model)
            }
            if (/^mdv-process-/.test(key)) {
                var process = holder.getProcess(el.getAttribute(key));
                if(!process){throw 'process '+el.getAttribute(key)+' not exists';}
                mdv[key.substring(12)]=process;
            }
        }
        return mdv;
    }
}
module.exports = Module;