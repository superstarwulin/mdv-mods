var Mdv = require("mui/mdv/mdv2");
class Module {
    /**
     * 使用多参数的函数handle来处理mdvIn,参数由list指定
     */
    static syncProcess(mdvIn, list, handle) {
        if(!handle){throw 'handle not defined for ['+list.join(",")+']'}
        mdvIn = new Mdv(mdvIn);
        var mdvOut = new Mdv(), models = [];
        for (var i = 0; i < list.length; i++) {
            var model = mdvIn.getModel(list[i]);
            if(!model){throw 'model '+list[i]+' not exists';}
            models.push(model);
        }
        mdvOut.defineModel("out", Mdv.all(models).thenDemand(function (values) {
            return handle.apply(null, values);
        }));
        return mdvOut
    }

    /**
     * 否
     */
    static not(v) {
        return !v;
    }

    /**
     * 转化成字符串
     */
    static toString(x) {
        return (x || x === 0) ? x.toString() : "";
    }

    /**
     * 判断一个值是否为空
     */
    static isNull(arg) {
        return arg === null;
    }

    /**
     * 不做任何处理
     */
    static mDirect(mdvIn) {
        return Module.syncProcess(mdvIn, ["in"], function (value) {
            return value;
        })
    }

    /**
     * 在in模型变更的时候，out输出另一个模型的值
     */
    static mIf(mdvIn) {
        mdvIn = new Mdv(mdvIn);
        var mdvOut = new Mdv();
        mdvOut.defineModel("out", mdvIn.getModel("in").then(function(value){
            return value?mdvIn.getModel("true"):mdvIn.getModel("false");
        }));
        return mdvOut
    }

    /**
     * 在in模型变更的时候，out输出另一个模型的值
     */
    static mReplace(mdvIn) {
        mdvIn = new Mdv(mdvIn);
        var mdvOut = new Mdv();
        mdvOut.defineModel("out", mdvIn.getModel("in").then(function (value) {
            return mdvIn.getModel("value").thenOnce()
        }));
        return mdvOut;
    }

    /**
     * 去重，仅在数据变化时透传
     */
    static mDistinct(mdvIn) {
        mdvIn = new Mdv(mdvIn);
        var mdvOut = new Mdv();
        mdvOut.defineModel("out", Mdv.createModel(function (resolve) {
            var lastValue = undefined;
            mdvIn.getModel("in").then(function (value, callParams) {
                if (lastValue === value) {
                    callParams.ignore = true;
                    return;
                }
                resolve(value, callParams);
            });
        }));
        return mdvOut;
    }

    /**
     * 返回数据流之中每个值记录下来的数组
     */
    static mHistory(mdvIn) {
        mdvIn = new Mdv(mdvIn);
        var mdvOut = new Mdv();
        mdvOut.defineModel("out", Mdv.createModel(function (resolve, reject) {
            var result = [];
            mdvIn.getModel("in").then(function (value) {
                result.push(value);
                resolve(result);
            });
        }));
        return mdvOut;
    }
}
module.exports = Module;