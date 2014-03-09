(function() {
  define(["VMM", "trace"], function(VMM, trace) {
    return VMM.Util = {
      init: function() {
        return this;
      },
      removeRange: function(array, from, to) {
        var rest;

        rest = array.slice((to || from) + 1 || array.length);
        array.length = (from < 0 ? array.length + from : from);
        return array.push.apply(array, rest);
      },
      correctProtocol: function(url) {
        var loc, prefix, the_url;

        loc = window.parent.location.protocol.toString();
        prefix = "";
        the_url = url.split("://", 2);
        if (loc.match("http")) {
          prefix = loc;
        } else {
          prefix = "https";
        }
        return prefix + "://" + the_url[1];
      },
      mergeConfig: function(config_main, config_to_merge) {
        var x;

        x = void 0;
        for (x in config_to_merge) {
          if (Object.prototype.hasOwnProperty.call(config_to_merge, x)) {
            config_main[x] = config_to_merge[x];
          }
        }
        return config_main;
      },
      getObjectAttributeByIndex: function(obj, index) {
        var attr, i;

        if (typeof obj !== "undefined") {
          i = 0;
          for (attr in obj) {
            if (index === i) {
              return obj[attr];
            }
            i++;
          }
          return "";
        } else {
          return "";
        }
      },
      ordinal: function(n) {
        return ["th", "st", "nd", "rd"][(!(((n % 10) > 3) || (Math.floor(n % 100 / 10) === 1))) * (n % 10)];
      },
      randomBetween: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      },
      average: function(a) {
        var l, m, r, s, t;

        r = {
          mean: 0,
          variance: 0,
          deviation: 0
        };
        t = a.length;
        m = void 0;
        s = 0;
        l = t;
        while (l--) {
          s += a[l];
        }
        m = r.mean = s / t;
        l = t;
        s = 0;
        while (l--) {
          s += Math.pow(a[l] - m, 2);
        }
        r.deviation = Math.sqrt(r.variance = s / t);
        return r;
      },
      customSort: function(a, b) {
        var a1, b1;

        a1 = a;
        b1 = b;
        if (a1 === b1) {
          return 0;
        }
        if (a1 > b1) {
          return 1;
        } else {
          return -1;
        }
      },
      deDupeArray: function(arr) {
        var i, len, obj, out;

        i = void 0;
        len = arr.length;
        out = [];
        obj = {};
        i = 0;
        while (i < len) {
          obj[arr[i]] = 0;
          i++;
        }
        for (i in obj) {
          out.push(i);
        }
        return out;
      },
      number2money: function(n, symbol, padding) {
        var formatted, number;

        symbol = (symbol !== null ? symbol : true);
        padding = (padding !== null ? padding : false);
        number = VMM.Math2.floatPrecision(n, 2);
        formatted = this.niceNumber(number);
        if (!formatted.split(/\./g)[1] && padding) {
          formatted = formatted + ".00";
        }
        if (symbol) {
          formatted = "$" + formatted;
        }
        return formatted;
      },
      wordCount: function(s) {
        var cleanedStr, fullStr, initial_whitespace_rExp, left_trimmedStr, non_alphanumerics_rExp, splitString, word_count;

        fullStr = s + " ";
        initial_whitespace_rExp = /^[^A-Za-z0-9\'\-]+/g;
        left_trimmedStr = fullStr.replace(initial_whitespace_rExp, "");
        non_alphanumerics_rExp = /[^A-Za-z0-9\'\-]+/g;
        cleanedStr = left_trimmedStr.replace(non_alphanumerics_rExp, " ");
        splitString = cleanedStr.split(" ");
        word_count = splitString.length - 1;
        if (fullStr.length < 2) {
          word_count = 0;
        }
        return word_count;
      },
      ratio: {
        fit: function(w, h, ratio_w, ratio_h) {
          var _fit;

          _fit = {
            width: 0,
            height: 0
          };
          _fit.width = w;
          _fit.height = Math.round((w / ratio_w) * ratio_h);
          if (_fit.height > h) {
            _fit.height = h;
            _fit.width = Math.round((h / ratio_h) * ratio_w);
            if (_fit.width > w) {
              trace("FIT: DIDN'T FIT!!! ");
            }
          }
          return _fit;
        },
        r16_9: function(w, h) {
          if (w !== null && w !== "") {
            return Math.round((h / 16) * 9);
          } else {
            if (h !== null && h !== "") {
              return Math.round((w / 9) * 16);
            }
          }
        },
        r4_3: function(w, h) {
          if (w !== null && w !== "") {
            return Math.round((h / 4) * 3);
          } else {
            if (h !== null && h !== "") {
              return Math.round((w / 3) * 4);
            }
          }
        }
      },
      doubledigit: function(n) {
        return (n < 10 ? "0" : "") + n;
      },
      truncateWords: function(s, min, max) {
        var i, initial_whitespace_rExp, j, left_trimmedStr, result, word, words;

        if (!min) {
          min = 30;
        }
        if (!max) {
          max = min;
        }
        initial_whitespace_rExp = /^[^A-Za-z0-9\'\-]+/g;
        left_trimmedStr = s.replace(initial_whitespace_rExp, "");
        words = left_trimmedStr.split(" ");
        result = [];
        min = Math.min(words.length, min);
        max = Math.min(words.length, max);
        i = 0;
        while (i < min) {
          result.push(words[i]);
          i++;
        }
        j = min;
        while (i < max) {
          word = words[i];
          result.push(word);
          if (word.charAt(word.length - 1) === ".") {
            break;
          }
          i++;
        }
        return result.join(" ");
      },
      linkify: function(text, targets, is_touch) {
        var emailAddressPattern, pseudoUrlPattern, urlPattern;

        urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/g;
        pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/g;
        emailAddressPattern = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/g;
        return text.replace(urlPattern, "<a target='_blank' href='$&' onclick='void(0)'>$&</a>").replace(pseudoUrlPattern, "$1<a target='_blank' onclick='void(0)' href='http://$2'>$2</a>").replace(emailAddressPattern, "<a target='_blank' onclick='void(0)' href='mailto:$1'>$1</a>");
      },
      linkify_with_twitter: function(text, targets, is_touch) {
        var emailAddressPattern, pseudoUrlPattern, replaceURLWithHTMLLinks, twitterHandlePattern, twitterSearchPattern, urlPattern, url_pattern, url_replace;

        replaceURLWithHTMLLinks = function(text) {
          var exp;

          exp = /(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/g;
          return text.replace(exp, "<a href='$1' target='_blank'>$3</a>");
        };
        urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/g;
        url_pattern = /(\()((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\))|(\[)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\])|(\{)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\})|(<|&(?:lt|#60|#x3c);)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(>|&(?:gt|#62|#x3e);)|((?:^|[^=\s'"\]])\s*['"]?|[^=\s]\s+)(\b(?:ht|f)tps?:\/\/[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]+(?:(?!&(?:gt|#0*62|#x0*3e);|&(?:amp|apos|quot|#0*3[49]|#x0*2[27]);[.!&',:?;]?(?:[^a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]|$))&[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]*)*[a-z0-9\-_~$()*+=\/#[\]@%])/g;
        url_replace = "$1$4$7$10$13<a href=\"$2$5$8$11$14\" target=\"_blank\" class=\"hyphenate\">$2$5$8$11$14</a>$3$6$9$12";
        pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/g;
        emailAddressPattern = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/g;
        twitterHandlePattern = /\B@([\w-]+)/g;
        twitterSearchPattern = /(#([\w]+))/g;
        return text.replace(url_pattern, url_replace).replace(pseudoUrlPattern, "$1<a target='_blank' class='hyphenate' onclick='void(0)' href='http://$2'>$2</a>").replace(emailAddressPattern, "<a target='_blank' onclick='void(0)' href='mailto:$1'>$1</a>").replace(twitterHandlePattern, "<a href='http://twitter.com/$1' target='_blank' onclick='void(0)'>@$1</a>");
      },
      linkify_wikipedia: function(text) {
        var urlPattern;

        urlPattern = /<i[^>]*>(.*?)<\/i>/g;
        return text.replace(urlPattern, "<a target='_blank' href='http://en.wikipedia.org/wiki/$&' onclick='void(0)'>$&</a>").replace(/<i\b[^>]*>/g, "").replace(/<\/i>/g, "").replace(/<b\b[^>]*>/g, "").replace(/<\/b>/g, "");
      },
      unlinkify: function(text) {
        if (!text) {
          return text;
        }
        text = text.replace(/<a\b[^>]*>/i, "");
        text = text.replace(/<\/a>/i, "");
        return text;
      },
      untagify: function(text) {
        if (!text) {
          return text;
        }
        text = text.replace(/<\s*\w.*?>/g, "");
        return text;
      },
      nl2br: function(text) {
        return text.replace(/(\r\n|[\r\n]|\\n|\\r)/g, "<br/>");
      },
      unique_ID: function(size) {
        var getRandomChar, getRandomNumber, randomID;

        getRandomNumber = function(range) {
          return Math.floor(Math.random() * range);
        };
        getRandomChar = function() {
          var chars;

          chars = "abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
          return chars.substr(getRandomNumber(62), 1);
        };
        randomID = function(size) {
          var i, str;

          str = "";
          i = 0;
          while (i < size) {
            str += getRandomChar();
            i++;
          }
          return str;
        };
        return randomID(size);
      },
      isEven: function(n) {
        if (n % 2 === 0) {
          return true;
        } else {
          return false;
        }
      },
      getUrlVars: function(string) {
        var hash, hashes, i, str, vars;

        str = string.toString();
        if (str.match("&#038;")) {
          str = str.replace("&#038;", "&");
        } else if (str.match("&#38;")) {
          str = str.replace("&#38;", "&");
        } else {
          if (str.match("&amp;")) {
            str = str.replace("&amp;", "&");
          }
        }
        vars = [];
        hash = void 0;
        hashes = str.slice(str.indexOf("?") + 1).split("&");
        i = 0;
        while (i < hashes.length) {
          hash = hashes[i].split("=");
          vars.push(hash[0]);
          vars[hash[0]] = hash[1];
          i++;
        }
        return vars;
      },
      toHTML: function(text) {
        text = this.nl2br(text);
        text = this.linkify(text);
        return text.replace(/\s\s/g, "&nbsp;&nbsp;");
      },
      toCamelCase: function(s, forceLowerCase) {
        var i, sps;

        if (forceLowerCase !== false) {
          forceLowerCase = true;
        }
        sps = (forceLowerCase ? s.toLowerCase() : s).split(" ");
        i = 0;
        while (i < sps.length) {
          sps[i] = sps[i].substr(0, 1).toUpperCase() + sps[i].substr(1);
          i++;
        }
        return sps.join(" ");
      },
      properQuotes: function(str) {
        return str.replace(/\"([^\"]*)\"/g, "&#8220;$1&#8221;");
      },
      niceNumber: function(nStr) {
        var rgx, x, x1, x2;

        nStr += "";
        x = nStr.split(".");
        x1 = x[0];
        x2 = (x.length > 1 ? "." + x[1] : "");
        rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, "$1" + "," + "$2");
        }
        return x1 + x2;
      },
      toTitleCase: function(t) {
        var __TitleCase;

        if (VMM.Browser.browser === "Explorer" && parseInt(VMM.Browser.version, 10) >= 7) {
          return t.replace("_", "%20");
        } else {
          __TitleCase = {
            __smallWords: ["a", "an", "and", "as", "at", "but", "by", "en", "for", "if", "in", "of", "on", "or", "the", "to", "v[.]?", "via", "vs[.]?"],
            init: function() {
              this.__smallRE = this.__smallWords.join("|");
              this.__lowerCaseWordsRE = new RegExp("\\b(" + this.__smallRE + ")\\b", "gi");
              this.__firstWordRE = new RegExp("^([^a-zA-Z0-9 \\r\\n\\t]*)(" + this.__smallRE + ")\\b", "gi");
              this.__lastWordRE = new RegExp("\\b(" + this.__smallRE + ")([^a-zA-Z0-9 \\r\\n\\t]*)$", "gi");
            },
            toTitleCase: function(string) {
              var i, line, s, split;

              line = "";
              split = string.split(/([:.;?!][ ]|(?:[ ]|^)["“])/);
              i = 0;
              while (i < split.length) {
                s = split[i];
                s = s.replace(/\b([a-zA-Z][a-z.'’]*)\b/g, this.__titleCaseDottedWordReplacer);
                s = s.replace(this.__lowerCaseWordsRE, this.__lowerReplacer);
                s = s.replace(this.__firstWordRE, this.__firstToUpperCase);
                s = s.replace(this.__lastWordRE, this.__firstToUpperCase);
                line += s;
                ++i;
              }
              line = line.replace(RegExp(" V(s?)\\. ", "g"), " v$1. ");
              line = line.replace(/(['’])S\b/g, "$1s");
              line = line.replace(/\b(AT&T|Q&A)\b/g, this.__upperReplacer);
              return line;
            },
            __titleCaseDottedWordReplacer: function(w) {
              if (w.match(/[a-zA-Z][.][a-zA-Z]/)) {
                return w;
              } else {
                return __TitleCase.__firstToUpperCase(w);
              }
            },
            __lowerReplacer: function(w) {
              return w.toLowerCase();
            },
            __upperReplacer: function(w) {
              return w.toUpperCase();
            },
            __firstToUpperCase: function(w) {
              var split;

              split = w.split(/(^[^a-zA-Z0-9]*[a-zA-Z0-9])(.*)$/);
              if (split[1]) {
                split[1] = split[1].toUpperCase();
              }
              return split.join("");
            }
          };
          __TitleCase.init();
          t = t.replace(/_/g, " ");
          t = __TitleCase.toTitleCase(t);
          return t;
        }
      }
    }.init();
  });

}).call(this);
