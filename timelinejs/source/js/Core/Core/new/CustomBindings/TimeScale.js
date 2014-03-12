(function() {
  define(["jquery", "knockout", "VMM.Date", "VMM.Browser", "type", "linq"], function($, ko, vDate, browser, type) {
    var calcTimeScale, calculateInterval, createIntervalElements, dateFractionBrowser, getDateFractions, interval, interval_macro, interval_major, positionRelative, timelookup;

    ko.virtualElements.allowedBindings.makeTimescale = true;
    ko.virtualElements.allowedBindings.timescale = true;
    ko.bindingHandlers.makeTimescale = {
      init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var innerBindingContext, timescale;

        timescale = {
          major: ko.observableArray(),
          interval: ko.observableArray()
        };
        innerBindingContext = bindingContext.extend(function() {
          return {
            $timescale: timescale
          };
        });
        ko.applyBindingsToDescendants(innerBindingContext, element);
        return {
          controlsDescendantBindings: true
        };
      }
    };
    ko.bindingHandlers.timescale = {
      init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return calcTimeScale(valueAccessor, bindingContext);
      },
      update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return calcTimeScale(valueAccessor, bindingContext);
      }
    };
    calcTimeScale = function(valueAccessor, bindingContext) {
      var configuration, count, density, i, interval, intervalCalc, interval_macro, interval_major, intervals, j, majorIntervals, maxD, maxDate, maxPos, minD, minDate, minPos, mod, navConfiguration, timespan, zoom, zoomedDifference;

      count = ko.unwrap(valueAccessor().dates).length;
      zoom = ko.unwrap(valueAccessor().zoom);
      configuration = ko.unwrap(valueAccessor().configuration);
      navConfiguration = ko.unwrap(configuration.nav);
      minDate = $.Enumerable.From(ko.unwrap(valueAccessor().dates)).Min(function(d) {
        return ko.unwrap(d.startDate);
      });
      maxDate = $.Enumerable.From(ko.unwrap(valueAccessor().dates)).Max(function(d) {
        return ko.unwrap(d.endDate);
      });
      minD = minDate.getTime() / 1000;
      maxD = maxDate.getTime() / 1000;
      zoomedDifference = (maxD - minD) / zoom;
      maxDate = new Date(1970, 0, 1);
      maxDate.setSeconds(minD + zoomedDifference);
      timespan = getDateFractions(maxDate - minDate, true);
      intervalCalc = calculateInterval(timespan, minDate, maxDate, 1);
      density = ko.unwrap(navConfiguration.density);
      if (timespan.centuries > count / density) {
        interval = intervalCalc.century;
        interval_major = intervalCalc.millenium;
        interval_macro = intervalCalc.decade;
      } else if (timespan.decades > count / density) {
        interval = intervalCalc.decade;
        interval_major = intervalCalc.century;
        interval_macro = intervalCalc.year;
      } else if (timespan.years > count / density) {
        interval = intervalCalc.year;
        interval_major = intervalCalc.decade;
        interval_macro = intervalCalc.month;
      } else if (timespan.months > count / density) {
        interval = intervalCalc.month;
        interval_major = intervalCalc.year;
        interval_macro = intervalCalc.day;
      } else if (timespan.days > count / density) {
        interval = intervalCalc.day;
        interval_major = intervalCalc.month;
        interval_macro = intervalCalc.hour;
      } else if (timespan.hours > count / density) {
        interval = intervalCalc.hour;
        interval_major = intervalCalc.day;
        interval_macro = intervalCalc.minute;
      } else if (timespan.minutes > count / density) {
        interval = intervalCalc.minute;
        interval_major = intervalCalc.hour;
        interval_macro = intervalCalc.second;
      } else if (timespan.seconds > count / density) {
        interval = intervalCalc.second;
        interval_major = intervalCalc.minute;
        interval_macro = intervalCalc.second;
      } else {
        interval = intervalCalc.day;
        interval_major = intervalCalc.month;
        interval_macro = intervalCalc.hour;
      }
      intervals = createIntervalElements(interval, minDate);
      majorIntervals = createIntervalElements(interval_major, minDate);
      if (false) {
        i = 0;
        while (i < interval_array.length) {
          j = 0;
          while (j < interval_major_array.length) {
            if (interval_array[i].date_string === interval_major_array[j].date_string) {
              library.attachElement(interval_array[i].element, "");
            }
            j++;
          }
          i++;
        }
      }
      minPos = $.Enumerable.From(intervals).Min(function(i) {
        return i.relative_pos.start;
      });
      maxPos = $.Enumerable.From(intervals).Max(function(i) {
        return i.relative_pos.start;
      });
      bindingContext.$timescale.major($.Enumerable.From(majorIntervals).Select(function(i) {
        return {
          left: function() {
            var ret;

            ret = ((i.relative_pos.start - minPos) / (maxPos - minPos)) * ko.unwrap(configuration.width);
            return ret;
          },
          indent: function() {
            return 0;
          },
          text: ko.observable(i.date_string)
        };
      }).ToArray());
      mod = Math.ceil(intervals.length / 10.);
      return bindingContext.$timescale.interval($.Enumerable.From(intervals).Where(function(i) {
        return !$.Enumerable.From(majorIntervals).Any(function(ii) {
          return ii.relative_pos.start === i.relative_pos.start;
        });
      }).Where(function(i) {
        return i.ordinal % mod === 0;
      }).Select(function(i) {
        return {
          left: function() {
            var ret;

            ret = ((i.relative_pos.start - minPos) / (maxPos - minPos)) * ko.unwrap(configuration.width);
            return ret;
          },
          indent: function() {
            return 0;
          },
          text: ko.observable(i.date_string)
        };
      }).ToArray());
    };
    timelookup = {
      day: 24,
      month: 12,
      year: 10,
      hour: 60,
      minute: 60,
      second: 1000,
      decade: 10,
      century: 100,
      millennium: 1000,
      age: 1000000,
      epoch: 10000000,
      era: 100000000,
      eon: 500000000,
      week: 4.34812141,
      days_in_month: 30.4368499,
      days_in_week: 7,
      weeks_in_month: 4.34812141,
      weeks_in_year: 52.177457,
      days_in_year: 365.242199,
      hours_in_day: 24
    };
    dateFractionBrowser = {
      day: 86400000,
      week: 7,
      month: 30.4166666667,
      year: 12,
      hour: 24,
      minute: 1440,
      second: 86400,
      decade: 10,
      century: 100,
      millennium: 1000,
      age: 1000000,
      epoch: 10000000,
      era: 100000000,
      eon: 500000000
    };
    interval = {
      type: "year",
      number: 10,
      first: 1970,
      last: 2011,
      multiplier: 100,
      classname: "_idd",
      interval_type: "interval"
    };
    interval_major = {
      type: "year",
      number: 10,
      first: 1970,
      last: 2011,
      multiplier: 100,
      classname: "major",
      interval_type: "interval major"
    };
    interval_macro = {
      type: "year",
      number: 10,
      first: 1970,
      last: 2011,
      multiplier: 100,
      classname: "_dd_minor",
      interval_type: "interval minor"
    };
    calculateInterval = function(timespan, min, max) {
      var intervalCalc, _first, _last;

      _first = getDateFractions(min);
      _last = getDateFractions(max);
      return intervalCalc = {
        eon: {
          type: "eon",
          first: _first.eons,
          base: Math.floor(_first.eons),
          last: _last.eons,
          number: timespan.eons,
          multiplier: timelookup.eons,
          minor: timelookup.eons
        },
        era: {
          type: "era",
          first: _first.eras,
          base: Math.floor(_first.eras),
          last: _last.eras,
          number: timespan.eras,
          multiplier: timelookup.eras,
          minor: timelookup.eras
        },
        epoch: {
          type: "epoch",
          first: _first.epochs,
          base: Math.floor(_first.epochs),
          last: _last.epochs,
          number: timespan.epochs,
          multiplier: timelookup.epochs,
          minor: timelookup.epochs
        },
        age: {
          type: "age",
          first: _first.ages,
          base: Math.floor(_first.ages),
          last: _last.ages,
          number: timespan.ages,
          multiplier: timelookup.ages,
          minor: timelookup.ages
        },
        millennium: {
          type: "millennium",
          first: _first.millennia,
          base: Math.floor(_first.millennia),
          last: _last.millennia,
          number: timespan.millennia,
          multiplier: timelookup.millennium,
          minor: timelookup.millennium
        },
        century: {
          type: "century",
          first: _first.centuries,
          base: Math.floor(_first.centuries),
          last: _last.centuries,
          number: timespan.centuries,
          multiplier: timelookup.century,
          minor: timelookup.century
        },
        decade: {
          type: "decade",
          first: _first.decades,
          base: Math.floor(_first.decades),
          last: _last.decades,
          number: timespan.decades,
          multiplier: timelookup.decade,
          minor: timelookup.decade
        },
        year: {
          type: "year",
          first: _first.years,
          base: Math.floor(_first.years),
          last: _last.years,
          number: timespan.years,
          multiplier: 1,
          minor: timelookup.month
        },
        month: {
          type: "month",
          first: _first.months,
          base: Math.floor(_first.months),
          last: _last.months,
          number: timespan.months,
          multiplier: 1,
          minor: Math.round(timelookup.week)
        },
        week: {
          type: "week",
          first: _first.weeks,
          base: Math.floor(_first.weeks),
          last: _last.weeks,
          number: timespan.weeks,
          multiplier: 1,
          minor: 7
        },
        day: {
          type: "day",
          first: _first.days,
          base: Math.floor(_first.days),
          last: _last.days,
          number: timespan.days,
          multiplier: 1,
          minor: 24
        },
        hour: {
          type: "hour",
          first: _first.hours,
          base: Math.floor(_first.hours),
          last: _last.hours,
          number: timespan.hours,
          multiplier: 1,
          minor: 60
        },
        minute: {
          type: "minute",
          first: _first.minutes,
          base: Math.floor(_first.minutes),
          last: _last.minutes,
          number: timespan.minutes,
          multiplier: 1,
          minor: 60
        },
        second: {
          type: "second",
          first: _first.seconds,
          base: Math.floor(_first.seconds),
          last: _last.seconds,
          number: timespan.seconds,
          multiplier: 1,
          minor: 10
        }
      };
    };
    getDateFractions = function(the_date, is_utc) {
      var _time;

      _time = {};
      _time.days = the_date / dateFractionBrowser.day;
      _time.weeks = _time.days / dateFractionBrowser.week;
      _time.months = _time.days / dateFractionBrowser.month;
      _time.years = _time.months / dateFractionBrowser.year;
      _time.hours = _time.days * dateFractionBrowser.hour;
      _time.minutes = _time.days * dateFractionBrowser.minute;
      _time.seconds = _time.days * dateFractionBrowser.second;
      _time.decades = _time.years / dateFractionBrowser.decade;
      _time.centuries = _time.years / dateFractionBrowser.century;
      _time.millennia = _time.years / dateFractionBrowser.millennium;
      _time.ages = _time.years / dateFractionBrowser.age;
      _time.epochs = _time.years / dateFractionBrowser.epoch;
      _time.eras = _time.years / dateFractionBrowser.era;
      _time.eons = _time.years / dateFractionBrowser.eon;
      return _time;
    };
    createIntervalElements = function(_interval, minDate) {
      var array, firefox, i, inc_time, int_number, int_obj, _first_date, _is_year, _largest_pos, _last_date, _last_pos, _timezone_offset;

      array = [];
      inc_time = 0;
      _last_pos = 0;
      _largest_pos = 0;
      _timezone_offset = void 0;
      _first_date = void 0;
      _last_date = void 0;
      int_number = Math.ceil(_interval.number) + 2;
      firefox = {
        flag: false,
        offset: 0
      };
      i = 0;
      _interval.date = new Date(minDate.getFullYear(), 0, 1, 0, 0, 0);
      _timezone_offset = _interval.date.getTimezoneOffset();
      i = 0;
      if (_interval.type === "eon") {
        _first_date = Math.floor(minDate.getFullYear() / 500000000) * 500000000;
        _is_year = true;
      } else if (_interval.type === "era") {
        _first_date = Math.floor(minDate.getFullYear() / 100000000) * 100000000;
        _is_year = true;
      } else if (_interval.type === "epoch") {
        _first_date = Math.floor(minDate.getFullYear() / 10000000) * 10000000;
        _is_year = true;
      } else if (_interval.type === "age") {
        _first_date = Math.floor(minDate.getFullYear() / 1000000) * 1000000;
        _is_year = true;
      } else if (_interval.type === "millenium") {
        _first_date = Math.floor(minDate.getFullYear() / 1000) * 1000;
        _is_year = true;
      } else if (_interval.type === "century") {
        _first_date = Math.floor(minDate.getFullYear() / 100) * 100;
        _is_year = true;
      } else if (_interval.type === "decade") {
        _first_date = Math.floor(minDate.getFullYear() / 10) * 10;
        _is_year = true;
      } else if (_interval.type === "year") {
        _first_date = minDate.getFullYear();
        _is_year = true;
      } else if (_interval.type === "month") {
        _first_date = minDate.getMonth();
      } else if (_interval.type === "week") {
        _first_date = minDate.getMonth();
      } else if (_interval.type === "day") {
        _first_date = minDate.getDate();
      } else if (_interval.type === "hour") {
        _first_date = minDate.getHours();
      } else if (_interval.type === "minute") {
        _first_date = minDate.getMinutes();
      } else if (_interval.type === "second") {
        _first_date = minDate.getSeconds();
      } else if (_interval.type === "millisecond") {
        _first_date = minDate.getMilliseconds();
      }
      while (i < int_number) {
        _is_year = false;
        int_obj = {
          date: new Date(minDate.getFullYear(), 0, 1, 0, 0, 0),
          visible: false,
          date_string: "",
          type: _interval.interval_type,
          relative_pos: 0,
          is_detached: false,
          animation: {
            animate: false,
            pos: "",
            opacity: "100"
          }
        };
        if (_interval.type === "eon") {
          int_obj.date.setFullYear(_first_date + (inc_time * 500000000));
        } else if (_interval.type === "era") {
          int_obj.date.setFullYear(_first_date + (inc_time * 100000000));
        } else if (_interval.type === "epoch") {
          int_obj.date.setFullYear(_first_date + (inc_time * 10000000));
        } else if (_interval.type === "age") {
          int_obj.date.setFullYear(_first_date + (inc_time * 1000000));
        } else if (_interval.type === "millenium") {
          int_obj.date.setFullYear(_first_date + (inc_time * 1000));
        } else if (_interval.type === "century") {
          int_obj.date.setFullYear(_first_date + (inc_time * 100));
        } else if (_interval.type === "decade") {
          int_obj.date.setFullYear(_first_date + (inc_time * 10));
        } else if (_interval.type === "year") {
          int_obj.date.setFullYear(_first_date + inc_time);
        } else if (_interval.type === "month") {
          int_obj.date.setMonth(_first_date + inc_time);
        } else if (_interval.type === "week") {
          int_obj.date.setMonth(minDate.getMonth());
          int_obj.date.setDate(_first_date + (inc_time * 7));
        } else if (_interval.type === "day") {
          int_obj.date.setMonth(minDate.getMonth());
          int_obj.date.setDate(_first_date + inc_time);
        } else if (_interval.type === "hour") {
          int_obj.date.setMonth(minDate.getMonth());
          int_obj.date.setDate(minDate.getDate());
          int_obj.date.setHours(_first_date + inc_time);
        } else if (_interval.type === "minute") {
          int_obj.date.setMonth(minDate.getMonth());
          int_obj.date.setDate(minDate.getDate());
          int_obj.date.setHours(minDate.getHours());
          int_obj.date.setMinutes(_first_date + inc_time);
        } else if (_interval.type === "second") {
          int_obj.date.setMonth(minDate.getMonth());
          int_obj.date.setDate(minDate.getDate());
          int_obj.date.setHours(minDate.getHours());
          int_obj.date.setMinutes(minDate.getMinutes());
          int_obj.date.setSeconds(_first_date + inc_time);
        } else if (_interval.type === "millisecond") {
          int_obj.date.setMonth(minDate.getMonth());
          int_obj.date.setDate(minDate.getDate());
          int_obj.date.setHours(minDate.getHours());
          int_obj.date.setMinutes(minDate.getMinutes());
          int_obj.date.setSeconds(minDate.getSeconds());
          int_obj.date.setMilliseconds(_first_date + inc_time);
        }
        if (browser.browser === "Firefox") {
          if (int_obj.date.getFullYear() === "1970" && int_obj.date.getTimezoneOffset() !== _timezone_offset) {
            firefox.offset = int_obj.date.getTimezoneOffset() / 60;
            firefox.flag = true;
            int_obj.date.setHours(int_obj.date.getHours() + firefox.offset);
          } else if (firefox.flag) {
            firefox.flag = false;
            int_obj.date.setHours(int_obj.date.getHours() + firefox.offset);
            if (_is_year) {
              firefox.flag = true;
            }
          }
        }
        if (_is_year) {
          if (int_obj.date.getFullYear() < 0) {
            int_obj.date_string = Math.abs(int_obj.date.getFullYear()).toString() + " B.C.";
          } else {
            int_obj.date_string = int_obj.date.getFullYear();
          }
        } else {
          int_obj.date_string = vDate.prettyDate(int_obj.date, true);
        }
        int_obj.ordinal = i;
        inc_time = inc_time + 1;
        int_obj.relative_pos = positionRelative(interval, int_obj.date);
        _last_pos = int_obj.relative_pos.begin;
        if (int_obj.relative_pos.begin > _largest_pos) {
          _largest_pos = int_obj.relative_pos.begin;
        }
        array.push(int_obj);
        i++;
      }
      return array;
    };
    return positionRelative = function(_interval, first, last) {
      var timerelative, _first, _last, _type;

      _first = void 0;
      _last = void 0;
      _type = _interval.type;
      timerelative = {
        start: "",
        end: "",
        type: _type
      };
      _first = getDateFractions(first);
      timerelative.start = first.months;
      if (_type === "eon") {
        timerelative.start = _first.eons;
      } else if (_type === "era") {
        timerelative.start = _first.eras;
      } else if (_type === "epoch") {
        timerelative.start = _first.epochs;
      } else if (_type === "age") {
        timerelative.start = _first.ages;
      } else if (_type === "millenium") {
        timerelative.start = first.milleniums;
      } else if (_type === "century") {
        timerelative.start = _first.centuries;
      } else if (_type === "decade") {
        timerelative.start = _first.decades;
      } else if (_type === "year") {
        timerelative.start = _first.years;
      } else if (_type === "month") {
        timerelative.start = _first.months;
      } else if (_type === "week") {
        timerelative.start = _first.weeks;
      } else if (_type === "day") {
        timerelative.start = _first.days;
      } else if (_type === "hour") {
        timerelative.start = _first.hours;
      } else {
        if (_type === "minute") {
          timerelative.start = _first.minutes;
        }
      }
      if (type.of(last) === "date") {
        _last = getDateFractions(last);
        timerelative.end = last.months;
        if (_type === "eon") {
          timerelative.end = _last.eons;
        } else if (_type === "era") {
          timerelative.end = _last.eras;
        } else if (_type === "epoch") {
          timerelative.end = _last.epochs;
        } else if (_type === "age") {
          timerelative.end = _last.ages;
        } else if (_type === "millenium") {
          timerelative.end = last.milleniums;
        } else if (_type === "century") {
          timerelative.end = _last.centuries;
        } else if (_type === "decade") {
          timerelative.end = _last.decades;
        } else if (_type === "year") {
          timerelative.end = _last.years;
        } else if (_type === "month") {
          timerelative.end = _last.months;
        } else if (_type === "week") {
          timerelative.end = _last.weeks;
        } else if (_type === "day") {
          timerelative.end = _last.days;
        } else if (_type === "hour") {
          timerelative.end = _last.hours;
        } else {
          if (_type === "minute") {
            timerelative.end = _last.minutes;
          }
        }
      } else {
        timerelative.end = timerelative.start;
      }
      return timerelative;
    };
  });

}).call(this);
