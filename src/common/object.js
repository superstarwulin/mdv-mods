var Mdv = require("mui/mdv/mdv2"),
    Common = require("./common");
class Module {
    /**
     * 将包含一个或多个Model的Object对象转换成Object的模型
     */
    static createObject(obj) {
        return Mdv.createObject(obj);
    }

    static parseModel(json, mdv) {
        function walkJson(obj) {
            for (var key in obj) {
                if (!obj[key] || !obj.hasOwnProperty(key) || obj[key] == obj) {
                    continue;
                }
                if (typeof(obj[key]) == "object") {
                    walkJson(obj[key]);
                    continue;
                }
                var result1, result2;
                if (typeof(obj[key]) == "string" && (result1 = /^%\{([^\}]+)\}$/.exec(obj[key]))) {
                    if (result2 = /^(.+)\[(\d+)\]$/.exec(result1[1])) {
                        obj[key] = mdv.getModel(result2[1])
                            .then(function (models) {
                                var model = models[result2[2]];
                                if(!model){throw 'models['+result1[1]+'] not exists'}
                                return model;
                            });
                    }
                    else {
                        obj[key] = mdv.getModel(result1[1])
                        if(!obj[key]){throw 'models['+result1[1]+'] not exists'}
                    }
                }
            }
        }

        walkJson(json);
        return json;
    }
    /**
     * 将JSON转化成字符串
     */
    static toJsonString(x) {
        return JSON.stringify(x);
    }
    /**
     * 将JSON转化成字符串
     */
    static toParamString(obj,sep,eq,serializeArray) {
        sep = sep || '&';
        eq = eq || '=';
        function isValidValue(val) {
            var t = typeof val;
            // If the type of val is null, undefined, number, string, boolean, return true.
            return val == null || (t !== 'object' && t !== 'function');
        }
        if (serializeArray === undefined) {
            serializeArray = true;
        }
        var buf = [], key, i, v, len, val;
        for (key in obj) {

            val = obj[key];
            key = encodeURIComponent(key);

            // val is valid non-array value
            if (isValidValue(val)) {
                buf.push(key);
                if (val !== undefined) {
                    buf.push(eq, encodeURIComponent(val + ''));
                }
                buf.push(sep);
            }
            // val is not empty array
            else if ((Array.isArray ? Array.isArray(val) : Object.prototype.toString.call(val) === '[object Array]') && val.length) {
                for (i = 0, len = val.length; i < len; ++i) {
                    v = val[i];
                    if (isValidValue(v)) {
                        buf.push(key, (serializeArray ? encodeURIComponent('[]') : ''));
                        if (v !== undefined) {
                            buf.push(eq, encodeURIComponent(v + ''));
                        }
                        buf.push(sep);
                    }
                }
            }
        }
        buf.pop();
        return buf.join('');
    }

    /**
     *  取对象属性
     */
    static mGet(mdvIn) {
        return Common.syncProcess(mdvIn, ["in", "key"], function (obj, key) {
            return obj[key];
        });
    }

    /**
     *  取对象属性
     */
    static mIfProp(mdvIn) {
        mdvIn = new Mdv(mdvIn);
        var mdvOut = new Mdv();
        mdvOut.defineModel("out", Mdv.all([
            mdvIn.getModel("in"),
            mdvIn.getModel("key"),
            mdvIn.getModel("type") || Mdv.createLiteral("")])
            .then(function (values, callParams) {
                return (function (obj, key, type) {
                    if (type == "not") {
                        if (obj[key]) {
                            callParams.ignore = true;
                        }
                    }
                    else {
                        if (!obj[key]) {
                            callParams.ignore = true;
                        }
                    }
                    return obj;
                }).apply(this, values)
            }));
        return mdvOut;
    }

    /**
     * 将包含占位符model定义的json字符串转化为JSON
     */
    static mObject(mdvIn) {
        mdvIn = new Mdv(mdvIn);
        var mdvOut = new Mdv();
        mdvOut.defineModel("out", mdvIn.getModel("in")
            .thenOnce(function (json) {
                return Module.parseModel(json, mdvIn)
            })
            .then(Module.createObject));
        return mdvOut;
    }
}
module.exports = Module;