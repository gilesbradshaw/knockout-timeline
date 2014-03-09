(function() {
  define(["jquery", "VMM", "trace", "VMM.Browser", "easing"], function(jQuery, VMM, trace, browser) {
    VMM.smoothScrollTo = function(elem, duration, ease) {
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
        if (jQuery(window).scrollTop() !== VMM.Lib.offset(elem).top) {
          return VMM.Lib.animate("html,body", _duration, _ease, {
            scrollTop: VMM.Lib.offset(elem).top
          });
        }
      }
    };
    VMM.attachElement = function(element, content) {
      if (typeof jQuery !== "undefined") {
        return jQuery(element).html(content);
      }
    };
    VMM.appendElement = function(element, content) {
      if (typeof jQuery !== "undefined") {
        return jQuery(element).append(content);
      }
    };
    VMM.getHTML = function(element) {
      var e;

      e = void 0;
      if (typeof jQuery !== "undefined") {
        e = jQuery(element).html();
        return e;
      }
    };
    VMM.getElement = function(element, p) {
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
    };
    VMM.bindEvent = function(element, the_handler, the_event_type, event_data) {
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
    };
    VMM.unbindEvent = function(element, the_handler, the_event_type) {
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
    };
    VMM.fireEvent = function(element, the_event_type, the_data) {
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
    };
    VMM.getJSON = function(url, data, callback) {
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
    };
    VMM.parseJSON = function(the_json) {
      if (typeof jQuery !== "undefined") {
        return jQuery.parseJSON(the_json);
      }
    };
    VMM.appendAndGetElement = function(append_to_element, tag, cName, content) {
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
      if ((content != null) && content !== "") {
        _content = content;
      }
      if (typeof jQuery !== "undefined") {
        e = jQuery(tag);
        e.addClass(_class);
        e.html(_content);
        jQuery(append_to_element).append(e);
      }
      return e;
    };
    VMM.Lib = {
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
          return VMM.Lib.attribute(element, aName, value);
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
          VMM.Lib.css(element, "-webkit-transition", "all " + __duration + " ease");
          VMM.Lib.css(element, "-moz-transition", "all " + __duration + " ease");
          VMM.Lib.css(element, "-o-transition", "all " + __duration + " ease");
          VMM.Lib.css(element, "-ms-transition", "all " + __duration + " ease");
          VMM.Lib.css(element, "transition", "all " + __duration + " ease");
          return VMM.Lib.cssmultiple(element, _att);
        } else {
          if (typeof jQuery !== "undefined") {
            return jQuery(element).delay(delay).animate(att, {
              duration: duration,
              easing: ease
            });
          }
        }
      },
      animate: function(element, duration, ease, att, que, callback_function) {
        var x, __duration, _att, _duration, _ease, _que, _tdd;

        _ease = "easein";
        _que = false;
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
        if ((que != null) && que !== "") {
          _que = que;
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
              VMM.Lib.css(element, "-webkit-transition", x + " " + __duration + _ease);
              VMM.Lib.css(element, "-moz-transition", x + " " + __duration + _ease);
              VMM.Lib.css(element, "-o-transition", x + " " + __duration + _ease);
              VMM.Lib.css(element, "-ms-transition", x + " " + __duration + _ease);
              VMM.Lib.css(element, "transition", x + " " + __duration + _ease);
            }
          }
          return VMM.Lib.cssmultiple(element, _att);
        } else {
          if (typeof jQuery !== "undefined") {
            if ((callback_function != null) && callback_function !== "") {
              return jQuery(element).animate(_att, {
                queue: _que,
                duration: _duration,
                easing: _ease,
                complete: callback_function
              });
            } else {
              return jQuery(element).animate(_att, {
                queue: _que,
                duration: _duration,
                easing: _ease
              });
            }
          }
        }
      }
    };
    (function(jQuery) {
      if (window.XDomainRequest) {
        jQuery.ajaxTransport(function(s) {
          var xdr;

          if (s.crossDomain && s.async) {
            if (s.timeout) {
              s.xdrTimeout = s.timeout;
              delete s.timeout;
            }
            xdr = void 0;
            return {
              send: function(_, complete) {
                var callback;

                callback = function(status, statusText, responses, responseHeaders) {
                  xdr.onload = xdr.onerror = xdr.ontimeout = jQuery.noop;
                  xdr = undefined;
                  complete(status, statusText, responses, responseHeaders);
                };
                xdr = new XDomainRequest();
                xdr.open(s.type, s.url);
                xdr.onload = function() {
                  callback(200, "OK", {
                    text: xdr.responseText
                  }, "Content-Type: " + xdr.contentType);
                };
                xdr.onerror = function() {
                  callback(404, "Not Found");
                };
                if (s.xdrTimeout) {
                  xdr.ontimeout = function() {
                    callback(0, "timeout");
                  };
                  xdr.timeout = s.xdrTimeout;
                }
                xdr.send((s.hasContent && s.data) || null);
              },
              abort: function() {
                if (xdr) {
                  xdr.onerror = jQuery.noop();
                  xdr.abort();
                }
              }
            };
          }
        });
      }
    })(jQuery);
    jQuery.easing["jswing"] = jQuery.easing["swing"];
    return jQuery.extend(jQuery.easing, {
      def: "easeOutQuad",
      swing: function(x, t, b, c, d) {
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
      },
      easeInExpo: function(x, t, b, c, d) {
        if (t === 0) {
          return b;
        } else {
          return c * Math.pow(2, 10 * (t / d - 1)) + b;
        }
      },
      easeOutExpo: function(x, t, b, c, d) {
        if (t === d) {
          return b + c;
        } else {
          return c * (-Math.pow(2, -10 * t / d) + 1) + b;
        }
      },
      easeInOutExpo: function(x, t, b, c, d) {
        if (t === 0) {
          return b;
        }
        if (t === d) {
          return b + c;
        }
        if ((t /= d / 2) < 1) {
          return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        }
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
      },
      easeInQuad: function(x, t, b, c, d) {
        return c * (t /= d) * t + b;
      },
      easeOutQuad: function(x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
      },
      easeInOutQuad: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) {
          return c / 2 * t * t + b;
        }
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
      }
    });
  });

}).call(this);
