var Mdv = require("mui/mdv/mdv2"),
    Common = require("../common/common"),
    Models = require("../common/models"),
    Loader = require("../common/loader");
class Component extends Mdv {
    constructor(mdvIn) {
        super();
        mdvIn = new Mdv(mdvIn);
        var modMap = {}, modelParams;
        this.defineModel(true, function (modelName) {
            return mdvIn.getModel("fbpJson").thenOnce(function (json) {
                var outport = json.outports[modelName];
                return onProcess(outport.process, json).thenOnce(function (p_outPorts) {
                    var model = p_outPorts.getModel(outport.port);
                    if(!model){throw 'model '+outport.port+" not exists"}
                    return model;
                });
            })
        });

        function onProcess(name, json) {
            return (modMap[name] = modMap[name] || Mdv.createModel(function (resolve, reject) {
                    if (!json.processes[name]) {
                        reject("process " + name + " not exists!");
                    }
                    else {
                        resolve(json.processes[name]);
                    }
                }))
                .thenOnce(function (process) {
                    return process.component;
                })
                .thenOnce(Component.parseComponent)
                .thenOnce(function (Process) {
                    var p_connections = {},
                        p_inPorts = new Mdv(),
                        listMap = {},
                        connections = json.connections;

                    function onConnectionSrc(src) {
                        return onProcess(src.process, json)
                            .thenOnce(function (process) {
                                var port = src.port;
                                if (typeof(src.index) == "number") {
                                    port += "[" + src.index + "]";
                                }
                                var model = process.getModel(port);
                                if(!model){throw 'model '+port+" not exists"}
                                return model;
                            });
                    }

                    for (var i = connections.length - 1; i >= 0; i--) {
                        if (connections[i].tgt.process == name) {
                            var tgt = connections[i].tgt, port = tgt.port;
                            if (typeof(tgt.index) == "number") {
                                port += "[" + tgt.index + "]";
                            }
                            var result = p_connections[port] = p_connections[port] || [];
                            if (connections[i].data !== undefined) {
                                result.push(Mdv.createLiteral(connections[i].data));
                            }
                            else {
                                result.push(onConnectionSrc(connections[i].src));
                            }
                        }
                    }
                    //外部链接
                    for (var key in json.inports) {
                        if (!json.inports.hasOwnProperty(key)) {
                            continue;
                        }
                        if (json.inports[key].process == name) {
                            var result = p_connections[json.inports[key].port] = p_connections[json.inports[key].port] || [];
                            if (!modelParams) {
                                modelParams = mdvIn.getModel("params").then(function (params) {
                                    return params.getModel ? params : new Mdv(params);
                                })
                            }
                            result.push(modelParams.then((function (key) {
                                return function (params) {
                                    var model = params.getModel(key);
                                    if(!model){throw 'model '+key+' not exists'}
                                    return model;
                                }
                            })(key)));
                        }
                    }
                    for (var key in p_connections) {
                        if (!p_connections.hasOwnProperty(key)) {
                            continue;
                        }
                        var indRes, model = p_connections[key].length == 1 ? p_connections[key][0] : Models.mLatest({
                            models: p_connections[key]
                        }).getModel("out");
                        if (indRes = /^(.+)\[(\d+)\]$/.exec(key)) {
                            var list = listMap[indRes[1]];
                            if (!list) {
                                list = listMap[indRes[1]] = [];
                                p_inPorts.defineModel(indRes[1], Mdv.createLiteral(list));
                            }
                            list[indRes[2]] = model;
                        }
                        else {
                            p_inPorts.defineModel(key, model);
                        }
                    }
                    return Process(p_inPorts);
                });
        }
    }

    static mProgess(mdvIn) {
        return new Component(mdvIn);
    }

    static parseComponent(component) {
        var comp = component.split("//");

        if (comp.length > 1 && /m[A-Z]/.test(comp[1])) {
            //针对mui/mdv-mods/common/common//mDirect模式
            return Mdv.createLiteral(comp[0])
                .thenOnce(Loader.require)
                .then(function (Cls) {
                    return function (mdvIn) {
                        if(!Cls[comp[1]]){throw 'method '+comp[1]+' not exists'}
                        return Cls[comp[1]](mdvIn);
                    }
                })
        }
        else if (comp.length > 1) {
            //针对mui/mdv-mods/common/common//jsonParse模式
            return Mdv.createLiteral(comp[0])
                .thenOnce(Loader.require)
                .then(function (Cls) {
                    return function (mdvIn) {
                        if(!Cls[comp[1]]){throw 'method '+comp[1]+' not exists'}
                        return Common.syncProcess(mdvIn, ["in"], Cls[comp[1]]);
                    }
                })
        }
        else {
            //针对mui/mdv-mods/element/xtplRender模式
            return Mdv.createLiteral(component)
                .thenOnce(Loader.require)
                .then(function (Cls) {
                    return function (mdvIn) {
                        return new Cls(mdvIn);
                    }
                })
        }
    }
}
module.exports = Component;