/*
 @author 游侠
 */
var Mdv = require("mui/mdv/mdv2"),
    Common = require("./common");
class Module {

    static regExp(x, reg, msg) {
        return (!x || reg.test(x)) ? "" : (msg || "格式不正确");
    }

    static email(v) {
        return Module.regExp(v,/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, "email格式不正确");
    }

    static tel(v) {
        return Module.regExp(v,/^\d{3}-\d{8}$|^\d{4}-\d{7}$|^\d{11}$/, "电话号码格式不正确");
    }

    static positiveInteger(v) {
        return Module.regExp(v,/^\+?[1-9]\d*$/, "必须输入正整数");
    }

    static integer(v) {
        return Module.regExp(v,/^[\+-]?[0-9]\d*$/, "必须输入整数");
    }

    static itemName(v) {
        return Module.regExp(v,/^[^\"\']{1,1024}$/, "格式不正确");
    }

    static mRegExp(mdvIn) {
        return Common.syncProcess(mdvIn, ["in", "reg", "message"], regExp);
    }

    static mLenLimit(mdvIn) {
        return Common.syncProcess(mdvIn, ["in", "min", "max", "msg"], function (x, min, max, msg) {
            var len = (x && x.length) || 0;
            if (x && min >= 0 && len < min) {
                return (msg || '长度必须大于' + min);
            }
            if (x && max >= 0 && len > max) {
                return (msg || '长度必须小于' + max);
            }
            return "";
        });
    }

    static mNoBlank(mdvIn) {
        return Common.syncProcess(mdvIn, ["in", "message"], function (x, msg) {
            return (x ? "" : (msg || "不能为空"));
        });
    }
}
module.exports = Module;