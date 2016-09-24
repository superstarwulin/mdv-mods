var Mdv = require("mui/mdv/mdv2"),
    Common = require("./common");

function dateToString(date, format) {
    if (date == null) {
        return "";
    }
    if (!(date instanceof Date)) {
        var d = new Date(date);
        if (d.toString() === 'Invalid Date') {
            return "Invalid Date";
        }
        date = d;
    }
    var x = {
        'y{1,4}': date.getFullYear(), // year
        'M{1,2}': date.getMonth() + 1, // month
        'd{1,2}': date.getDate(), // day
        'h{1,2}': date.getHours(), // hour
        'm{1,2}': date.getMinutes(), // minute
        's{1,2}': date.getSeconds(), // second
        'q{1}': Math.floor((date.getMonth() + 3) / 3), // quarter
        'S{1,3}': date.getMilliseconds() // millisecond
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
class Module {
    static stringToDate (string) {
        if (!string) {
            return new Date();
        }
        return new Date(string);
    }
    static dateToString (data) {
        return dateToString(data, "yyyy-MM-dd hh:mm:ss");
    }

    static getYear (date) {
        return date.getFullYear();
    }
    static getMonth (date) {
        return date.getMonth()+1;
    }

    static dateToTimestamp() {
        return date.valueOf();
    }

    static timestampToDate(timestamp) {
        return new Date(timestamp)
    }

    static mDateToString(mdvIn) {
        return Common.syncProcess(mdvIn, ["in", "format"], function (date, format) {
            return dateToString(date, format);
        });
    }

    static mStringToDate(mdvIn) {
        return Common.syncProcess(mdvIn, ["in"], pStringToDate);
    }
}
module.exports = Module;