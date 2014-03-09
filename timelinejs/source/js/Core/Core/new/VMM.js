/*
VéritéCo JS Core
Designed and built by Zach Wise at VéritéCo zach@verite.co

This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/


(function() {
  define(["Class"], function(Class) {
    var VMM;

    VMM = Class.extend({});
    VMM.debug = true;
    VMM.master_config = {
      init: function() {
        return this;
      },
      sizes: {
        api: {
          width: 0,
          height: 0
        }
      },
      vp: "Pellentesque nibh felis, eleifend id, commodo in, interdum vitae, leo",
      api_keys_master: {
        flickr: "RAIvxHY4hE/Elm5cieh4X5ptMyDpj7MYIxziGxi0WGCcy1s+yr7rKQ==",
        google: "uQKadH1VMlCsp560gN2aOiMz4evWkl1s34yryl3F/9FJOsn+/948CbBUvKLN46U=",
        twitter: ""
      },
      timers: {
        api: 7000
      },
      api: {
        pushques: []
      },
      twitter: {
        active: false,
        array: [],
        api_loaded: false,
        que: []
      },
      flickr: {
        active: false,
        array: [],
        api_loaded: false,
        que: []
      },
      youtube: {
        active: false,
        array: [],
        api_loaded: false,
        que: []
      },
      vimeo: {
        active: false,
        array: [],
        api_loaded: false,
        que: []
      },
      vine: {
        active: false,
        array: [],
        api_loaded: false,
        que: []
      },
      webthumb: {
        active: false,
        array: [],
        api_loaded: false,
        que: []
      },
      googlemaps: {
        active: false,
        map_active: false,
        places_active: false,
        array: [],
        api_loaded: false,
        que: []
      },
      googledocs: {
        active: false,
        array: [],
        api_loaded: false,
        que: []
      },
      googleplus: {
        active: false,
        array: [],
        api_loaded: false,
        que: []
      },
      wikipedia: {
        active: false,
        array: [],
        api_loaded: false,
        que: [],
        tries: 0
      },
      soundcloud: {
        active: false,
        array: [],
        api_loaded: false,
        que: []
      }
    }.init();
    VMM.createElement = function(tag, value, cName, attrs, styles) {
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
    };
    VMM.createMediaElement = function(media, caption, credit) {
      var ce, valid, _valid;

      ce = "";
      _valid = false;
      ce += "<div class='media'>";
      if ((media != null) && media !== "") {
        valid = true;
        ce += "<img src='" + media + "'>";
        if ((credit != null) && credit !== "") {
          ce += VMM.createElement("div", credit, "credit");
        }
        if ((caption != null) && caption !== "") {
          ce += VMM.createElement("div", caption, "caption");
        }
      }
      ce += "</div>";
      return ce;
    };
    VMM.hideUrlBar = function() {
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
    };
    return VMM;
  });

}).call(this);
