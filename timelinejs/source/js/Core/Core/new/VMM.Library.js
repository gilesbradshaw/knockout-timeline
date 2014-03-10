(function() {
  define(["jquery", "trace", "VMM.Browser", "jQueryExtender"], function(jQuery, trace, browser) {
    var library;

    return library = {
      init: function() {
        return this;
      },
      hide: function(element, duration) {
        if ((duration != null) && duration !== "") {
          if (typeof jQuery !== "undefined") {
            return jQuery(element).hide(duration);
          }
        } else {
          if (typeof jQuery !== "undefined") {
            return jQuery(element).hide();
          }
        }
      },
      remove: function(element) {
        if (typeof jQuery !== "undefined") {
          return jQuery(element).remove();
        }
      },
      detach: function(element) {
        if (typeof jQuery !== "undefined") {
          return jQuery(element).detach();
        }
      },
      append: function(element, value) {
        if (typeof jQuery !== "undefined") {
          return jQuery(element).append(value);
        }
      },
      prepend: function(element, value) {
        if (typeof jQuery !== "undefined") {
          return jQuery(element).prepend(value);
        }
      },
      show: function(element, duration) {
        if ((duration != null) && duration !== "") {
          if (typeof jQuery !== "undefined") {
            return jQuery(element).show(duration);
          }
        } else {
          if (typeof jQuery !== "undefined") {
            return jQuery(element).show();
          }
        }
      },
      load: function(element, callback_function, event_data) {
        var _event_data;

        _event_data = {
          elem: element
        };
        if ((_event_data != null) && _event_data !== "") {
          _event_data = event_data;
        }
        if (typeof jQuery !== "undefined") {
          return jQuery(element).load(_event_data, callback_function);
        }
      },
      addClass: function(element, cName) {
        if (typeof jQuery !== "undefined") {
          return jQuery(element).addClass(cName);
        }
      },
      removeClass: function(element, cName) {
        if (typeof jQuery !== "undefined") {
          return jQuery(element).removeClass(cName);
        }
      },
      attr: function(element, aName, value) {
        if ((value != null) && value !== "") {
          if (typeof jQuery !== "undefined") {
            return jQuery(element).attr(aName, value);
          }
        } else {
          if (typeof jQuery !== "undefined") {
            return jQuery(element).attr(aName);
          }
        }
      },
      prop: function(element, aName, value) {
        if (typeof jQuery === "undefined" || !/[1-9]\.[3-9].[1-9]/.test(jQuery.fn.jquery)) {
          return library.attribute(element, aName, value);
        } else {
          return jQuery(element).prop(aName, value);
        }
      },
      attribute: function(element, aName, value) {
        if ((value != null) && value !== "") {
          if (typeof jQuery !== "undefined") {
            return jQuery(element).attr(aName, value);
          }
        } else {
          if (typeof jQuery !== "undefined") {
            return jQuery(element).attr(aName);
          }
        }
      },
      visible: function(element, show) {
        if (show != null) {
          if (typeof jQuery !== "undefined") {
            if (show) {
              return jQuery(element).show(0);
            } else {
              return jQuery(element).hide(0);
            }
          }
        } else {
          if (typeof jQuery !== "undefined") {
            if (jQuery(element).is(":visible")) {
              return true;
            } else {
              return false;
            }
          }
        }
      },
      css: function(element, prop, value) {
        if (value) {
          if (typeof jQuery !== "undefined") {
            return jQuery(element).css(prop, value);
          }
        } else {
          if (typeof jQuery !== "undefined") {
            return jQuery(element).css(prop);
          }
        }
      },
      cssmultiple: function(element, propval) {
        if (typeof jQuery !== "undefined") {
          return jQuery(element).css(propval);
        }
      },
      offset: function(element) {
        var p;

        p = void 0;
        if (typeof jQuery !== "undefined") {
          p = jQuery(element).offset();
        }
        return p;
      },
      position: function(element) {
        var p;

        p = void 0;
        if (typeof jQuery !== "undefined") {
          p = jQuery(element).position();
        }
        return p;
      },
      width: function(element, s) {
        if ((s != null) && s !== "") {
          if (typeof jQuery !== "undefined") {
            return jQuery(element).width(s);
          }
        } else {
          if (typeof jQuery !== "undefined") {
            return jQuery(element).width();
          }
        }
      },
      height: function(element, s) {
        if ((s != null) && s !== "") {
          if (typeof jQuery !== "undefined") {
            return jQuery(element).height(s);
          }
        } else {
          if (typeof jQuery !== "undefined") {
            return jQuery(element).height();
          }
        }
      },
      toggleClass: function(element, cName) {
        if (typeof jQuery !== "undefined") {
          return jQuery(element).toggleClass(cName);
        }
      },
      each: function(element, return_function) {
        if (typeof jQuery !== "undefined") {
          return jQuery(element).each(return_function);
        }
      },
      html: function(element, str) {
        var e;

        e = void 0;
        if (typeof jQuery !== "undefined") {
          e = jQuery(element).html();
          return e;
        }
        if ((str != null) && str !== "") {
          if (typeof jQuery !== "undefined") {
            return jQuery(element).html(str);
          }
        } else {
          e = void 0;
          if (typeof jQuery !== "undefined") {
            e = jQuery(element).html();
            return e;
          }
        }
      },
      find: function(element, selec) {
        if (typeof jQuery !== "undefined") {
          return jQuery(element).find(selec);
        }
      },
      stop: function(element) {
        if (typeof jQuery !== "undefined") {
          return jQuery(element).stop();
        }
      },
      delay_animate: function(delay, element, duration, ease, att, callback_function) {
        var __duration, _tdd;

        if (browser.device === "mobile" || browser.device === "tablet") {
          _tdd = Math.round((duration / 1500) * 10) / 10;
          __duration = _tdd + "s";
          library.css(element, "-webkit-transition", "all " + __duration + " ease");
          library.css(element, "-moz-transition", "all " + __duration + " ease");
          library.css(element, "-o-transition", "all " + __duration + " ease");
          library.css(element, "-ms-transition", "all " + __duration + " ease");
          library.css(element, "transition", "all " + __duration + " ease");
          return library.cssmultiple(element, _att);
        } else {
          if (typeof jQuery !== "undefined") {
            return jQuery(element).delay(delay).animate(att, {
              duration: duration,
              easing: ease
            });
          }
        }
      },
      animate: function(element, duration, ease, att, queue, callback_function) {
        var x, __duration, _att, _duration, _ease, _queue, _tdd;

        _ease = "easein";
        _queue = false;
        _duration = 1000;
        _att = {};
        if (duration != null) {
          if (duration < 1) {
            _duration = 1;
          } else {
            _duration = Math.round(duration);
          }
        }
        if ((ease != null) && ease !== "") {
          _ease = ease;
        }
        if ((queue != null) && queue !== "") {
          _queue = queue;
        }
        if (att != null) {
          _att = att;
        } else {
          _att = {
            opacity: 0
          };
        }
        if (browser.device === "mobile" || browser.device === "tablet") {
          _tdd = Math.round((_duration / 1500) * 10) / 10;
          __duration = _tdd + "s";
          _ease = " cubic-bezier(0.33, 0.66, 0.66, 1)";
          for (x in _att) {
            if (Object.prototype.hasOwnProperty.call(_att, x)) {
              trace(x + " to " + _att[x]);
              library.css(element, "-webkit-transition", x + " " + __duration + _ease);
              library.css(element, "-moz-transition", x + " " + __duration + _ease);
              library.css(element, "-o-transition", x + " " + __duration + _ease);
              library.css(element, "-ms-transition", x + " " + __duration + _ease);
              library.css(element, "transition", x + " " + __duration + _ease);
            }
          }
          return library.cssmultiple(element, _att);
        } else {
          if (typeof jQuery !== "undefined") {
            if ((callback_function != null) && callback_function !== "") {
              return jQuery(element).animate(_att, {
                queue: _queue,
                duration: _duration,
                easing: _ease,
                complete: callback_function
              });
            } else {
              return jQuery(element).animate(_att, {
                queue: _queue,
                duration: _duration,
                easing: _ease
              });
            }
          }
        }
      },
      smoothScrollTo: function(elem, duration, ease) {
        var _duration, _ease;

        if (typeof jQuery !== "undefined") {
          _ease = "easein";
          _duration = 1000;
          if (duration != null) {
            if (duration < 1) {
              _duration = 1;
            } else {
              _duration = Math.round(duration);
            }
          }
          if ((ease != null) && ease !== "") {
            _ease = ease;
          }
          if (jQuery(window).scrollTop() !== library.offset(elem).top) {
            return library.animate("html,body", _duration, _ease, {
              scrollTop: library.offset(elem).top
            });
          }
        }
      },
      attachElement: function(element, content) {
        if (typeof jQuery !== "undefined") {
          return jQuery(element).html(content);
        }
      },
      appendElement: function(element, content) {
        if (typeof jQuery !== "undefined") {
          return jQuery(element).append(content);
        }
      },
      getHTML: function(element) {
        var e;

        e = void 0;
        if (typeof jQuery !== "undefined") {
          e = jQuery(element).html();
          return e;
        }
      },
      getElement: function(element, p) {
        var e;

        e = void 0;
        if (typeof jQuery !== "undefined") {
          if (p) {
            e = jQuery(element).parent().get(0);
          } else {
            e = jQuery(element).get(0);
          }
          return e;
        }
      },
      bindEvent: function(element, the_handler, the_event_type, event_data) {
        var e, _event_data, _event_type;

        e = void 0;
        _event_type = "click";
        _event_data = {};
        if ((the_event_type != null) && the_event_type !== "") {
          _event_type = the_event_type;
        }
        if ((_event_data != null) && _event_data !== "") {
          _event_data = event_data;
        }
        if (typeof jQuery !== "undefined") {
          return jQuery(element).bind(_event_type, _event_data, the_handler);
        }
      },
      unbindEvent: function(element, the_handler, the_event_type) {
        var e, _event_data, _event_type;

        e = void 0;
        _event_type = "click";
        _event_data = {};
        if ((the_event_type != null) && the_event_type !== "") {
          _event_type = the_event_type;
        }
        if (typeof jQuery !== "undefined") {
          return jQuery(element).unbind(_event_type, the_handler);
        }
      },
      fireEvent: function(element, the_event_type, the_data) {
        var e, _data, _event_type;

        e = void 0;
        _event_type = "click";
        _data = [];
        if ((the_event_type != null) && the_event_type !== "") {
          _event_type = the_event_type;
        }
        if ((the_data != null) && the_data !== "") {
          _data = the_data;
        }
        if (typeof jQuery !== "undefined") {
          return jQuery(element).trigger(_event_type, _data);
        }
      },
      getJSON: function(url, data, callback) {
        var ie_url;

        if (typeof jQuery !== "undefined") {
          jQuery.ajaxSetup({
            timeout: 3000
          });
          if (browser.browser === "Explorer" && parseInt(browser.version, 10) >= 7 && window.XDomainRequest) {
            trace("IE JSON");
            ie_url = url;
            if (ie_url.match("^http://")) {
              return jQuery.getJSON(ie_url, data, callback);
            } else if (ie_url.match("^https://")) {
              ie_url = ie_url.replace("https://", "http://");
              return jQuery.getJSON(ie_url, data, callback);
            } else {
              return jQuery.getJSON(url, data, callback);
            }
          } else {
            return jQuery.getJSON(url, data, callback);
          }
        }
      },
      parseJSON: function(the_json) {
        if (typeof jQuery !== "undefined") {
          return jQuery.parseJSON(the_json);
        }
      },
      appendAndGetElement: function(append_to_element, tag, cName, content) {
        var e, _class, _content, _id, _tag;

        e = void 0;
        _tag = "<div>";
        _class = "";
        _content = "";
        _id = "";
        if ((tag != null) && tag !== "") {
          _tag = tag;
        }
        if ((cName != null) && cName !== "") {
          _class = cName;
        }
        if (content) {
          _content = content;
        }
        if (typeof jQuery !== "undefined") {
          e = jQuery(tag);
          e.addClass(_class);
          e.html(_content);
          jQuery(append_to_element).append(e);
        }
        return e;
      },
      createElement: function(tag, value, cName, attrs, styles) {
        var ce;

        ce = "";
        if ((tag != null) && tag !== "") {
          ce += "<" + tag;
          if ((cName != null) && cName !== "") {
            ce += " class='" + cName + "'";
          }
          if ((attrs != null) && attrs !== "") {
            ce += " " + attrs;
          }
          if ((styles != null) && styles !== "") {
            ce += " style='" + styles + "'";
          }
          ce += ">";
          if ((value != null) && value !== "") {
            ce += value;
          }
          ce = ce + "</" + tag + ">";
        }
        return ce;
      },
      createMediaElement: function(media, caption, credit) {
        var ce, valid, _valid;

        ce = "";
        _valid = false;
        ce += "<div class='media'>";
        if ((media != null) && media !== "") {
          valid = true;
          ce += "<img src='" + media + "'>";
          if ((credit != null) && credit !== "") {
            ce += library.createElement("div", credit, "credit");
          }
          if ((caption != null) && caption !== "") {
            ce += library.createElement("div", caption, "caption");
          }
        }
        ce += "</div>";
        return ce;
      },
      hideUrlBar: function() {
        var bodycheck, doc, scrollTop, win;

        win = window;
        doc = win.document;
        if (!location.hash || !win.addEventListener) {
          window.scrollTo(0, 1);
          scrollTop = 1;
          bodycheck = setInterval(function() {
            if (doc.body) {
              clearInterval(bodycheck);
              scrollTop = ("scrollTop" in doc.body ? doc.body.scrollTop : 1);
              win.scrollTo(0, (scrollTop === 1 ? 0 : 1));
            }
          }, 15);
          win.addEventListener("load", (function() {
            setTimeout((function() {
              win.scrollTo(0, (scrollTop === 1 ? 0 : 1));
            }), 0);
          }), false);
        }
      },
      loadingmessage: function(m) {
        return "<div class='vco-loading'><div class='vco-loading-container'><div class='vco-loading-icon'></div>" + "<div class='vco-message'><p>" + m + "</p></div></div></div>";
      }
    };
  });

}).call(this);
