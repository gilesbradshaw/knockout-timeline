(function() {
  define([], function() {
    var Browser;

    Browser = {
      init: function() {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
        this.device = this.searchDevice(navigator.userAgent);
        this.orientation = this.searchOrientation(window.orientation);
      },
      searchOrientation: function(orientation) {
        var orient;

        orient = "";
        if (orientation === 0 || orientation === 180) {
          orient = "portrait";
        } else if (orientation === 90 || orientation === -90) {
          orient = "landscape";
        } else {
          orient = "normal";
        }
        return orient;
      },
      searchDevice: function(d) {
        var device;

        device = "";
        if (d.match(/Android/i) || d.match(/iPhone|iPod/i)) {
          device = "mobile";
        } else if (d.match(/iPad/i)) {
          device = "tablet";
        } else if (d.match(/BlackBerry/i) || d.match(/IEMobile/i)) {
          device = "other mobile";
        } else {
          device = "desktop";
        }
        return device;
      },
      searchString: function(data) {
        var dataProp, dataString, i;

        i = 0;
        while (i < data.length) {
          dataString = data[i].string;
          dataProp = data[i].prop;
          this.versionSearchString = data[i].versionSearch || data[i].identity;
          if (dataString) {
            if (dataString.indexOf(data[i].subString) !== -1) {
              return data[i].identity;
            }
          } else {
            if (dataProp) {
              return data[i].identity;
            }
          }
          i++;
        }
      },
      searchVersion: function(dataString) {
        var index;

        index = dataString.indexOf(this.versionSearchString);
        if (index === -1) {
          return;
        }
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
      },
      dataBrowser: [
        {
          string: navigator.userAgent,
          subString: "Chrome",
          identity: "Chrome"
        }, {
          string: navigator.userAgent,
          subString: "OmniWeb",
          versionSearch: "OmniWeb/",
          identity: "OmniWeb"
        }, {
          string: navigator.vendor,
          subString: "Apple",
          identity: "Safari",
          versionSearch: "Version"
        }, {
          prop: window.opera,
          identity: "Opera",
          versionSearch: "Version"
        }, {
          string: navigator.vendor,
          subString: "iCab",
          identity: "iCab"
        }, {
          string: navigator.vendor,
          subString: "KDE",
          identity: "Konqueror"
        }, {
          string: navigator.userAgent,
          subString: "Firefox",
          identity: "Firefox"
        }, {
          string: navigator.vendor,
          subString: "Camino",
          identity: "Camino"
        }, {
          string: navigator.userAgent,
          subString: "Netscape",
          identity: "Netscape"
        }, {
          string: navigator.userAgent,
          subString: "MSIE",
          identity: "Explorer",
          versionSearch: "MSIE"
        }, {
          string: navigator.userAgent,
          subString: "Gecko",
          identity: "Mozilla",
          versionSearch: "rv"
        }, {
          string: navigator.userAgent,
          subString: "Mozilla",
          identity: "Netscape",
          versionSearch: "Mozilla"
        }
      ],
      dataOS: [
        {
          string: navigator.platform,
          subString: "Win",
          identity: "Windows"
        }, {
          string: navigator.platform,
          subString: "Mac",
          identity: "Mac"
        }, {
          string: navigator.userAgent,
          subString: "iPhone",
          identity: "iPhone/iPod"
        }, {
          string: navigator.userAgent,
          subString: "iPad",
          identity: "iPad"
        }, {
          string: navigator.platform,
          subString: "Linux",
          identity: "Linux"
        }
      ]
    };
    Browser.init();
    return Browser;
  });

}).call(this);
