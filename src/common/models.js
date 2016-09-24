var Mdv = require("mui/mdv/mdv2"),
    MString =require("./string")
class Module {
    /**
     * 判断是否相等
     */
    static mAll(mdvIn) {
        mdvIn = new Mdv(mdvIn);
        var mdvOut = new Mdv();
        mdvOut.defineModel("out", mdvIn.getModel("models")
            .then(Mdv.all));
        return mdvOut;
    }
    /**
     * 判断是否相等
     */
    static mLatest(mdvIn) {
        mdvIn = new Mdv(mdvIn);
        var mdvOut = new Mdv();
        mdvOut.defineModel("out", mdvIn.getModel("models")
            .then(Mdv.race)
            .then(function (value) {
                return value[value._lastIndex]
            }))
        return mdvOut;
    }

    /**
     * 判断是否相等
     */
    static mIsEquel(mdvIn) {
        mdvIn = new Mdv(mdvIn);
        var mdvOut = new Mdv();
        mdvOut.defineModel("out", mdvIn.getModel("models")
            .then(function (models) {
                return Mdv.race(models).then(function (values, callParams) {
                    var value, hasEmpty;
                    for (var i = values.length - 1; i >= 0; i--) {
                        if (values[i] === undefined) {//如果值还没有准备好
                            hasEmpty = true;
                            continue;
                        }
                        if (value === undefined) {//初始化第一个值
                            value = values[i];
                            continue;
                        }
                        if (values[i] !== value) {//如果有一个不相等，就肯定不相等
                            return false;
                        }
                    }
                    if (hasEmpty) {
                        callParams.ignore = true;
                    }
                    else {//如果全部比较完，就认为相等
                        return true;
                    }
                })
            }));
        return mdvOut;
    }

    /**
     * 与操作
     */
    static mAnd(mdvIn) {
        mdvIn = new Mdv(mdvIn);
        var mdvOut = new Mdv();
        mdvOut.defineModel("out", mdvIn.getModel("models")
            .then(function (models) {
                return Mdv.race(models).then(function (values, callParams) {
                    var hasEmpty;
                    for (var i = values.length - 1; i >= 0; i--) {
                        if (values[i] === undefined) {//如果值还没有准备好
                            hasEmpty = true;
                            continue;
                        }
                        if (!values[i]) {//如果有一个false，则false
                            return values[i];
                        }
                    }
                    if (hasEmpty) {
                        callParams.ignore = true;
                    }
                    else {//如果全部比较完，就认为为true
                        return values[0];
                    }
                })
            }));
        return mdvOut;
    }

    /**
     * 或操作
     */
    static mOr(mdvIn) {
        mdvIn = new Mdv(mdvIn);
        var mdvOut = new Mdv();
        mdvOut.defineModel("out", mdvIn.getModel("models")
            .then(function (models) {
                return Mdv.race(models).then(function (values, callParams) {
                    var hasEmpty;
                    for (var i = values.length - 1; i >= 0; i--) {
                        if (values[i] === undefined) {//如果值还没有准备好
                            hasEmpty = true;
                            continue;
                        }
                        if (values[i]) {//如果有一个true，则true
                            return values[i];
                        }
                    }
                    if (hasEmpty) {
                        callParams.ignore = true;
                    }
                    else {//如果全部比较完，就认为相等
                        return values[0];
                    }
                })
            }));
        return mdvOut;
    }

    /**
     * 计算操作
     */
    static mCalc(mdvIn) {
        mdvIn = new Mdv(mdvIn);
        var mdvOut = new Mdv();
        mdvOut.defineModel("out", Mdv.all([
            mdvIn.getModel("models").thenOnce(),
            mdvIn.getModel("equation").thenOnce()])
            .then(function (values) {
                return (function (models, equation) {
                    return Mdv.all(models).then(MString.eval)
                }).apply(this, values)
            }));
        return mdvOut;
    }

    /**
     * 计算操作
     */
    static mSelect(mdvIn) {
        mdvIn = new Mdv(mdvIn);
        var mdvOut = new Mdv();
        mdvOut.defineModel("out", Mdv.all([
            mdvIn.getModel("models").thenOnce(),
            mdvIn.getModel("select")])
            .then(function (values) {
                return (function (models, select) {
                    return models[select];
                }).apply(this, values)
            }));
        return mdvOut;
    }
}
module.exports = Module;