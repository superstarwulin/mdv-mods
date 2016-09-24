var Mdv = require("mui/mdv/mdv2"),
    Common = require("../common/common"),
    MObject = require("../common/object"),
    MString = require("../common/string"),
    Dom = require("../common/dom");

var guid = 0;

class Element extends Mdv {
    constructor(mdvIn) {
        super();
        mdvIn = new Mdv(mdvIn);
        var self = this;
        self.defineModel("init", Mdv.allOnce([
            mdvIn.getModel("in") || Mdv.createLiteral(null),
            mdvIn.getModel("cls"),
            mdvIn.getModel("cfg")]).thenDemand(function (values) {
            return (function (el, cls, cfg) {
                if (el) {
                    var modCfg = el.getAttribute('mdv-cfg');
                    el.removeAttribute('mdv-cfg');
                    try {
                        if (/^mdv/.test(modCfg)) {
                            modCfg = window[modCfg] || {};
                        } else {
                            modCfg = modCfg ? eval("(" + modCfg + ")") : {};
                        }
                    } catch (err) {
                        modCfg = {};
                        setTimeout(function () {
                            throw err;
                        }, 0)
                    }
                    for (var key in cfg) {
                        modCfg[key] = cfg[key];
                    }
                    cfg = modCfg;
                }
                return {
                    el: el,
                    cls: cls,
                    cfg: cfg,
                    loader: mdvIn.getModel("loader")
                };
            }).apply(this, values);
        }))
        self.defineModel("load", self.getModel("init")
            .thenDemand(function (initObj) {
                if (initObj.loader) {
                    return initObj.loader(initObj);
                }
                var modCfg = initObj.cfg;
                for (var key in modCfg) {
                    var cfg = modCfg[key], prep = cfg && cfg.mdvPrep;
                    if (!prep) {
                        continue;
                    }
                    switch (prep) {
                        case "loadJsonp":
                            var m = Mdv.createModel();
                            cfg.preload = Mdv.createModel(function (resolve) {
                                var h = window,
                                    cb = cfg.callback || ('jsonp' + (guid++)),
                                    cb1 = cb;
                                while (cb1.indexOf(".") > 0) {
                                    var k = cb1.substring(0, cb1.indexOf("."));
                                    h = h[k] || (h[k] = {});
                                    cb1 = cb1.substring(cb1.indexOf(".") + 1);
                                }
                                h[cb1] = function (v) {
                                    m.resolve(v);
                                };
                                var params = ["callback=" + cb, "t=" + (+new Date())];
                                for (var key in cfg.param) {
                                    params.push(key + "=" + encodeURIComponent(cfg.param[key]));
                                }
                                resolve(cfg.url + params.join("&"));
                            })
                                .then(getScript)
                                .then(function () {
                                    return m;
                                });
                    }
                }
                return Mdv.all([
                    mdvIn.getModel("holder"),
                    mdvIn.getModel("in") || Mdv.createLiteral(null)
                ])
                    .then(function (values) {
                        return (function (holder, el) {
                            if(!initObj.cls){throw 'mdv module not defined'}
                            return holder.getComponent(initObj.cls, el, modCfg)
                        }).apply(null, values)
                    })
                    .then(function (component) {
                        return component();
                    })
            }))
    }
}

class Component extends Mdv {
    constructor(mdvIn) {
        super();
        var self = this;
        mdvIn = self.mdvIn = new Mdv(mdvIn);
        self.defineModel("__new", Mdv.createModel(), 8);
        //Object或者数组定义模型
        var objReg = /^\s*[\[\{].+[\]\}]\s*$/;
        self.defineModel(objReg, function (str) {
            return Mdv.createLiteral(str)
                .then(function (str) {
                    return str.replace(/([^'"])(%\{[^\}]+\})/g, function (a, b, c) {
                        return b + "\"" + c.replace("\"", "\\\"") + "\""
                    })
                })
                .then(MString.eval)
                .then(function (json) {
                    return MObject.parseModel(json, self);
                })
        }, 6);
        //常量字符串定义模型
        var literalReg = /^\s*(['"])(.*)\1\s*$/
        self.defineModel(literalReg, function (name) {
            var literalResult = literalReg.exec(name);
            return Mdv.createLiteral(literalResult[2])
                .then(function (str) {
                    return MString.parseModel(str, self);
                });
        }, 6);
        //常量数字定义模型
        var numberReg = /^\s*((?:-|\+)?\d+(?:\.\d+)?)\s*$/
        self.defineModel(numberReg, function (name) {
            var numberResult = numberReg.exec(name);
            return Mdv.createLiteral(numberResult[1])
                .then(MString.eval);
        }, 6);
        //常量布尔值定义模型
        var boolReg = /^\s*(true|false|null)\s*$/
        self.defineModel(boolReg, function (name) {
            var boolResult = boolReg.exec(name);
            return Mdv.createLiteral(boolResult[1])
                .then(MString.eval);
        }, 6);
        //存在中间处理过程的模型
        self.defineModel(/->/, function (name) {
            var pos = name.indexOf('->'),
                process = self.getProcess(name.substring(pos));
            return process(self.getModel(name.substring(0, pos)));
        }, 5);
        //取子模块内容的模型
        var propReg = /^(~)?\s*([#a-zA-Z0-9_\-]+)\s+([a-zA-Z.0-9_]+(?:\[([0-9]+)\])?)\s*$/
        self.defineModel(propReg, function (name) {
            var propResult = propReg.exec(name);
            if(propResult[1]=="~"){
                return self.getModel(propResult[2])
                    .then(function(mod){
                        return Mdv.createModel(function (resolve, reject) {
                            mod.getModel("load")
                                .then(function (onResolve, setParams) {
                                    resolve(onResolve, setParams);
                                }, {passive: true});
                        })
                    })
                    .then(function (mod) {
                        var model = mod.getModel(propResult[3]);
                        if (!model) {
                            throw 'model ' + propResult[3] + ' not exists'
                        }
                        return model;
                    })
            }
            return self.getModel(propResult[2])
                .then(function (mod) {
                    return mod.getModel("load")
                })
                .then(function (mod) {
                    var model = mod.getModel(propResult[3]);
                    if (!model) {
                        throw 'model ' + propResult[3] + ' not exists'
                    }
                    return model;
                },{});
        }, 5);
        //根据选择器取子节点的模型
        var elReg = /^#(.+)$/
        self.defineModel(elReg, function (name) {
            var elResult = elReg.exec(name);
            return Mdv.createLiteral(name)
                .then(Dom.getDom)
                .then(function (el) {
                    var model = self.getModel(el);
                    if(!model){throw 'DOM null '+name;}
                    return model;
                })
        }, 2);
        self.defineModel(/[a-zA-Z0-9_\-\/]+/, function (cls) {
            return new Element({
                cls: cls,
                holder: self
            });
        }, -5);

        self.defineModel("datalazyload", function (name) {
            return mdvIn.getModel("mui/datalazyload/")
                .then(function (Datalazyload) {
                    return (Datalazyload.instance && Datalazyload.instance()) || new Datalazyload(document.body, {
                            autoDestroy: false
                        });
                })
        });
    }

    getProcess(name){
        //存在中间处理过程的模型
        var self = this, compResult, compReg = /\s*->\s*(?:\s+([a-zA-Z.0-9_]+(?:\[([0-9]+)\])?\s+))?([#a-zA-Z0-9_\-]+)?\s*(?:\(([a-zA-Z/\-0-9_]+)(?:\:([^\)]+))?\))?(?:\s+([a-zA-Z.0-9_]+(?:\[([0-9]+)\])?)?)?\s*$/;
        if (compResult = compReg.exec(name)) {
            function process(model) {
                 var mdvIn = {},
                    inPorts = compResult[1],
                    outPorts = compResult[6];
                if (compResult[5]) {
                    //按逗号分隔拆分，但忽略引号里面的逗号
                    var params = compResult[5].split(/,(?=([^']*'[^']*'[^']*)+)$/), prmResult, prmReg = /^\s*([a-zA-Z_0-9]+)\s*=\s*(.+)\s*$/;
                    for (var i = params.length - 1; i >= 0; i--) {
                        if (prmResult = prmReg.exec(params[i])) {
                            mdvIn[prmResult[1]] = self.getModel(prmResult[2]);
                            if(!mdvIn[prmResult[1]]){
                                throw 'model '+prmResult[2]+' not exists';
                            }
                        }
                    }
                }
                return Mdv.createLiteral(compResult[4])
                    .then(function (component) {
                        return self.getComponent(component)
                    })
                    .then(function (progess) {
                        return model.thenMdv(progess, mdvIn, inPorts, outPorts);
                    })
            }

            var lastName = name.replace(compReg, "");
            if (/^\s*$/.test(lastName)) {
                return process;
            }
            return function (model) {
                return process(self.getProcess(lastName)(model));
            }
        }
        throw 'process '+name+' not exists';
    }

    getComponent(component, el, cfg) {
        var self = this,
            mdvIn = self.mdvIn,
            comp = /^(.+?)(?:\/\/(.+?)(:(.+))?)?$/.exec(component);
        return Mdv.createLiteral(comp[1])
            .then(function (name) {
                return name.replace(/index(?:\.js)?$/, "");
            })
            .thenOnce(function (name) {
                var model = mdvIn.getModel(name);
                if(!model){throw 'model '+name+' not exists';}
                return model;
            })
            .then(function (Cls) {
                return function (mdvIn) {
                    if (Cls.initView) {
                        return Mdv.createModel(function (resolve) {
                            Cls.initView(el, cfg, self, resolve);
                        });
                    }
                    if (Cls.init) {
                        Cls.init(cfg);
                        return Cls;
                    }
                    if (el && !mdvIn) {
                        mdvIn = Dom.getMdv(el, self)
                    }
                    if(comp[3]){
                        mdvIn.addObject(MString.toParam(comp[3], ','), -1)
                    }
                    if (/m[A-Z]/.test(comp[2])) {
                        //针对mui/mdv-mods/common/common//mDirect模式
                        if(!Cls[comp[2]]){throw 'method '+comp[2]+' not exists'}
                        return Cls[comp[2]](mdvIn);
                    }
                    else if (comp[2]) {
                        //针对mui/mdv-mods/common/common//jsonParse模式
                        if(!Cls[comp[2]]){throw 'method '+comp[2]+' not exists'}
                        return Common.syncProcess(mdvIn, ["in"], Cls[comp[2]]);
                    }
                    else {
                        return new Cls(mdvIn);
                    }
                }
            })
    }

    addModule(name, loader, cfg) {
        var self = this;
        self.defineModel(function (modName) {
            return name === modName
        }, function (cls) {
            return Mdv.createModel(function (resolve) {
                resolve(new Element({
                    cls: cls,
                    loader: loader,
                    cfg: cfg,
                    holder: self
                }))
            });
        }, 5);
    }

    addElement(ele, cls, cfg) {
        var self = this;
        Mdv.createLiteral(ele)
            .then(Dom.queryDom)
            .then(function (els) {
                return Mdv.map(els, function (el) {
                    return Mdv.createLiteral(el).
                        then(function (el, callParams) {
                            for (var parent = el.parentNode; parent; parent = parent.parentNode) {
                                if (parent.getAttribute && parent.getAttribute("mdv-raw")) {
                                    callParams.ignore = true;
                                }
                                var className = parent.className || "";
                                if (/\s+t(m|b)-\S+/.test(className)) {
                                    break;
                                }
                                if (className.indexOf("tb-shop") >= 0) {
                                    callParams.ignore = true;
                                }
                            }
                        }).then(function (el) {
                            var modCls = cls || el.getAttribute("mdv-cls");
                            self.defineModel(function (modName) {
                                return el === modName
                            }, function (el) {
                                return Mdv.createModel(function (resolve) {
                                    var element = new Element({
                                        in: el,
                                        cls: modCls,
                                        cfg: cfg,
                                        holder: self
                                    })
                                    self.getModel("__new").resolve(element);
                                    resolve(element);
                                });
                            }, 5);
                            if (modCls) {
                                self.addAlias(modCls, el);
                            }
                            setTimeout(function(){
                                self.getModel("datalazyload").then(function (datalazyload) {
                                    datalazyload.addCallback(el, function () {
                                        if (Dom.getComputedStyle(el, 'display') == 'none') {
                                            return false;
                                        }
                                        self.getModel(el)
                                            .then(function (mod) {
                                                return mod.getModel("load")
                                            })
                                            .then();
                                    });
                                });
                            },0);
                        })
                })
            })
    }
}
module.exports = Component;