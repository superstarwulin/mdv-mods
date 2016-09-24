define('mui/mdv-mods/common/date',function (require, exports, module) {
var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ('value' in descriptor)
                    descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function (Constructor, protoProps, staticProps) {
            if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
                defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}
var Mdv = require('mui/mdv/mdv2'), Common = require('./common');
function _dateToString(date, format) {
    if (date == null) {
        return '';
    }
    if (!(date instanceof Date)) {
        var d = new Date(date);
        if (d.toString() === 'Invalid Date') {
            return 'Invalid Date';
        }
        date = d;
    }
    var x = {
            'y{1,4}': date.getFullYear(),
            // year
            'M{1,2}': date.getMonth() + 1,
            // month
            'd{1,2}': date.getDate(),
            // day
            'h{1,2}': date.getHours(),
            // hour
            'm{1,2}': date.getMinutes(),
            // minute
            's{1,2}': date.getSeconds(),
            // second
            'q{1}': Math.floor((date.getMonth() + 3) / 3),
            // quarter
            'S{1,3}': date.getMilliseconds()    // millisecond
        };
    for (var k in x) {
        if (x.hasOwnProperty(k)) {
            format = format.replace(new RegExp(k, 'g'), function ($) {
                return ('0000' + x[k]).substr(-$.length);
            });
        }
    }
    return format;
}
var Module = function () {
        function Module() {
            _classCallCheck(this, Module);
        }
        _createClass(Module, null, [{
                key: "stringToDate",
                value: function stringToDate(string) {
                    if (!string) {
                        return new Date();
                    }
                    return new Date(string);
                }
            }, {
                key: "dateToString",
                value: function dateToString(data) {
                    return _dateToString(data, "yyyy-MM-dd hh:mm:ss");
                }
            }, {
                key: "getYear",
                value: function getYear(date) {
                    return date.getFullYear();
                }
            }, {
                key: "getMonth",
                value: function getMonth(date) {
                    return date.getMonth() + 1;
                }
            }, {
                key: "dateToTimestamp",
                value: function dateToTimestamp() {
                    return date.valueOf();
                }
            }, {
                key: "timestampToDate",
                value: function timestampToDate(timestamp) {
                    return new Date(timestamp);
                }
            }, {
                key: "mDateToString",
                value: function mDateToString(mdvIn) {
                    return Common.syncProcess(mdvIn, ["in", "format"], function (date, format) {
                        return _dateToString(date, format);
                    });
                }
            }, {
                key: "mStringToDate",
                value: function mStringToDate(mdvIn) {
                    return Common.syncProcess(mdvIn, ["in"], pStringToDate);
                }
            }]);
        return Module;
    }();
module.exports = Module;
});
