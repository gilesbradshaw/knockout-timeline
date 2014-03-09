(function() {
  define(["trace", "type"], function(trace, type) {
    var dateFormat, vDate;

    dateFormat = (function() {
      var pad, timezone, timezoneClip, token;

      token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;
      timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
      timezoneClip = /[^-+\dA-Z]/g;
      pad = function(val, len) {
        val = String(val);
        len = len || 2;
        while (val.length < len) {
          val = "0" + val;
        }
        return val;
      };
      return function(date, mask, utc) {
        var D, H, L, M, d, dF, flags, m, o, s, y, _;

        dF = dateFormat;
        if (arguments.length === 1 && Object.prototype.toString.call(date) === "[object String]" && !/\d/.test(date)) {
          mask = date;
          date = undefined;
        }
        if (isNaN(date)) {
          trace("invalid date " + date);
        }
        mask = String(dF.masks[mask] || mask || dF.masks["default"]);
        if (mask.slice(0, 4) === "UTC:") {
          mask = mask.slice(4);
          utc = true;
        }
        _ = (utc ? "getUTC" : "get");
        d = date[_ + "Date"]();
        D = date[_ + "Day"]();
        m = date[_ + "Month"]();
        y = date[_ + "FullYear"]();
        H = date[_ + "Hours"]();
        M = date[_ + "Minutes"]();
        s = date[_ + "Seconds"]();
        L = date[_ + "Milliseconds"]();
        o = (utc ? 0 : date.getTimezoneOffset());
        flags = {
          d: d,
          dd: pad(d),
          ddd: dF.i18n.dayNames[D],
          dddd: dF.i18n.dayNames[D + 7],
          m: m + 1,
          mm: pad(m + 1),
          mmm: dF.i18n.monthNames[m],
          mmmm: dF.i18n.monthNames[m + 12],
          yy: String(y).slice(2),
          yyyy: y,
          h: H % 12 || 12,
          hh: pad(H % 12 || 12),
          H: H,
          HH: pad(H),
          M: M,
          MM: pad(M),
          s: s,
          ss: pad(s),
          l: pad(L, 3),
          L: pad((L > 99 ? Math.round(L / 10) : L)),
          t: (H < 12 ? "a" : "p"),
          tt: (H < 12 ? "am" : "pm"),
          T: (H < 12 ? "A" : "P"),
          TT: (H < 12 ? "AM" : "PM"),
          Z: (utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, "")),
          o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
          S: ["th", "st", "nd", "rd"][(d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10)]
        };
        return mask.replace(token, function($0) {
          if ($0 in flags) {
            return flags[$0];
          } else {
            return $0.slice(1, $0.length - 1);
          }
        });
      };
    })();
    dateFormat.masks = {
      "default": "ddd mmm dd yyyy HH:MM:ss",
      shortDate: "m/d/yy",
      mediumDate: "mmm d, yyyy",
      longDate: "mmmm d, yyyy",
      fullDate: "dddd, mmmm d, yyyy",
      shortTime: "h:MM TT",
      mediumTime: "h:MM:ss TT",
      longTime: "h:MM:ss TT Z",
      isoDate: "yyyy-mm-dd",
      isoTime: "HH:MM:ss",
      isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
      isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };
    dateFormat.i18n = {
      dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    };
    Date.prototype.format = function(mask, utc) {
      return dateFormat(this, mask, utc);
    };
    return vDate = {
      init: function() {
        return this;
      },
      dateformats: {
        year: "yyyy",
        month_short: "mmm",
        month: "mmmm yyyy",
        full_short: "mmm d",
        full: "mmmm d',' yyyy",
        time_short: "h:MM:ss TT",
        time_no_seconds_short: "h:MM TT",
        time_no_seconds_small_date: "h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",
        full_long: "mmm d',' yyyy 'at' hh:MM TT",
        full_long_small_date: "hh:MM TT'<br/><small>mmm d',' yyyy'</small>'"
      },
      month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      month_abbr: ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."],
      day: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      day_abbr: ["Sun.", "Mon.", "Tues.", "Wed.", "Thurs.", "Fri.", "Sat."],
      hour: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      hour_suffix: ["am"],
      bc_format: {
        year: "yyyy",
        month_short: "mmm",
        month: "mmmm yyyy",
        full_short: "mmm d",
        full: "mmmm d',' yyyy",
        time_no_seconds_short: "h:MM TT",
        time_no_seconds_small_date: "dddd', 'h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",
        full_long: "dddd',' mmm d',' yyyy 'at' hh:MM TT",
        full_long_small_date: "hh:MM TT'<br/><small>'dddd',' mmm d',' yyyy'</small>'"
      },
      setLanguage: function(lang) {
        trace("SET DATE LANGUAGE");
        vDate.dateformats = lang.dateformats;
        vDate.month = lang.date.month;
        vDate.month_abbr = lang.date.month_abbr;
        vDate.day = lang.date.day;
        vDate.day_abbr = lang.date.day_abbr;
        dateFormat.i18n.dayNames = lang.date.day_abbr.concat(lang.date.day);
        dateFormat.i18n.monthNames = lang.date.month_abbr.concat(lang.date.month);
      },
      parse: function(d, precision) {
        "use strict";
        var date, date_array, i, now, p, time_array, time_parse;

        date = void 0;
        date_array = void 0;
        time_array = void 0;
        time_parse = void 0;
        p = {
          year: false,
          month: false,
          day: false,
          hour: false,
          minute: false,
          second: false,
          millisecond: false
        };
        if (type.of(d) === "date") {
          trace("DEBUG THIS, ITs A DATE");
          date = d;
        } else {
          date = new Date(0, 0, 1, 0, 0, 0, 0);
          if (d.match(/,/g)) {
            date_array = d.split(",");
            i = 0;
            while (i < date_array.length) {
              date_array[i] = parseInt(date_array[i], 10);
              i++;
            }
            if (date_array[0]) {
              date.setFullYear(date_array[0]);
              p.year = true;
            }
            if (date_array[1]) {
              date.setMonth(date_array[1] - 1);
              p.month = true;
            }
            if (date_array[2]) {
              date.setDate(date_array[2]);
              p.day = true;
            }
            if (date_array[3]) {
              date.setHours(date_array[3]);
              p.hour = true;
            }
            if (date_array[4]) {
              date.setMinutes(date_array[4]);
              p.minute = true;
            }
            if (date_array[5]) {
              date.setSeconds(date_array[5]);
              if (date_array[5] >= 1) {
                p.second = true;
              }
            }
            if (date_array[6]) {
              date.setMilliseconds(date_array[6]);
              if (date_array[6] >= 1) {
                p.millisecond = true;
              }
            }
          } else if (d.match("/")) {
            if (d.match(" ")) {
              time_parse = d.split(" ");
              if (d.match(":")) {
                time_array = time_parse[1].split(":");
                if (time_array[0] >= 0) {
                  date.setHours(time_array[0]);
                  p.hour = true;
                }
                if (time_array[1] >= 0) {
                  date.setMinutes(time_array[1]);
                  p.minute = true;
                }
                if (time_array[2] >= 0) {
                  date.setSeconds(time_array[2]);
                  p.second = true;
                }
                if (time_array[3] >= 0) {
                  date.setMilliseconds(time_array[3]);
                  p.millisecond = true;
                }
              }
              date_array = time_parse[0].split("/");
            } else {
              date_array = d.split("/");
            }
            if (date_array[2]) {
              date.setFullYear(date_array[2]);
              p.year = true;
            }
            if (date_array[0] >= 0) {
              date.setMonth(date_array[0] - 1);
              p.month = true;
            }
            if (date_array[1] >= 0) {
              if (date_array[1].length > 2) {
                date.setFullYear(date_array[1]);
                p.year = true;
              } else {
                date.setDate(date_array[1]);
                p.day = true;
              }
            }
          } else if (d.match("now")) {
            now = new Date();
            date.setFullYear(now.getFullYear());
            p.year = true;
            date.setMonth(now.getMonth());
            p.month = true;
            date.setDate(now.getDate());
            p.day = true;
            if (d.match("hours")) {
              date.setHours(now.getHours());
              p.hour = true;
            }
            if (d.match("minutes")) {
              date.setHours(now.getHours());
              date.setMinutes(now.getMinutes());
              p.hour = true;
              p.minute = true;
            }
            if (d.match("seconds")) {
              date.setHours(now.getHours());
              date.setMinutes(now.getMinutes());
              date.setSeconds(now.getSeconds());
              p.hour = true;
              p.minute = true;
              p.second = true;
            }
            if (d.match("milliseconds")) {
              date.setHours(now.getHours());
              date.setMinutes(now.getMinutes());
              date.setSeconds(now.getSeconds());
              date.setMilliseconds(now.getMilliseconds());
              p.hour = true;
              p.minute = true;
              p.second = true;
              p.millisecond = true;
            }
          } else if (d.length <= 8) {
            p.year = true;
            date.setFullYear(parseInt(d, 10));
            date.setMonth(0);
            date.setDate(1);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
          } else if (d.match("T")) {
            if (navigator.userAgent.match(/MSIE\s(?!9.0)/)) {
              time_parse = d.split("T");
              if (d.match(":")) {
                time_array = time_parse[1].split(":");
                if (time_array[0] >= 1) {
                  date.setHours(time_array[0]);
                  p.hour = true;
                }
                if (time_array[1] >= 1) {
                  date.setMinutes(time_array[1]);
                  p.minute = true;
                }
                if (time_array[2] >= 1) {
                  date.setSeconds(time_array[2]);
                  if (time_array[2] >= 1) {
                    p.second = true;
                  }
                }
                if (time_array[3] >= 1) {
                  date.setMilliseconds(time_array[3]);
                  if (time_array[3] >= 1) {
                    p.millisecond = true;
                  }
                }
              }
              date_array = time_parse[0].split("-");
              if (date_array[0]) {
                date.setFullYear(date_array[0]);
                p.year = true;
              }
              if (date_array[1] >= 0) {
                date.setMonth(date_array[1] - 1);
                p.month = true;
              }
              if (date_array[2] >= 0) {
                date.setDate(date_array[2]);
                p.day = true;
              }
            } else {
              date = new Date(Date.parse(d));
              p.year = true;
              p.month = true;
              p.day = true;
              p.hour = true;
              p.minute = true;
              if (date.getSeconds() >= 1) {
                p.second = true;
              }
              if (date.getMilliseconds() >= 1) {
                p.millisecond = true;
              }
            }
          } else {
            date = new Date(parseInt(d.slice(0, 4), 10), parseInt(d.slice(4, 6), 10) - 1, parseInt(d.slice(6, 8), 10), parseInt(d.slice(8, 10), 10), parseInt(d.slice(10, 12), 10));
            p.year = true;
            p.month = true;
            p.day = true;
            p.hour = true;
            p.minute = true;
            if (date.getSeconds() >= 1) {
              p.second = true;
            }
            if (date.getMilliseconds() >= 1) {
              p.millisecond = true;
            }
          }
        }
        if ((precision != null) && precision !== "") {
          return {
            date: date,
            precision: p
          };
        } else {
          return date;
        }
      },
      prettyDate: function(d, is_abbr, p, d2) {
        var bc_check, bc_number, bc_original, bc_string, format, i, is_pair, j, _date, _date2;

        _date = void 0;
        _date2 = void 0;
        format = void 0;
        bc_check = void 0;
        is_pair = false;
        bc_original = void 0;
        bc_number = void 0;
        bc_string = void 0;
        if ((d2 != null) && d2 !== "" && typeof d2 !== "undefined") {
          is_pair = true;
          trace("D2 " + d2);
        }
        if (type.of(d) === "date") {
          if (type.of(p) === "object") {
            if (p.millisecond || p.second && d.getSeconds() >= 1) {
              if (is_abbr) {
                format = vDate.dateformats.time_short;
              } else {
                format = vDate.dateformats.time_short;
              }
            } else if (p.minute) {
              if (is_abbr) {
                format = vDate.dateformats.time_no_seconds_short;
              } else {
                format = vDate.dateformats.time_no_seconds_small_date;
              }
            } else if (p.hour) {
              if (is_abbr) {
                format = vDate.dateformats.time_no_seconds_short;
              } else {
                format = vDate.dateformats.time_no_seconds_small_date;
              }
            } else if (p.day) {
              if (is_abbr) {
                format = vDate.dateformats.full_short;
              } else {
                format = vDate.dateformats.full;
              }
            } else if (p.month) {
              if (is_abbr) {
                format = vDate.dateformats.month_short;
              } else {
                format = vDate.dateformats.month;
              }
            } else if (p.year) {
              format = vDate.dateformats.year;
            } else {
              format = vDate.dateformats.year;
            }
          } else {
            if (d.getMonth() === 0 && d.getDate() === 1 && d.getHours() === 0 && d.getMinutes() === 0) {
              format = vDate.dateformats.year;
            } else if (d.getDate() <= 1 && d.getHours() === 0 && d.getMinutes() === 0) {
              if (is_abbr) {
                format = vDate.dateformats.month_short;
              } else {
                format = vDate.dateformats.month;
              }
            } else if (d.getHours() === 0 && d.getMinutes() === 0) {
              if (is_abbr) {
                format = vDate.dateformats.full_short;
              } else {
                format = vDate.dateformats.full;
              }
            } else if (d.getMinutes() === 0) {
              if (is_abbr) {
                format = vDate.dateformats.time_no_seconds_short;
              } else {
                format = vDate.dateformats.time_no_seconds_small_date;
              }
            } else {
              if (is_abbr) {
                format = vDate.dateformats.time_no_seconds_short;
              } else {
                format = vDate.dateformats.full_long;
              }
            }
          }
          _date = dateFormat(d, format, false);
          bc_check = _date.split(" ");
          i = 0;
          while (i < bc_check.length) {
            if (parseInt(bc_check[i], 10) < 0) {
              trace("YEAR IS BC");
              bc_original = bc_check[i];
              bc_number = Math.abs(parseInt(bc_check[i], 10));
              bc_string = bc_number.toString() + " B.C.";
              _date = _date.replace(bc_original, bc_string);
            }
            i++;
          }
          if (is_pair) {
            _date2 = dateFormat(d2, format, false);
            bc_check = _date2.split(" ");
            j = 0;
            while (j < bc_check.length) {
              if (parseInt(bc_check[j], 10) < 0) {
                trace("YEAR IS BC");
                bc_original = bc_check[j];
                bc_number = Math.abs(parseInt(bc_check[j], 10));
                bc_string = bc_number.toString() + " B.C.";
                _date2 = _date2.replace(bc_original, bc_string);
              }
              j++;
            }
          }
        } else {
          trace("NOT A VALID DATE?");
          trace(d);
        }
        if (is_pair) {
          return _date + " &mdash; " + _date2;
        } else {
          return _date;
        }
      }
    }.init();
  });

}).call(this);
