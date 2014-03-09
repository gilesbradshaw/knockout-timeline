(function() {
  define(["VMM", "trace", "type", "VMM.Date", "VMM.Library", "VMM.Slider", "VMM.TextElement"], function(VMM, trace, type, vDate, library) {
    return VMM.Slider.Slide = function(d, _parent) {
      var $media, $slide, $text, $wrap, buildSlide, c, data, element, is_skinny, loaded, media, preloaded, reLayout, reloadLayout, removeSlide, render, slide, timer, times, _class, _enqueue, _id, _removeque;

      $media = void 0;
      $text = void 0;
      $slide = void 0;
      $wrap = void 0;
      element = void 0;
      c = void 0;
      data = d;
      slide = {};
      element = "";
      media = "";
      loaded = false;
      preloaded = false;
      is_skinny = false;
      _enqueue = true;
      _removeque = false;
      _id = "slide_";
      _class = 0;
      timer = {
        pushque: "",
        render: "",
        relayout: "",
        remove: "",
        skinny: false
      };
      times = {
        pushque: 500,
        render: 100,
        relayout: 100,
        remove: 30000
      };
      _id = _id + data.uniqueid;
      this.enqueue = _enqueue;
      this.id = _id;
      element = VMM.appendAndGetElement(_parent, "<div>", "slider-item");
      if (typeof data.classname !== "undefined") {
        trace("HAS CLASSNAME");
        library.addClass(element, data.classname);
      } else {
        trace("NO CLASSNAME");
        trace(data);
      }
      c = {
        slide: "",
        text: "",
        media: "",
        media_element: "",
        layout: "content-container layout",
        has: {
          headline: false,
          text: false,
          media: false
        }
      };
      this.show = function(skinny) {
        _enqueue = false;
        timer.skinny = skinny;
        _removeque = false;
        clearTimeout(timer.remove);
        if (!loaded) {
          if (preloaded) {
            clearTimeout(timer.relayout);
            timer.relayout = setTimeout(reloadLayout, times.relayout);
          } else {
            render(skinny);
          }
        }
      };
      this.hide = function() {
        if (loaded && !_removeque) {
          _removeque = true;
          clearTimeout(timer.remove);
          timer.remove = setTimeout(removeSlide, times.remove);
        }
      };
      this.clearTimers = function() {
        clearTimeout(timer.relayout);
        clearTimeout(timer.pushque);
        clearTimeout(timer.render);
      };
      this.layout = function(skinny) {
        if (loaded && preloaded) {
          reLayout(skinny);
        }
      };
      this.elem = function() {
        return element;
      };
      this.position = function() {
        return library.position(element);
      };
      this.leftpos = function(p) {
        if (typeof p !== "undefined") {
          return library.css(element, "left", p);
        } else {
          return library.position(element).left;
        }
      };
      this.animate = function(d, e, p) {
        library.animate(element, d, e, p);
      };
      this.css = function(p, v) {
        library.css(element, p, v);
      };
      this.opacity = function(p) {
        library.css(element, "opacity", p);
      };
      this.width = function() {
        return library.width(element);
      };
      this.height = function() {
        return library.height(element);
      };
      this.content_height = function() {
        var ch;

        ch = library.find(element, ".content")[0];
        if (ch !== "undefined" && (ch != null)) {
          return library.height(ch);
        } else {
          return 0;
        }
      };
      render = function(skinny) {
        trace("RENDER " + _id);
        loaded = true;
        preloaded = true;
        timer.skinny = skinny;
        buildSlide();
        clearTimeout(timer.pushque);
        clearTimeout(timer.render);
        timer.pushque = setTimeout(VMM.ExternalAPI.pushQues, times.pushque);
      };
      removeSlide = function() {
        trace("REMOVE SLIDE TIMER FINISHED");
        loaded = false;
        library.detach($text);
        library.detach($media);
      };
      reloadLayout = function() {
        loaded = true;
        reLayout(timer.skinny, true);
      };
      reLayout = function(skinny, reload) {
        if (c.has.text) {
          if (skinny) {
            if (!is_skinny || reload) {
              library.removeClass($slide, "pad-left");
              library.detach($text);
              library.detach($media);
              library.append($slide, $text);
              library.append($slide, $media);
              is_skinny = true;
            }
          } else {
            if (is_skinny || reload) {
              library.addClass($slide, "pad-left");
              library.detach($text);
              library.detach($media);
              library.append($slide, $media);
              library.append($slide, $text);
              is_skinny = false;
            }
          }
        } else if (reload) {
          if (c.has.headline) {
            library.detach($text);
            library.append($slide, $text);
          }
          library.detach($media);
          library.append($slide, $media);
        }
      };
      buildSlide = function() {
        var dontcrashjs2coffee, en, st, tag;

        trace("BUILDSLIDE");
        $wrap = VMM.appendAndGetElement(element, "<div>", "content");
        $slide = VMM.appendAndGetElement($wrap, "<div>");
        if ((data.startdate != null) && data.startdate !== "") {
          if (type.of(data.startdate) === "date") {
            if (data.type !== "start") {
              st = vDate.prettyDate(data.startdate, false, data.precisiondate);
              en = vDate.prettyDate(data.enddate, false, data.precisiondate);
              tag = "";
              if ((data.tag != null) && data.tag !== "") {
                tag = VMM.createElement("span", data.tag, "slide-tag");
              }
              if (st !== en) {
                c.text += VMM.createElement("h2", st + " &mdash; " + en + tag, "date");
              } else {
                c.text += VMM.createElement("h2", st + tag, "date");
              }
            }
          }
        }
        if ((data.headline != null) && data.headline !== "") {
          c.has.headline = true;
          if (data.type === "start") {
            c.text += VMM.createElement("h2", VMM.Util.linkify_with_twitter(data.headline, "_blank"), "start");
          } else {
            c.text += VMM.createElement("h3", VMM.Util.linkify_with_twitter(data.headline, "_blank"));
          }
        }
        if ((data.text != null) && data.text !== "") {
          c.has.text = true;
          c.text += VMM.createElement("p", VMM.Util.linkify_with_twitter(data.text, "_blank"));
        }
        if (c.has.text || c.has.headline) {
          c.text = VMM.createElement("div", c.text, "container");
          $text = VMM.appendAndGetElement($slide, "<div>", "text", VMM.TextElement.create(c.text));
        }
        if (data.needs_slug) {
          dontcrashjs2coffee = 0;
        }
        if ((data.asset != null) && data.asset !== "") {
          if ((data.asset.media != null) && data.asset.media !== "") {
            c.has.media = true;
            $media = VMM.appendAndGetElement($slide, "<div>", "media", VMM.MediaElement.create(data.asset, data.uniqueid));
          }
        }
        if (c.has.text) {
          c.layout += "-text";
        }
        if (c.has.media) {
          c.layout += "-media";
        }
        if (c.has.text) {
          if (timer.skinny) {
            library.addClass($slide, c.layout);
            is_skinny = true;
          } else {
            library.addClass($slide, c.layout);
            library.addClass($slide, "pad-left");
            library.detach($text);
            library.append($slide, $text);
          }
        } else {
          library.addClass($slide, c.layout);
        }
      };
    };
  });

}).call(this);
