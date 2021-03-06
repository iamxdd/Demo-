Date.prototype.format = function(pattern) {
    function zeroize(num) {
        return num < 10 ? "0" + num : num;
    };
    var pattern = pattern; //    YYYY-MM-DD 或 MM-DD-YYYY 或 YYYY-MM-DD , hh : mm : ss
    var dateObj = {
        "Y": this.getFullYear(),
        "M": zeroize(this.getMonth() + 1),
        "D": zeroize(this.getDate()),
        "h": zeroize(this.getHours()),
        "m": zeroize(this.getMinutes()),
        "s": zeroize(this.getSeconds())
    };
    return pattern.replace(/YYYY|MM|DD|hh|mm|ss/g, function(match) {
        switch (match) {
            case "YYYY":
                return dateObj.Y;
            case "MM":
                return dateObj.M;
            case "DD":
                return dateObj.D;
            case "hh":
                return dateObj.h;
            case "mm":
                return dateObj.m;
            case "ss":
                return dateObj.s;
        };
    });
};
Date.prototype.past = function(pattern, pastDays) {
    function zeroize(num) {
        return num < 10 ? "0" + num : num;
    };
    var pastday = new Date((this - 0) - 1000 * 60 * 60 * 24 * pastDays);
    var pattern = pattern; //    YYYY-MM-DD 或 MM-DD-YYYY 或 YYYY-MM-DD , hh : mm : ss
    var dateObj = {
        "Y": pastday.getFullYear(),
        "M": zeroize(pastday.getMonth() + 1),
        "D": zeroize(pastday.getDate()),
        "h": zeroize(pastday.getHours()),
        "m": zeroize(pastday.getMinutes()),
        "s": zeroize(pastday.getSeconds())
    };
    return pattern.replace(/YYYY|MM|DD|hh|mm|ss/g, function(match) {
        switch (match) {
            case "YYYY":
                return dateObj.Y;
            case "MM":
                return dateObj.M;
            case "DD":
                return dateObj.D;
            case "hh":
                return dateObj.h;
            case "mm":
                return dateObj.m;
            case "ss":
                return dateObj.s;
        };
    });
};
Date.prototype.yestoday = function(pattern) {
    return this.past(pattern, 1);
};
Date.prototype.tomorrow = function(pattern) {
    return this.past(pattern, -1);
};
Date.prototype.getMonthDays = function() { //Date()方法中日期必须传入32号
    return 32 - parseInt(this.format("DD"));
};
Date.prototype.getWeekIndex = function() {
    var weekList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var weekID = this.toUTCString().split(",")[0];
    return weekList.indexOf(weekID)==0?7:weekList.indexOf(weekID);
}

export default Date;