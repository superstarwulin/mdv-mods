var Mdv = require("mui/mdv/mdv2"),
    Common = require("./common"),
    MObject = require("./object"),
    Loader = require("./loader");
class Module {
    /**
     * 字符串模板，其中包含model定义
     */
    static parseModel(str, mdv) {
        var map ={},
            hasModel = false,
            modelReg = /%\{([^\}]+)\}/g,
            modelResult;
        while(modelResult = modelReg.exec(str))
        {
            hasModel = true;
            map[modelResult[1]]=mdv.getModel(modelResult[1]);
            if(!map[modelResult[1]]){throw 'model '+modelResult[1]+'not exists'}
        }
        if(!hasModel){
            return str;
        }
        return Mdv.map(map).then(function(values){
            return str.replace(modelReg,function(a,b){
                return values[b];
            })
        })
    }
    /**
     * 去除字符串首尾空格
     */
    static trim(x) {
        if (typeof x !== "string") {
            return x;
        }
        return x.replace(/^\s+/, "").replace(/\s+$/, "");
    }

    /**
     * 去除字符串首尾空格
     */
    static eval(x) {
        var result;
        try{
            return eval("(" + x + ")");
        }
        catch(e){
            throw e;
            throw 'eval error: '+x;
        }
    }

    /**
     * 将JSON转化成字符串
     */
    static toJson(x) {
        return JSON.parse(x);
    }

    /**
     * 将JSON转化成字符串
     */
    static toParam(str,sep,eq) {
        if (typeof str != 'string' || !(str = Module.trim(str))) {
            return {};
        }
        sep = sep || '&';
        eq = eq || '=';
        var ret = {},
            eqIndex,
            pairs = str.split(sep),
            key, val,
            i = 0, len = pairs.length;

        for (; i < len; ++i) {
            eqIndex = pairs[i].indexOf(eq);
            if (eqIndex == -1) {
                key = decodeURIComponent(pairs[i]);
                val = undefined;
            } else {
                key = decodeURIComponent(pairs[i].substring(0, eqIndex));
                val = pairs[i].substring(eqIndex + 1);
                val = decodeURIComponent(val);
                if (/\[\]$/.test(key)) {
                    key = key.substring(0, key.length - 2);
                }
            }
            if (key in ret) {
                if (Array.isArray ? Array.isArray(ret[key]) : Object.prototype.toString.call(ret[key]) === '[object Array]') {
                    ret[key].push(val);
                } else {
                    ret[key] = [ret[key], val];
                }
            } else {
                ret[key] = val;
            }
        }
        return ret;
    }
    /**
     * 在字符串前面补0
     */
    static mZeroize(mdvIn) {
        return Common.syncProcess(mdvIn, ["in", "num"], function (str, num) {
            if(typeof(str)!="string"){str=str.toString();}
            while(str.length<num){str='0'+str};
            return str;
        });
    }

    /**
     * 进行字符串替换
     */
    static mReplace(mdvIn) {
        return Common.syncProcess(mdvIn, ["in", "tpl"], function (str, tpl) {
            if(typeof(str)!="string"){str=str.toString();}
            return str.replace(/^(.+)$/,tpl);
        });
    }

    /**
     * 切割字符串
     */
    static mSubstring(mdvIn) {
        return Common.syncProcess(mdvIn, ["in", "start", "end"], function (str, start, end) {
            if (typeof str != "string") {
                return str;
            }
            return str.substring(start, end);
        });
    }
    /**
     * URL拼接，将URL和参数拼接成新的URL
     */
    static mUrl(mdvIn) {
        mdvIn = new Mdv(mdvIn);
        var mdvOut = new Mdv();
        mdvOut.defineModel("out", Mdv.all([
            mdvIn.getModel("in"),
            mdvIn.getModel("params")
        ]).thenDemand(function (values) {
            function convert(paramStr,params) {
                var obj = Module.toParam(paramStr);
                for (var key in params) {
                    if (!params.hasOwnProperty(key)) {
                        continue;
                    }
                    obj[key] = params[key];
                }
                return MObject.toParamString(obj)
            }
            return (function (url, params) {
                var index1 = url.indexOf("?");
                if (index1 >= 0) {
                    var urlQA = url.substring(index1 + 1);
                    var index2 = urlQA.indexOf("#")
                    if (index2 >= 0) {
                        return url.substring(0, index1) + "?" + convert(urlQA.substring(0, index2),params) + "#" + urlQA.substring(index2)
                    }
                    else {
                        return url.substring(0, index1) + "?" + convert(urlQA,params)
                    }
                }
                else {
                    var index2 = url.indexOf("#")
                    if (index2 >= 0) {
                        return url.substring(0, index2) + "?" + convert('',params) + "#" + url.substring(index2)
                    }
                    else {
                        return url + "?" + convert('',params)
                    }
                }
            }).apply(null, values);
        }));
        return mdvOut;
    }
}
module.exports = Module;