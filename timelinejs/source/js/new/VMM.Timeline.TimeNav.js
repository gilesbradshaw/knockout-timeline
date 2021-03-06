(function() {
  define(["trace", "type", "VMM.Browser", "VMM.Date", "VMM.Library", "VMM.Util", "VMM.masterConfig", "VMM.DragSlider", "VMM.ExternalAPI", "VMM.MediaElement"], function(trace, type, browser, vDate, library, util, masterConfig, DragSlider, ExternalAPI, MediaElement) {
    var timeNav;

    return timeNav = function(parent, content_width, content_height) {
      var $content, $dragslide, $time, $timebackground, $timeinterval, $timeintervalbackground, $timeintervalmajor, $timeintervalminor, $timeintervalminor_minor, $timenav, $timenavindicator, $timenavline, $toolbar, $zoomin, $zoomout, averageDateDistance, averageMarkerPositionDistance, build, buildEras, buildInterval, buildMarkers, calculateInterval, calculateMultiplier, config, content, createIntervalElements, current_marker, data, dateFractionBrowser, era_markers, eras, events, getDateFractions, goToMarker, interval, interval_array, interval_calc, interval_macro, interval_major, interval_major_array, layout, markers, onBackHome, onConfigSet, onMarkerClick, onMarkerHover, onMouseScroll, onTouchUpdate, onZoomIn, onZoomOut, positionEras, positionInterval, positionMarkers, positionOnTimeline, positionRelative, reSize, refreshTimeline, row_height, tags, timelookup, timenav_pos, timeouts, timespan, upDate, _active;

      trace("VMM.Timeline.TimeNav");
      $timenav = void 0;
      $content = void 0;
      $time = void 0;
      $timeintervalminor = void 0;
      $timeinterval = void 0;
      $timeintervalmajor = void 0;
      $timebackground = void 0;
      $timeintervalbackground = void 0;
      $timenavline = void 0;
      $timenavindicator = void 0;
      $timeintervalminor_minor = void 0;
      $toolbar = void 0;
      $zoomin = void 0;
      $zoomout = void 0;
      $dragslide = void 0;
      config = masterConfig.Timeline;
      row_height = void 0;
      events = {};
      timespan = {};
      layout = parent;
      data = [];
      era_markers = [];
      markers = [];
      interval_array = [];
      interval_major_array = [];
      tags = [];
      current_marker = 0;
      _active = false;
      eras = void 0;
      content = void 0;
      timeouts = {
        interval_position: ""
      };
      timenav_pos = {
        left: "",
        visible: {
          left: "",
          right: ""
        }
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
        millenium: 1000,
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
        millenium: 1000,
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
      interval_calc = {
        day: {},
        month: {},
        year: {},
        hour: {},
        minute: {},
        second: {},
        decade: {},
        century: {},
        millenium: {},
        week: {},
        age: {},
        epoch: {},
        era: {},
        eon: {}
      };
      row_height = config.nav.marker.height / 2;
      config.nav.rows = {
        full: [1, row_height * 2, row_height * 4],
        half: [1, row_height, row_height * 2, row_height * 3, row_height * 4, row_height * 5],
        current: []
      };
      if ((content_width != null) && content_width !== "") {
        config.nav.width = content_width;
      }
      if ((content_height != null) && content_height !== "") {
        config.nav.height = content_height;
      }
      onConfigSet = function() {
        trace("onConfigSet");
      };
      reSize = function(firstrun) {
        config.nav.constraint.left = config.width / 2;
        config.nav.constraint.right = config.nav.constraint.right_min - (config.width / 2);
        $dragslide.updateConstraint(config.nav.constraint);
        library.css($timenavline, "left", Math.round(config.width / 2) + 2);
        library.css($timenavindicator, "left", Math.round(config.width / 2) - 8);
        goToMarker(config.current_slide, config.ease, config.duration, true, firstrun);
      };
      upDate = function() {
        library.fireEvent(layout, "UPDATE");
      };
      onZoomIn = function() {
        $dragslide.cancelSlide();
        if (config.nav.multiplier.current > config.nav.multiplier.min) {
          if (config.nav.multiplier.current <= 1) {
            config.nav.multiplier.current = config.nav.multiplier.current - .25;
          } else {
            if (config.nav.multiplier.current > 5) {
              if (config.nav.multiplier.current > 16) {
                config.nav.multiplier.current = Math.round(config.nav.multiplier.current - 10);
              } else {
                config.nav.multiplier.current = Math.round(config.nav.multiplier.current - 4);
              }
            } else {
              config.nav.multiplier.current = Math.round(config.nav.multiplier.current - 1);
            }
          }
          if (config.nav.multiplier.current <= 0) {
            config.nav.multiplier.current = config.nav.multiplier.min;
          }
          refreshTimeline();
        }
      };
      onZoomOut = function() {
        $dragslide.cancelSlide();
        if (config.nav.multiplier.current < config.nav.multiplier.max) {
          if (config.nav.multiplier.current > 4) {
            if (config.nav.multiplier.current > 16) {
              config.nav.multiplier.current = Math.round(config.nav.multiplier.current + 10);
            } else {
              config.nav.multiplier.current = Math.round(config.nav.multiplier.current + 4);
            }
          } else {
            config.nav.multiplier.current = Math.round(config.nav.multiplier.current + 1);
          }
          if (config.nav.multiplier.current >= config.nav.multiplier.max) {
            config.nav.multiplier.current = config.nav.multiplier.max;
          }
          refreshTimeline();
        }
      };
      onBackHome = function(e) {
        $dragslide.cancelSlide();
        goToMarker(0);
        upDate();
      };
      onMouseScroll = function(e) {
        var delta, scroll_to;

        delta = 0;
        scroll_to = 0;
        if (!e) {
          e = window.event;
        }
        if (e.originalEvent) {
          e = e.originalEvent;
        }
        if (typeof e.wheelDeltaX !== "undefined") {
          delta = e.wheelDeltaY / 6;
          if (Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)) {
            delta = e.wheelDeltaX / 6;
          } else {
            delta = 0;
          }
        }
        if (delta) {
          if (e.preventDefault) {
            e.preventDefault();
          }
          e.returnValue = false;
        }
        scroll_to = library.position($timenav).left + delta;
        if (scroll_to > config.nav.constraint.left) {
          scroll_to = config.width / 2;
        } else {
          if (scroll_to < config.nav.constraint.right) {
            scroll_to = config.nav.constraint.right;
          }
        }
        library.css($timenav, "left", scroll_to);
      };
      refreshTimeline = function() {
        trace("config.nav.multiplier " + config.nav.multiplier.current);
        positionMarkers(true);
        positionEras(true);
        positionInterval($timeinterval, interval_array, true, true);
        positionInterval($timeintervalmajor, interval_major_array, true);
        config.nav.constraint.left = config.width / 2;
        config.nav.constraint.right = config.nav.constraint.right_min - (config.width / 2);
        $dragslide.updateConstraint(config.nav.constraint);
      };
      onMarkerClick = function(e) {
        $dragslide.cancelSlide();
        goToMarker(e.data.number);
        upDate();
      };
      onMarkerHover = function(e) {
        library.toggleClass(e.data.elem, "zFront");
      };
      goToMarker = function(n, ease, duration, fast, firstrun) {
        var i, is_first, is_last, _duration, _ease;

        trace("GO TO MARKER");
        _ease = config.ease;
        _duration = config.duration;
        is_last = false;
        is_first = false;
        current_marker = n;
        timenav_pos.left = (config.width / 2) - markers[current_marker].pos_left;
        timenav_pos.visible.left = Math.abs(timenav_pos.left) - 100;
        timenav_pos.visible.right = Math.abs(timenav_pos.left) + config.width + 100;
        if (current_marker === 0) {
          is_first = true;
        }
        if (current_marker + 1 === markers.length) {
          is_last = true;
        }
        if ((ease != null) && ease !== "") {
          _ease = ease;
        }
        if ((duration != null) && duration !== "") {
          _duration = duration;
        }
        i = 0;
        while (i < markers.length) {
          library.removeClass(markers[i].marker, "active");
          i++;
        }
        if (config.start_page && markers[0].type === "start") {
          library.visible(markers[0].marker, false);
          library.addClass(markers[0].marker, "start");
        }
        library.addClass(markers[current_marker].marker, "active");
        library.stop($timenav);
        library.animate($timenav, _duration, _ease, {
          left: timenav_pos.left
        });
      };
      onTouchUpdate = function(e, b) {
        library.animate($timenav, b.time / 2, config.ease, {
          left: b.left
        });
      };
      averageMarkerPositionDistance = function() {
        var dontcrashjs2coffee, i, last_pos, mp_diff, pos, pos_dif, _pos;

        last_pos = 0;
        pos = 0;
        pos_dif = 0;
        mp_diff = [];
        i = 0;
        i = 0;
        while (i < markers.length) {
          if (data[i].type === "start") {
            dontcrashjs2coffee = 0;
          } else {
            _pos = positionOnTimeline(interval, markers[i].relative_pos);
            last_pos = pos;
            pos = _pos.begin;
            pos_dif = pos - last_pos;
            mp_diff.push(pos_dif);
          }
          i++;
        }
        return util.average(mp_diff).mean;
      };
      averageDateDistance = function() {
        var date_dif, date_diffs, dd, i, is_first_date, last_dd, _dd;

        last_dd = 0;
        dd = 0;
        _dd = "";
        date_dif = 0;
        date_diffs = [];
        is_first_date = true;
        i = 0;
        i = 0;
        while (i < data.length) {
          if (data[i].type === "start") {
            trace("DATA DATE IS START");
          } else {
            _dd = data[i].startdate;
            last_dd = dd;
            dd = _dd;
            date_dif = dd - last_dd;
            date_diffs.push(date_dif);
          }
          i++;
        }
        return util.average(date_diffs);
      };
      calculateMultiplier = function() {
        var i, temp_multiplier;

        temp_multiplier = config.nav.multiplier.current;
        i = 0;
        i = 0;
        while (i < temp_multiplier) {
          if (averageMarkerPositionDistance() < 75 ? config.nav.multiplier.current > 1 : void 0) {
            config.nav.multiplier.current = config.nav.multiplier.current - 1;
          }
          i++;
        }
      };
      calculateInterval = function() {
        var _first, _last;

        _first = getDateFractions(data[0].startdate);
        _last = getDateFractions(data[data.length - 1].enddate);
        interval_calc.eon.type = "eon";
        interval_calc.eon.first = _first.eons;
        interval_calc.eon.base = Math.floor(_first.eons);
        interval_calc.eon.last = _last.eons;
        interval_calc.eon.number = timespan.eons;
        interval_calc.eon.multiplier = timelookup.eons;
        interval_calc.eon.minor = timelookup.eons;
        interval_calc.era.type = "era";
        interval_calc.era.first = _first.eras;
        interval_calc.era.base = Math.floor(_first.eras);
        interval_calc.era.last = _last.eras;
        interval_calc.era.number = timespan.eras;
        interval_calc.era.multiplier = timelookup.eras;
        interval_calc.era.minor = timelookup.eras;
        interval_calc.epoch.type = "epoch";
        interval_calc.epoch.first = _first.epochs;
        interval_calc.epoch.base = Math.floor(_first.epochs);
        interval_calc.epoch.last = _last.epochs;
        interval_calc.epoch.number = timespan.epochs;
        interval_calc.epoch.multiplier = timelookup.epochs;
        interval_calc.epoch.minor = timelookup.epochs;
        interval_calc.age.type = "age";
        interval_calc.age.first = _first.ages;
        interval_calc.age.base = Math.floor(_first.ages);
        interval_calc.age.last = _last.ages;
        interval_calc.age.number = timespan.ages;
        interval_calc.age.multiplier = timelookup.ages;
        interval_calc.age.minor = timelookup.ages;
        interval_calc.millenium.type = "millenium";
        interval_calc.millenium.first = _first.milleniums;
        interval_calc.millenium.base = Math.floor(_first.milleniums);
        interval_calc.millenium.last = _last.milleniums;
        interval_calc.millenium.number = timespan.milleniums;
        interval_calc.millenium.multiplier = timelookup.millenium;
        interval_calc.millenium.minor = timelookup.millenium;
        interval_calc.century.type = "century";
        interval_calc.century.first = _first.centuries;
        interval_calc.century.base = Math.floor(_first.centuries);
        interval_calc.century.last = _last.centuries;
        interval_calc.century.number = timespan.centuries;
        interval_calc.century.multiplier = timelookup.century;
        interval_calc.century.minor = timelookup.century;
        interval_calc.decade.type = "decade";
        interval_calc.decade.first = _first.decades;
        interval_calc.decade.base = Math.floor(_first.decades);
        interval_calc.decade.last = _last.decades;
        interval_calc.decade.number = timespan.decades;
        interval_calc.decade.multiplier = timelookup.decade;
        interval_calc.decade.minor = timelookup.decade;
        interval_calc.year.type = "year";
        interval_calc.year.first = _first.years;
        interval_calc.year.base = Math.floor(_first.years);
        interval_calc.year.last = _last.years;
        interval_calc.year.number = timespan.years;
        interval_calc.year.multiplier = 1;
        interval_calc.year.minor = timelookup.month;
        interval_calc.month.type = "month";
        interval_calc.month.first = _first.months;
        interval_calc.month.base = Math.floor(_first.months);
        interval_calc.month.last = _last.months;
        interval_calc.month.number = timespan.months;
        interval_calc.month.multiplier = 1;
        interval_calc.month.minor = Math.round(timelookup.week);
        interval_calc.week.type = "week";
        interval_calc.week.first = _first.weeks;
        interval_calc.week.base = Math.floor(_first.weeks);
        interval_calc.week.last = _last.weeks;
        interval_calc.week.number = timespan.weeks;
        interval_calc.week.multiplier = 1;
        interval_calc.week.minor = 7;
        interval_calc.day.type = "day";
        interval_calc.day.first = _first.days;
        interval_calc.day.base = Math.floor(_first.days);
        interval_calc.day.last = _last.days;
        interval_calc.day.number = timespan.days;
        interval_calc.day.multiplier = 1;
        interval_calc.day.minor = 24;
        interval_calc.hour.type = "hour";
        interval_calc.hour.first = _first.hours;
        interval_calc.hour.base = Math.floor(_first.hours);
        interval_calc.hour.last = _last.hours;
        interval_calc.hour.number = timespan.hours;
        interval_calc.hour.multiplier = 1;
        interval_calc.hour.minor = 60;
        interval_calc.minute.type = "minute";
        interval_calc.minute.first = _first.minutes;
        interval_calc.minute.base = Math.floor(_first.minutes);
        interval_calc.minute.last = _last.minutes;
        interval_calc.minute.number = timespan.minutes;
        interval_calc.minute.multiplier = 1;
        interval_calc.minute.minor = 60;
        interval_calc.second.type = "decade";
        interval_calc.second.first = _first.seconds;
        interval_calc.second.base = Math.floor(_first.seconds);
        interval_calc.second.last = _last.seconds;
        interval_calc.second.number = timespan.seconds;
        interval_calc.second.multiplier = 1;
        interval_calc.second.minor = 10;
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
        _time.milleniums = _time.years / dateFractionBrowser.millenium;
        _time.ages = _time.years / dateFractionBrowser.age;
        _time.epochs = _time.years / dateFractionBrowser.epoch;
        _time.eras = _time.years / dateFractionBrowser.era;
        _time.eons = _time.years / dateFractionBrowser.eon;
        return _time;
      };
      positionRelative = function(_interval, first, last) {
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
      positionOnTimeline = function(the_interval, timerelative) {
        return {
          begin: (timerelative.start - interval.base) * (config.nav.interval_width / config.nav.multiplier.current),
          end: (timerelative.end - interval.base) * (config.nav.interval_width / config.nav.multiplier.current)
        };
      };
      positionMarkers = function(is_animated) {
        var cur_mark, i, in_view, in_view_margin, is_in_view, k, line, line_height, line_last_height_pos, marker, pos, pos_cache_array, pos_cache_close, pos_cache_max, pos_cache_obj, pos_offset, previous_pos, row, row_depth, row_depth_sub, row_pos;

        row = 2;
        previous_pos = 0;
        pos_offset = -2;
        row_depth = 0;
        row_depth_sub = 0;
        line_last_height_pos = 150;
        line_height = 6;
        cur_mark = 0;
        in_view_margin = config.width;
        pos_cache_array = [];
        pos_cache_max = 6;
        in_view = {
          left: timenav_pos.visible.left - in_view_margin,
          right: timenav_pos.visible.right + in_view_margin
        };
        i = 0;
        k = 0;
        config.nav.minor_width = config.width;
        library.removeClass(".flag", "row1");
        library.removeClass(".flag", "row2");
        library.removeClass(".flag", "row3");
        i = 0;
        while (i < markers.length) {
          line = void 0;
          marker = markers[i];
          pos = positionOnTimeline(interval, markers[i].relative_pos);
          row_pos = 0;
          is_in_view = false;
          pos_cache_obj = {
            id: i,
            pos: 0,
            row: 0
          };
          pos_cache_close = 0;
          pos.begin = Math.round(pos.begin + pos_offset);
          pos.end = Math.round(pos.end + pos_offset);
          line = Math.round(pos.end - pos.begin);
          marker.pos_left = pos.begin;
          if (current_marker === i) {
            timenav_pos.left = (config.width / 2) - pos;
            timenav_pos.visible.left = Math.abs(timenav_pos.left);
            timenav_pos.visible.right = Math.abs(timenav_pos.left) + config.width;
            in_view.left = timenav_pos.visible.left - in_view_margin;
            in_view.right = timenav_pos.visible.right + in_view_margin;
          }
          if (Math.abs(pos.begin) >= in_view.left && Math.abs(pos.begin) <= in_view.right) {
            is_in_view = true;
          }
          if (is_animated) {
            library.stop(marker.marker);
            library.animate(marker.marker, config.duration / 2, config.ease, {
              left: pos.begin
            });
          } else {
            library.stop(marker.marker);
            library.css(marker.marker, "left", pos.begin);
          }
          if (i === current_marker) {
            cur_mark = pos.begin;
          }
          if (line > 5) {
            library.css(marker.lineevent, "height", line_height);
            library.css(marker.lineevent, "top", line_last_height_pos);
            if (is_animated) {
              library.animate(marker.lineevent, config.duration / 2, config.ease, {
                width: line
              });
            } else {
              library.css(marker.lineevent, "width", line);
            }
          }
          if (tags.length > 0) {
            k = 0;
            while (k < tags.length) {
              if (k < config.nav.rows.current.length) {
                if (marker.tag === tags[k]) {
                  row = k;
                  if (k === config.nav.rows.current.length - 1) {
                    trace("ON LAST ROW");
                    library.addClass(marker.flag, "flag-small-last");
                  }
                }
              }
              k++;
            }
            row_pos = config.nav.rows.current[row];
          } else {
            if (pos.begin - previous_pos.begin < (config.nav.marker.width + config.spacing)) {
              if (row < config.nav.rows.current.length - 1) {
                row++;
              } else {
                row = 0;
                row_depth++;
              }
            } else {
              row_depth = 1;
              row = 1;
            }
            row_pos = config.nav.rows.current[row];
          }
          previous_pos = pos;
          pos_cache_obj.pos = pos;
          pos_cache_obj.row = row;
          pos_cache_array.push(pos_cache_obj);
          if (pos_cache_array.length > pos_cache_max) {
            util.removeRange(pos_cache_array, 0);
          }
          if (is_animated) {
            library.stop(marker.flag);
            library.animate(marker.flag, config.duration, config.ease, {
              top: row_pos
            });
          } else {
            library.stop(marker.flag);
            library.css(marker.flag, "top", row_pos);
          }
          if (config.start_page && markers[i].type === "start") {
            library.visible(marker.marker, false);
          }
          if (pos > config.nav.minor_width) {
            config.nav.minor_width = pos;
          }
          if (pos < config.nav.minor_left) {
            config.nav.minor_left = pos;
          }
          i++;
        }
        if (is_animated) {
          library.stop($timenav);
          library.animate($timenav, config.duration / 2, config.ease, {
            left: (config.width / 2) - cur_mark
          });
        } else {

        }
      };
      positionEras = function(is_animated) {
        var era, era_height, era_length, i, p, pos, row, row_pos;

        i = 0;
        p = 0;
        i = 0;
        while (i < era_markers.length) {
          era = era_markers[i];
          pos = positionOnTimeline(interval, era.relative_pos);
          row_pos = 0;
          row = 0;
          era_height = config.nav.marker.height * config.nav.rows.full.length;
          era_length = pos.end - pos.begin;
          if (era.tag !== "") {
            era_height = (config.nav.marker.height * config.nav.rows.full.length) / config.nav.rows.current.length;
            p = 0;
            while (p < tags.length) {
              if (p < config.nav.rows.current.length ? era.tag === tags[p] : void 0) {
                row = p;
              }
              p++;
            }
            row_pos = config.nav.rows.current[row];
          } else {
            row_pos = -1;
          }
          if (is_animated) {
            library.stop(era.content);
            library.stop(era.text_content);
            library.animate(era.content, config.duration / 2, config.ease, {
              top: row_pos,
              left: pos.begin,
              width: era_length,
              height: era_height
            });
            library.animate(era.text_content, config.duration / 2, config.ease, {
              left: pos.begin
            });
          } else {
            library.stop(era.content);
            library.stop(era.text_content);
            library.css(era.content, "left", pos.begin);
            library.css(era.content, "width", era_length);
            library.css(era.content, "height", era_height);
            library.css(era.content, "top", row_pos);
            library.css(era.text_content, "left", pos.begin);
          }
          i++;
        }
      };
      positionInterval = function(the_main_element, the_intervals, is_animated, is_minor) {
        var i, in_view, in_view_margin, is_in_view, is_visible, last_position, last_position_major, not_too_many, pos, pos_offset, _animation, _interval, _interval_date, _interval_visible, _pos;

        last_position = 0;
        last_position_major = 0;
        in_view_margin = config.width;
        in_view = {
          left: timenav_pos.visible.left - in_view_margin,
          right: timenav_pos.visible.right + in_view_margin
        };
        not_too_many = true;
        i = 0;
        config.nav.minor_left = 0;
        if (the_intervals.length > 100) {
          not_too_many = false;
          trace("TOO MANY " + the_intervals.length);
        }
        i = 0;
        while (i < the_intervals.length) {
          _interval = the_intervals[i].element;
          _interval_date = the_intervals[i].date;
          _interval_visible = the_intervals[i].visible;
          _pos = positionOnTimeline(interval, the_intervals[i].relative_pos);
          pos = _pos.begin;
          _animation = the_intervals[i].animation;
          is_visible = true;
          is_in_view = false;
          pos_offset = 50;
          _animation.pos = pos;
          _animation.animate = false;
          if (Math.abs(pos) >= in_view.left && Math.abs(pos) <= in_view.right) {
            is_in_view = true;
          }
          if (true) {
            if (config.nav.multiplier.current > 16 && is_minor) {
              is_visible = false;
            } else {
              if ((pos - last_position) < 65) {
                if ((pos - last_position) < 35) {
                  if (i % 4 === 0) {
                    if (pos === 0) {
                      is_visible = false;
                    }
                  } else {
                    is_visible = false;
                  }
                } else {
                  if (!util.isEven(i)) {
                    is_visible = false;
                  }
                }
              }
            }
            if (is_visible) {
              if (the_intervals[i].is_detached) {
                library.append(the_main_element, _interval);
                the_intervals[i].is_detached = false;
              }
            } else {
              the_intervals[i].is_detached = true;
              library.detach(_interval);
            }
            if (_interval_visible) {
              if (!is_visible) {
                _animation.opacity = "0";
                if (is_animated && not_too_many) {
                  _animation.animate = true;
                }
                the_intervals[i].interval_visible = false;
              } else {
                _animation.opacity = "100";
                if (is_animated && is_in_view) {
                  _animation.animate = true;
                }
              }
            } else {
              _animation.opacity = "100";
              if (is_visible) {
                if (is_animated && not_too_many) {
                  _animation.animate = true;
                } else {
                  if (is_animated && is_in_view) {
                    _animation.animate = true;
                  }
                }
                the_intervals[i].interval_visible = true;
              } else {
                if (is_animated && not_too_many) {
                  _animation.animate = true;
                }
              }
            }
            last_position = pos;
            if (pos > config.nav.minor_width) {
              config.nav.minor_width = pos;
            }
            if (pos < config.nav.minor_left) {
              config.nav.minor_left = pos;
            }
          }
          if (_animation.animate) {
            library.animate(_interval, config.duration / 2, config.ease, {
              opacity: _animation.opacity,
              left: _animation.pos
            });
          } else {
            library.css(_interval, "opacity", _animation.opacity);
            library.css(_interval, "left", pos);
          }
          i++;
        }
        config.nav.constraint.right_min = -config.nav.minor_width + config.width;
        config.nav.constraint.right = config.nav.constraint.right_min + (config.width / 2);
        library.css($timeintervalminor_minor, "left", config.nav.minor_left - config.width / 2);
        library.width($timeintervalminor_minor, config.nav.minor_width + config.width + Math.abs(config.nav.minor_left));
      };
      createIntervalElements = function(_interval, _array, _element_parent) {
        var firefox, i, inc_time, int_number, int_obj, _first_date, _first_run, _is_year, _largest_pos, _last_date, _last_pos, _timezone_offset;

        inc_time = 0;
        _first_run = true;
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
        library.attachElement(_element_parent, "");
        _interval.date = new Date(data[0].startdate.getFullYear(), 0, 1, 0, 0, 0);
        _timezone_offset = _interval.date.getTimezoneOffset();
        i = 0;
        while (i < int_number) {
          trace(_interval.type);
          _is_year = false;
          int_obj = {
            element: library.appendAndGetElement(_element_parent, "<div>", _interval.classname),
            date: new Date(data[0].startdate.getFullYear(), 0, 1, 0, 0, 0),
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
            if (_first_run) {
              _first_date = Math.floor(data[0].startdate.getFullYear() / 500000000) * 500000000;
            }
            int_obj.date.setFullYear(_first_date + (inc_time * 500000000));
            _is_year = true;
          } else if (_interval.type === "era") {
            if (_first_run) {
              _first_date = Math.floor(data[0].startdate.getFullYear() / 100000000) * 100000000;
            }
            int_obj.date.setFullYear(_first_date + (inc_time * 100000000));
            _is_year = true;
          } else if (_interval.type === "epoch") {
            if (_first_run) {
              _first_date = Math.floor(data[0].startdate.getFullYear() / 10000000) * 10000000;
            }
            int_obj.date.setFullYear(_first_date + (inc_time * 10000000));
            _is_year = true;
          } else if (_interval.type === "age") {
            if (_first_run) {
              _first_date = Math.floor(data[0].startdate.getFullYear() / 1000000) * 1000000;
            }
            int_obj.date.setFullYear(_first_date + (inc_time * 1000000));
            _is_year = true;
          } else if (_interval.type === "millenium") {
            if (_first_run) {
              _first_date = Math.floor(data[0].startdate.getFullYear() / 1000) * 1000;
            }
            int_obj.date.setFullYear(_first_date + (inc_time * 1000));
            _is_year = true;
          } else if (_interval.type === "century") {
            if (_first_run) {
              _first_date = Math.floor(data[0].startdate.getFullYear() / 100) * 100;
            }
            int_obj.date.setFullYear(_first_date + (inc_time * 100));
            _is_year = true;
          } else if (_interval.type === "decade") {
            if (_first_run) {
              _first_date = Math.floor(data[0].startdate.getFullYear() / 10) * 10;
            }
            int_obj.date.setFullYear(_first_date + (inc_time * 10));
            _is_year = true;
          } else if (_interval.type === "year") {
            if (_first_run) {
              _first_date = data[0].startdate.getFullYear();
            }
            int_obj.date.setFullYear(_first_date + inc_time);
            _is_year = true;
          } else if (_interval.type === "month") {
            if (_first_run) {
              _first_date = data[0].startdate.getMonth();
            }
            int_obj.date.setMonth(_first_date + inc_time);
          } else if (_interval.type === "week") {
            if (_first_run) {
              _first_date = data[0].startdate.getMonth();
            }
            int_obj.date.setMonth(data[0].startdate.getMonth());
            int_obj.date.setDate(_first_date + (inc_time * 7));
          } else if (_interval.type === "day") {
            if (_first_run) {
              _first_date = data[0].startdate.getDate();
            }
            int_obj.date.setMonth(data[0].startdate.getMonth());
            int_obj.date.setDate(_first_date + inc_time);
          } else if (_interval.type === "hour") {
            if (_first_run) {
              _first_date = data[0].startdate.getHours();
            }
            int_obj.date.setMonth(data[0].startdate.getMonth());
            int_obj.date.setDate(data[0].startdate.getDate());
            int_obj.date.setHours(_first_date + inc_time);
          } else if (_interval.type === "minute") {
            if (_first_run) {
              _first_date = data[0].startdate.getMinutes();
            }
            int_obj.date.setMonth(data[0].startdate.getMonth());
            int_obj.date.setDate(data[0].startdate.getDate());
            int_obj.date.setHours(data[0].startdate.getHours());
            int_obj.date.setMinutes(_first_date + inc_time);
          } else if (_interval.type === "second") {
            if (_first_run) {
              _first_date = data[0].startdate.getSeconds();
            }
            int_obj.date.setMonth(data[0].startdate.getMonth());
            int_obj.date.setDate(data[0].startdate.getDate());
            int_obj.date.setHours(data[0].startdate.getHours());
            int_obj.date.setMinutes(data[0].startdate.getMinutes());
            int_obj.date.setSeconds(_first_date + inc_time);
          } else if (_interval.type === "millisecond") {
            if (_first_run) {
              _first_date = data[0].startdate.getMilliseconds();
            }
            int_obj.date.setMonth(data[0].startdate.getMonth());
            int_obj.date.setDate(data[0].startdate.getDate());
            int_obj.date.setHours(data[0].startdate.getHours());
            int_obj.date.setMinutes(data[0].startdate.getMinutes());
            int_obj.date.setSeconds(data[0].startdate.getSeconds());
            int_obj.date.setMilliseconds(_first_date + inc_time);
          }
          if (browser.browser === "Firefox") {
            if (int_obj.date.getFullYear() === "1970" && int_obj.date.getTimezoneOffset() !== _timezone_offset) {
              trace("FIREFOX 1970 TIMEZONE OFFSET " + int_obj.date.getTimezoneOffset() + " SHOULD BE " + _timezone_offset);
              trace(_interval.type + " " + _interval.date);
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
          inc_time = inc_time + 1;
          _first_run = false;
          int_obj.relative_pos = positionRelative(interval, int_obj.date);
          _last_pos = int_obj.relative_pos.begin;
          if (int_obj.relative_pos.begin > _largest_pos) {
            _largest_pos = int_obj.relative_pos.begin;
          }
          library.appendElement(int_obj.element, int_obj.date_string);
          library.css(int_obj.element, "text-indent", -(library.width(int_obj.element) / 2));
          library.css(int_obj.element, "opacity", "0");
          _array.push(int_obj);
          i++;
        }
        library.width($timeintervalminor_minor, _largest_pos);
        positionInterval(_element_parent, _array);
      };
      build = function() {
        var $backhome, i, j;

        i = 0;
        j = 0;
        library.attachElement(layout, "");
        $timenav = library.appendAndGetElement(layout, "<div>", "timenav");
        $content = library.appendAndGetElement($timenav, "<div>", "content");
        $time = library.appendAndGetElement($timenav, "<div>", "time");
        $timeintervalminor = library.appendAndGetElement($time, "<div>", "time-interval-minor");
        $timeintervalminor_minor = library.appendAndGetElement($timeintervalminor, "<div>", "minor");
        $timeintervalmajor = library.appendAndGetElement($time, "<div>", "time-interval-major");
        $timeinterval = library.appendAndGetElement($time, "<div>", "time-interval");
        $timebackground = library.appendAndGetElement(layout, "<div>", "timenav-background");
        $timenavline = library.appendAndGetElement($timebackground, "<div>", "timenav-line");
        $timenavindicator = library.appendAndGetElement($timebackground, "<div>", "timenav-indicator");
        $timeintervalbackground = library.appendAndGetElement($timebackground, "<div>", "timenav-interval-background", "<div class='top-highlight'></div>");
        $toolbar = library.appendAndGetElement(layout, "<div>", "vco-toolbar");
        buildInterval();
        buildMarkers();
        buildEras();
        calculateMultiplier();
        positionMarkers(false);
        positionEras();
        positionInterval($timeinterval, interval_array, false, true);
        positionInterval($timeintervalmajor, interval_major_array);
        if (config.start_page) {
          $backhome = library.appendAndGetElement($toolbar, "<div>", "back-home", "<div class='icon'></div>");
          library.bindEvent(".back-home", onBackHome, "click");
          library.attribute($backhome, "title", masterConfig.language.messages.return_to_title);
          library.attribute($backhome, "rel", "timeline-tooltip");
        }
        $dragslide = new DragSlider();
        $dragslide.createPanel(layout, $timenav, config.nav.constraint, config.touch);
        if (config.touch && config.start_page) {
          library.addClass($toolbar, "touch");
          library.css($toolbar, "top", 55);
          library.css($toolbar, "left", 10);
        } else {
          if (config.start_page) {
            library.css($toolbar, "top", 27);
          }
          $zoomin = library.appendAndGetElement($toolbar, "<div>", "zoom-in", "<div class='icon'></div>");
          $zoomout = library.appendAndGetElement($toolbar, "<div>", "zoom-out", "<div class='icon'></div>");
          library.bindEvent($zoomin, onZoomIn, "click");
          library.bindEvent($zoomout, onZoomOut, "click");
          library.attribute($zoomin, "title", masterConfig.language.messages.expand_timeline);
          library.attribute($zoomin, "rel", "timeline-tooltip");
          library.attribute($zoomout, "title", masterConfig.language.messages.contract_timeline);
          library.attribute($zoomout, "rel", "timeline-tooltip");
          $toolbar.tooltip({
            selector: "div[rel=timeline-tooltip]",
            placement: "right"
          });
          library.bindEvent(layout, onMouseScroll, "DOMMouseScroll");
          library.bindEvent(layout, onMouseScroll, "mousewheel");
        }
        if (config.nav.zoom.adjust !== 0) {
          if (config.nav.zoom.adjust < 0) {
            i = 0;
            while (i < Math.abs(config.nav.zoom.adjust)) {
              onZoomOut();
              i++;
            }
          } else {
            j = 0;
            while (j < config.nav.zoom.adjust) {
              onZoomIn();
              j++;
            }
          }
        }
        _active = true;
        reSize(true);
        library.fireEvent(layout, "LOADED");
      };
      buildInterval = function() {
        var i, j;

        i = 0;
        j = 0;
        timespan = getDateFractions(data[data.length - 1].enddate - data[0].startdate, true);
        trace(timespan);
        calculateInterval();
        if (timespan.centuries > data.length / config.nav.density) {
          interval = interval_calc.century;
          interval_major = interval_calc.millenium;
          interval_macro = interval_calc.decade;
        } else if (timespan.decades > data.length / config.nav.density) {
          interval = interval_calc.decade;
          interval_major = interval_calc.century;
          interval_macro = interval_calc.year;
        } else if (timespan.years > data.length / config.nav.density) {
          interval = interval_calc.year;
          interval_major = interval_calc.decade;
          interval_macro = interval_calc.month;
        } else if (timespan.months > data.length / config.nav.density) {
          interval = interval_calc.month;
          interval_major = interval_calc.year;
          interval_macro = interval_calc.day;
        } else if (timespan.days > data.length / config.nav.density) {
          interval = interval_calc.day;
          interval_major = interval_calc.month;
          interval_macro = interval_calc.hour;
        } else if (timespan.hours > data.length / config.nav.density) {
          interval = interval_calc.hour;
          interval_major = interval_calc.day;
          interval_macro = interval_calc.minute;
        } else if (timespan.minutes > data.length / config.nav.density) {
          interval = interval_calc.minute;
          interval_major = interval_calc.hour;
          interval_macro = interval_calc.second;
        } else if (timespan.seconds > data.length / config.nav.density) {
          interval = interval_calc.second;
          interval_major = interval_calc.minute;
          interval_macro = interval_calc.second;
        } else {
          trace("NO IDEA WHAT THE TYPE SHOULD BE");
          interval = interval_calc.day;
          interval_major = interval_calc.month;
          interval_macro = interval_calc.hour;
        }
        trace("INTERVAL TYPE: " + interval.type);
        trace("INTERVAL MAJOR TYPE: " + interval_major.type);
        createIntervalElements(interval, interval_array, $timeinterval);
        createIntervalElements(interval_major, interval_major_array, $timeintervalmajor);
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
      };
      buildMarkers = function() {
        var has_title, i, k, l, lpos, m, row, row_depth, tag_element, _marker, _marker_content, _marker_dot, _marker_flag, _marker_line, _marker_line_event, _marker_obj, _marker_relative_pos, _marker_thumb, _marker_title;

        row = 2;
        lpos = 0;
        row_depth = 0;
        i = 0;
        k = 0;
        l = 0;
        markers = [];
        era_markers = [];
        i = 0;
        while (i < data.length) {
          _marker = void 0;
          _marker_flag = void 0;
          _marker_content = void 0;
          _marker_dot = void 0;
          _marker_line = void 0;
          _marker_line_event = void 0;
          _marker_obj = void 0;
          _marker_title = "";
          has_title = false;
          _marker = library.appendAndGetElement($content, "<div>", "marker");
          _marker_flag = library.appendAndGetElement(_marker, "<div>", "flag");
          _marker_content = library.appendAndGetElement(_marker_flag, "<div>", "flag-content");
          _marker_dot = library.appendAndGetElement(_marker, "<div>", "dot");
          _marker_line = library.appendAndGetElement(_marker, "<div>", "line");
          _marker_line_event = library.appendAndGetElement(_marker_line, "<div>", "event-line");
          _marker_relative_pos = positionRelative(interval, data[i].startdate, data[i].enddate);
          _marker_thumb = "";
          if ((data[i].asset != null) && data[i].asset !== "") {
            library.appendElement(_marker_content, MediaElement.thumbnail(data[i].asset, 24, 24, data[i].uniqueid));
          } else {
            library.appendElement(_marker_content, "<div style='margin-right:7px;height:50px;width:2px;float:left;'></div>");
          }
          if (data[i].title === "" || data[i].title === " ") {
            trace("TITLE NOTHING");
            if (typeof data[i].slug !== "undefined" && data[i].slug !== "") {
              trace("SLUG");
              _marker_title = util.untagify(data[i].slug);
              has_title = true;
            } else {
              m = ExternalAPI.mediaTypeFromAsset(data[i].asset);
              if (m.type === "quote" || m.type === "unknown") {
                _marker_title = util.untagify(m.id);
                has_title = true;
              } else {
                has_title = false;
              }
            }
          } else if (data[i].title !== "" || data[i].title !== " ") {
            trace(data[i].title);
            _marker_title = util.untagify(data[i].title);
            has_title = true;
          } else {
            trace("TITLE SLUG NOT FOUND " + data[i].slug);
          }
          if (has_title) {
            library.appendElement(_marker_content, "<h3>" + _marker_title + "</h3>");
          } else {
            library.appendElement(_marker_content, "<h3>" + _marker_title + "</h3>");
            library.appendElement(_marker_content, "<h3 id='marker_content_" + data[i].uniqueid + "'>" + _marker_title + "</h3>");
          }
          library.attr(_marker, "id", ("marker_" + data[i].uniqueid).toString());
          library.bindEvent(_marker_flag, onMarkerClick, "", {
            number: i
          });
          library.bindEvent(_marker_flag, onMarkerHover, "mouseenter mouseleave", {
            number: i,
            elem: _marker_flag
          });
          _marker_obj = {
            marker: _marker,
            flag: _marker_flag,
            lineevent: _marker_line_event,
            type: "marker",
            full: true,
            relative_pos: _marker_relative_pos,
            tag: data[i].tag,
            pos_left: 0
          };
          if (data[i].type === "start") {
            trace("BUILD MARKER HAS START PAGE");
            config.start_page = true;
            _marker_obj.type = "start";
          }
          if (data[i].type === "storify") {
            _marker_obj.type = "storify";
          }
          if (data[i].tag) {
            tags.push(data[i].tag);
          }
          markers.push(_marker_obj);
          i++;
        }
        tags = util.deDupeArray(tags);
        if (tags.length > 3) {
          config.nav.rows.current = config.nav.rows.half;
        } else {
          config.nav.rows.current = config.nav.rows.full;
        }
        k = 0;
        while (k < tags.length) {
          if (k < config.nav.rows.current.length) {
            tag_element = library.appendAndGetElement($timebackground, "<div>", "timenav-tag");
            library.addClass(tag_element, "timenav-tag-row-" + (k + 1));
            if (tags.length > 3) {
              library.addClass(tag_element, "timenav-tag-size-half");
            } else {
              library.addClass(tag_element, "timenav-tag-size-full");
            }
            library.appendElement(tag_element, "<div><h3>" + tags[k] + "</h3></div>");
          }
          k++;
        }
        if (tags.length > 3) {
          l = 0;
          while (l < markers.length) {
            library.addClass(markers[l].flag, "flag-small");
            markers[l].full = false;
            l++;
          }
        }
      };
      buildEras = function() {
        var current_color, en, era, era_text, j, number_of_colors, st;

        number_of_colors = 6;
        current_color = 0;
        j = 0;
        j = 0;
        while (j < eras.length) {
          era = {
            content: library.appendAndGetElement($content, "<div>", "era"),
            text_content: library.appendAndGetElement($timeinterval, "<div>", "era"),
            startdate: vDate.parse(eras[j].startDate),
            enddate: vDate.parse(eras[j].endDate),
            title: eras[j].headline,
            uniqueid: util.unique_ID(6),
            tag: "",
            relative_pos: ""
          };
          st = vDate.prettyDate(era.startdate);
          en = vDate.prettyDate(era.enddate);
          era_text = "<div>&nbsp;</div>";
          if (typeof eras[j].tag !== "undefined") {
            era.tag = eras[j].tag;
          }
          era.relative_pos = positionRelative(interval, era.startdate, era.enddate);
          library.attr(era.content, "id", era.uniqueid);
          library.attr(era.text_content, "id", era.uniqueid + "_text");
          library.addClass(era.content, "era" + (current_color + 1));
          library.addClass(era.text_content, "era" + (current_color + 1));
          if (current_color < number_of_colors) {
            current_color++;
          } else {
            current_color = 0;
          }
          library.appendElement(era.content, era_text);
          library.appendElement(era.text_content, util.unlinkify(era.title));
          era_markers.push(era);
          j++;
        }
      };
      this.init = function(d, e) {
        trace("VMM.Timeline.TimeNav init");
        if (typeof d !== "undefined") {
          this.setData(d, e);
        } else {
          trace("WAITING ON DATA");
        }
      };
      this.setData = function(d, e) {
        if (typeof d !== "undefined") {
          data = {};
          data = d;
          eras = e;
          build();
        } else {
          trace("NO DATA");
        }
      };
      this.setSize = function(w, h) {
        if (w != null) {
          config.width = w;
        }
        if (h != null) {
          config.height = h;
        }
        if (_active) {
          reSize();
        }
      };
      this.setMarker = function(n, ease, duration, fast) {
        goToMarker(n, ease, duration);
      };
      this.getCurrentNumber = function() {
        return current_marker;
      };
    };
  });

}).call(this);
