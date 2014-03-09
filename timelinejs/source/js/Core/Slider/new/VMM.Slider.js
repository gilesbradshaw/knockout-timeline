(function() {
  define(["VMM", "trace"], function(VMM, trace) {
    return VMM.Slider = function(parent, parent_config) {
      var $dragslide, $explainer, $slider, $slider_container, $slider_mask, $slides_items, backToCurrentSlide, build, buildNavigation, buildSlides, config, content, current_slide, current_width, data, detachMessege, events, getData, goToSlide, hideMessege, layout, navigation, onConfigSet, onDragFinish, onExplainerClick, onKeypressNav, onNextClick, onPrevClick, onTouchUpdate, opacitySlides, positionSlides, preloadSlides, preloadTimeOutSlides, reSize, showMessege, sizeSlide, sizeSlides, slide_positions, slides, slides_content, timer, touch, upDate, _active;

      config = void 0;
      timer = void 0;
      $slider = void 0;
      $slider_mask = void 0;
      $slider_container = void 0;
      $slides_items = void 0;
      $dragslide = void 0;
      $explainer = void 0;
      events = {};
      data = [];
      slides = [];
      slide_positions = [];
      slides_content = "";
      current_slide = 0;
      current_width = 960;
      onConfigSet = function() {
        trace("onConfigSet");
      };
      reSize = function(go_to_slide, from_start) {
        var _from_start, _go_to_slide;

        _go_to_slide = true;
        _from_start = false;
        if (go_to_slide != null) {
          _go_to_slide = go_to_slide;
        }
        if (from_start != null) {
          _from_start = from_start;
        }
        current_width = config.slider.width;
        config.slider.nav.height = VMM.Lib.height(navigation.prevBtnContainer);
        if (VMM.Browser.device === "mobile" || current_width <= 640) {
          config.slider.content.padding = 10;
        } else {
          config.slider.content.padding = config.slider.content.padding_default;
        }
        config.slider.content.width = current_width - (config.slider.content.padding * 2);
        VMM.Lib.width($slides_items, slides.length * config.slider.content.width);
        if (_from_start) {
          VMM.Lib.css($slider_container, "left", slides[current_slide].leftpos());
        }
        sizeSlides();
        positionSlides();
        VMM.Lib.css(navigation.nextBtn, "left", current_width - config.slider.nav.width);
        VMM.Lib.height(navigation.prevBtn, config.slider.height);
        VMM.Lib.height(navigation.nextBtn, config.slider.height);
        VMM.Lib.css(navigation.nextBtnContainer, "top", ((config.slider.height / 2) - (config.slider.nav.height / 2)) + 10);
        VMM.Lib.css(navigation.prevBtnContainer, "top", ((config.slider.height / 2) - (config.slider.nav.height / 2)) + 10);
        VMM.Lib.height($slider_mask, config.slider.height);
        VMM.Lib.width($slider_mask, current_width);
        if (_go_to_slide) {
          goToSlide(current_slide, "linear", 1);
        }
        if (current_slide === 0) {
          return VMM.Lib.visible(navigation.prevBtn, false);
        }
      };
      onDragFinish = function(e, d) {
        trace("DRAG FINISH");
        trace(d.left_adjust);
        trace(config.slider.width / 2);
        if (d.left_adjust < 0) {
          if (Math.abs(d.left_adjust) > (config.slider.width / 2)) {
            if (current_slide === slides.length - 1) {
              return backToCurrentSlide();
            } else {
              goToSlide(current_slide + 1, "easeOutExpo");
              return upDate();
            }
          } else {
            return backToCurrentSlide();
          }
        } else if (Math.abs(d.left_adjust) > (config.slider.width / 2)) {
          if (current_slide === 0) {
            return backToCurrentSlide();
          } else {
            goToSlide(current_slide - 1, "easeOutExpo");
            return upDate();
          }
        } else {
          return backToCurrentSlide();
        }
      };
      onNextClick = function(e) {
        if (current_slide === slides.length - 1) {
          return backToCurrentSlide();
        } else {
          goToSlide(current_slide + 1);
          return upDate();
        }
      };
      onPrevClick = function(e) {
        if (current_slide === 0) {
          return backToCurrentSlide();
        } else {
          goToSlide(current_slide - 1);
          return upDate();
        }
      };
      onKeypressNav = function(e) {
        switch (e.keyCode) {
          case 39:
            return onNextClick(e);
          case 37:
            return onPrevClick(e);
        }
      };
      onTouchUpdate = function(e, b) {
        var i, _pos, _slide_pos;

        if (slide_positions.length === 0) {
          i = 0;
          while (i < slides.length) {
            slide_positions.push(slides[i].leftpos());
            i++;
          }
        }
        if (typeof b.left === "number") {
          _pos = b.left;
          _slide_pos = -(slides[current_slide].leftpos());
          if (_pos < _slide_pos - (config.slider_width / 3)) {
            onNextClick();
          } else if (_pos > _slide_pos + (config.slider_width / 3)) {
            onPrevClick();
          } else {
            VMM.Lib.animate($slider_container, config.duration, config.ease, {
              left: _slide_pos
            });
          }
        } else {
          VMM.Lib.animate($slider_container, config.duration, config.ease, {
            left: _slide_pos
          });
        }
        if (typeof b.top === "number") {
          return VMM.Lib.animate($slider_container, config.duration, config.ease, {
            top: -b.top
          });
        } else {

        }
      };
      onExplainerClick = function(e) {
        return detachMessege();
      };
      upDate = function() {
        config.current_slide = current_slide;
        return VMM.fireEvent(layout, "UPDATE");
      };
      getData = function(d) {
        return data = d;
      };
      buildSlides = function(d) {
        var i, _results, _slide;

        i = 0;
        VMM.attachElement($slides_items, "");
        slides = [];
        i = 0;
        _results = [];
        while (i < d.length) {
          _slide = new VMM.Slider.Slide(d[i], $slides_items);
          slides.push(_slide);
          _results.push(i++);
        }
        return _results;
      };
      preloadSlides = function(skip) {
        var i;

        i = 0;
        if (skip) {
          return preloadTimeOutSlides();
        } else {
          i = 0;
          while (i < slides.length) {
            slides[i].clearTimers();
            i++;
          }
          return timer = setTimeout(preloadTimeOutSlides, config.duration);
        }
      };
      preloadTimeOutSlides = function() {
        var i;

        i = 0;
        i = 0;
        while (i < slides.length) {
          slides[i].enqueue = true;
          i++;
        }
        i = 0;
        while (i < config.preload) {
          if (!((current_slide + i) > slides.length - 1)) {
            slides[current_slide + i].show();
            slides[current_slide + i].enqueue = false;
          }
          if (!((current_slide - i) < 0)) {
            slides[current_slide - i].show();
            slides[current_slide - i].enqueue = false;
          }
          i++;
        }
        if (slides.length > 50) {
          i = 0;
          while (i < slides.length) {
            if (slides[i].enqueue) {
              slides[i].hide();
            }
            i++;
          }
        }
        return sizeSlides();
      };
      sizeSlide = function(slide_id) {};
      sizeSlides = function() {
        var i, is_skinny, layout_both, layout_caption, layout_media, layout_text_media, mediasize, _results;

        i = 0;
        layout_text_media = ".slider-item .layout-text-media .media .media-container ";
        layout_media = ".slider-item .layout-media .media .media-container ";
        layout_both = ".slider-item .media .media-container";
        layout_caption = ".slider-item .media .media-container .media-shadow .caption";
        is_skinny = false;
        mediasize = {
          text_media: {
            width: (config.slider.content.width / 100) * 60,
            height: config.slider.height - 60,
            video: {
              width: 0,
              height: 0
            },
            text: {
              width: ((config.slider.content.width / 100) * 40) - 30,
              height: config.slider.height
            }
          },
          media: {
            width: config.slider.content.width,
            height: config.slider.height - 110,
            video: {
              width: 0,
              height: 0
            }
          }
        };
        if (VMM.Browser.device === "mobile" || current_width < 641) {
          is_skinny = true;
        }
        VMM.master_config.sizes.api.width = mediasize.media.width;
        VMM.master_config.sizes.api.height = mediasize.media.height;
        mediasize.text_media.video = VMM.Util.ratio.fit(mediasize.text_media.width, mediasize.text_media.height, 16, 9);
        mediasize.media.video = VMM.Util.ratio.fit(mediasize.media.width, mediasize.media.height, 16, 9);
        VMM.Lib.css(".slider-item", "width", config.slider.content.width);
        VMM.Lib.height(".slider-item", config.slider.height);
        if (is_skinny) {
          mediasize.text_media.width = config.slider.content.width - (config.slider.content.padding * 2);
          mediasize.media.width = config.slider.content.width - (config.slider.content.padding * 2);
          mediasize.text_media.height = ((config.slider.height / 100) * 50) - 50;
          mediasize.media.height = ((config.slider.height / 100) * 70) - 40;
          mediasize.text_media.video = VMM.Util.ratio.fit(mediasize.text_media.width, mediasize.text_media.height, 16, 9);
          mediasize.media.video = VMM.Util.ratio.fit(mediasize.media.width, mediasize.media.height, 16, 9);
          VMM.Lib.css(".slider-item .layout-text-media .text", "width", "100%");
          VMM.Lib.css(".slider-item .layout-text-media .text", "display", "block");
          VMM.Lib.css(".slider-item .layout-text-media .text .container", "display", "block");
          VMM.Lib.css(".slider-item .layout-text-media .text .container", "width", mediasize.media.width);
          VMM.Lib.css(".slider-item .layout-text-media .text .container .start", "width", "auto");
          VMM.Lib.css(".slider-item .layout-text-media .media", "float", "none");
          VMM.Lib.addClass(".slider-item .content-container", "pad-top");
          VMM.Lib.css(".slider-item .media blockquote p", "line-height", "18px");
          VMM.Lib.css(".slider-item .media blockquote p", "font-size", "16px");
          VMM.Lib.css(".slider-item", "overflow-y", "auto");
        } else {
          VMM.Lib.css(".slider-item .layout-text-media .text", "width", "40%");
          VMM.Lib.css(".slider-item .layout-text-media .text", "display", "table-cell");
          VMM.Lib.css(".slider-item .layout-text-media .text .container", "display", "table-cell");
          VMM.Lib.css(".slider-item .layout-text-media .text .container", "width", "auto");
          VMM.Lib.css(".slider-item .layout-text-media .text .container .start", "width", mediasize.text_media.text.width);
          VMM.Lib.removeClass(".slider-item .content-container", "pad-top");
          VMM.Lib.css(".slider-item .layout-text-media .media", "float", "left");
          VMM.Lib.css(".slider-item .layout-text-media", "display", "table");
          VMM.Lib.css(".slider-item .media blockquote p", "line-height", "36px");
          VMM.Lib.css(".slider-item .media blockquote p", "font-size", "28px");
          VMM.Lib.css(".slider-item", "display", "table");
          VMM.Lib.css(".slider-item", "overflow-y", "auto");
        }
        VMM.Lib.css(layout_text_media + ".media-frame", "max-width", mediasize.text_media.width);
        VMM.Lib.height(layout_text_media + ".media-frame", mediasize.text_media.height);
        VMM.Lib.width(layout_text_media + ".media-frame", mediasize.text_media.width);
        VMM.Lib.css(layout_text_media + "img", "max-height", mediasize.text_media.height);
        VMM.Lib.css(layout_media + "img", "max-height", mediasize.media.height);
        VMM.Lib.css(layout_text_media + "img", "max-width", mediasize.text_media.width);
        VMM.Lib.css(layout_text_media + ".avatar img", "max-width", 32);
        VMM.Lib.css(layout_text_media + ".avatar img", "max-height", 32);
        VMM.Lib.css(layout_media + ".avatar img", "max-width", 32);
        VMM.Lib.css(layout_media + ".avatar img", "max-height", 32);
        VMM.Lib.css(layout_text_media + ".article-thumb", "max-width", "50%");
        VMM.Lib.css(layout_media + ".article-thumb", "max-width", 200);
        VMM.Lib.width(layout_text_media + ".media-frame", mediasize.text_media.video.width);
        VMM.Lib.height(layout_text_media + ".media-frame", mediasize.text_media.video.height);
        VMM.Lib.width(layout_media + ".media-frame", mediasize.media.video.width);
        VMM.Lib.height(layout_media + ".media-frame", mediasize.media.video.height);
        VMM.Lib.css(layout_media + ".media-frame", "max-height", mediasize.media.video.height);
        VMM.Lib.css(layout_media + ".media-frame", "max-width", mediasize.media.video.width);
        VMM.Lib.height(layout_media + ".soundcloud", 168);
        VMM.Lib.height(layout_text_media + ".soundcloud", 168);
        VMM.Lib.width(layout_media + ".soundcloud", mediasize.media.width);
        VMM.Lib.width(layout_text_media + ".soundcloud", mediasize.text_media.width);
        VMM.Lib.css(layout_both + ".soundcloud", "max-height", 168);
        VMM.Lib.height(layout_text_media + ".map", mediasize.text_media.height);
        VMM.Lib.width(layout_text_media + ".map", mediasize.text_media.width);
        VMM.Lib.css(layout_media + ".map", "max-height", mediasize.media.height);
        VMM.Lib.width(layout_media + ".map", mediasize.media.width);
        VMM.Lib.height(layout_text_media + ".doc", mediasize.text_media.height);
        VMM.Lib.width(layout_text_media + ".doc", mediasize.text_media.width);
        VMM.Lib.height(layout_media + ".doc", mediasize.media.height);
        VMM.Lib.width(layout_media + ".doc", mediasize.media.width);
        VMM.Lib.width(layout_media + ".wikipedia", mediasize.media.width);
        VMM.Lib.width(layout_media + ".twitter", mediasize.media.width);
        VMM.Lib.width(layout_media + ".plain-text-quote", mediasize.media.width);
        VMM.Lib.width(layout_media + ".plain-text", mediasize.media.width);
        VMM.Lib.css(layout_both, "max-width", mediasize.media.width);
        VMM.Lib.css(layout_text_media + ".caption", "max-width", mediasize.text_media.video.width);
        VMM.Lib.css(layout_media + ".caption", "max-width", mediasize.media.video.width);
        i = 0;
        _results = [];
        while (i < slides.length) {
          slides[i].layout(is_skinny);
          if (slides[i].content_height() > config.slider.height + 20) {
            slides[i].css("display", "block");
          } else {
            slides[i].css("display", "table");
          }
          _results.push(i++);
        }
        return _results;
      };
      positionSlides = function() {
        var i, pos, _results;

        pos = 0;
        i = 0;
        i = 0;
        _results = [];
        while (i < slides.length) {
          pos = i * (config.slider.width + config.spacing);
          slides[i].leftpos(pos);
          _results.push(i++);
        }
        return _results;
      };
      opacitySlides = function(n) {
        var i, _ease, _results;

        _ease = "linear";
        i = 0;
        i = 0;
        _results = [];
        while (i < slides.length) {
          if (i === current_slide) {
            slides[i].animate(config.duration, _ease, {
              opacity: 1
            });
          } else if (i === current_slide - 1 || i === current_slide + 1) {
            slides[i].animate(config.duration, _ease, {
              opacity: 0.1
            });
          } else {
            slides[i].opacity(n);
          }
          _results.push(i++);
        }
        return _results;
      };
      goToSlide = function(n, ease, duration, fast, firstrun) {
        var err, is_first, is_last, scroll_height, _duration, _ease, _pos, _title;

        _ease = config.ease;
        _duration = config.duration;
        is_last = false;
        is_first = false;
        _title = "";
        _pos = void 0;
        VMM.ExternalAPI.youtube.stopPlayers();
        current_slide = n;
        _pos = slides[current_slide].leftpos();
        if (current_slide === 0) {
          is_first = true;
        }
        if (current_slide + 1 >= slides.length) {
          is_last = true;
        }
        if ((ease != null) && ease !== "") {
          _ease = ease;
        }
        if ((duration != null) && duration !== "") {
          _duration = duration;
        }
        if (VMM.Browser.device === "mobile") {
          VMM.Lib.visible(navigation.prevBtn, false);
          VMM.Lib.visible(navigation.nextBtn, false);
        } else {
          if (is_first) {
            VMM.Lib.visible(navigation.prevBtn, false);
          } else {
            VMM.Lib.visible(navigation.prevBtn, true);
            _title = VMM.Util.unlinkify(data[current_slide - 1].title);
            if (config.type === "timeline") {
              if (typeof data[current_slide - 1].date === "undefined") {
                VMM.attachElement(navigation.prevDate, _title);
                VMM.attachElement(navigation.prevTitle, "");
              } else {
                VMM.attachElement(navigation.prevDate, VMM.Date.prettyDate(data[current_slide - 1].startdate, false, data[current_slide - 1].precisiondate));
                VMM.attachElement(navigation.prevTitle, _title);
              }
            } else {
              VMM.attachElement(navigation.prevTitle, _title);
            }
          }
          if (is_last) {
            VMM.Lib.visible(navigation.nextBtn, false);
          } else {
            VMM.Lib.visible(navigation.nextBtn, true);
            _title = VMM.Util.unlinkify(data[current_slide + 1].title);
            if (config.type === "timeline") {
              if (typeof data[current_slide + 1].date === "undefined") {
                VMM.attachElement(navigation.nextDate, _title);
                VMM.attachElement(navigation.nextTitle, "");
              } else {
                VMM.attachElement(navigation.nextDate, VMM.Date.prettyDate(data[current_slide + 1].startdate, false, data[current_slide + 1].precisiondate));
                VMM.attachElement(navigation.nextTitle, _title);
              }
            } else {
              VMM.attachElement(navigation.nextTitle, _title);
            }
          }
        }
        if (fast) {
          VMM.Lib.css($slider_container, "left", -(_pos - config.slider.content.padding));
        } else {
          VMM.Lib.stop($slider_container);
          VMM.Lib.animate($slider_container, _duration, _ease, {
            left: -(_pos - config.slider.content.padding)
          });
        }
        if (firstrun) {
          VMM.fireEvent(layout, "LOADED");
        }
        if (slides[current_slide].height() > config.slider_height) {
          VMM.Lib.css(".slider", "overflow-y", "scroll");
        } else {
          VMM.Lib.css(layout, "overflow-y", "hidden");
          scroll_height = 0;
          try {
            scroll_height = VMM.Lib.prop(layout, "scrollHeight");
            VMM.Lib.animate(layout, _duration, _ease, {
              scrollTop: scroll_height - VMM.Lib.height(layout)
            });
          } catch (_error) {
            err = _error;
            scroll_height = VMM.Lib.height(layout);
          }
        }
        preloadSlides();
        return VMM.fireEvent($slider, "MESSAGE", "TEST");
      };
      backToCurrentSlide = function() {
        VMM.Lib.stop($slider_container);
        return VMM.Lib.animate($slider_container, config.duration, "easeOutExpo", {
          left: -(slides[current_slide].leftpos()) + config.slider.content.padding
        });
      };
      showMessege = function(e, msg, other) {
        trace("showMessege " + msg);
        return VMM.attachElement($explainer, "<div class='vco-explainer'><div class='vco-explainer-container'><div class='vco-bezel'><div class='vco-gesture-icon'></div>" + "<div class='vco-message'><p>" + msg + "</p></div></div></div></div>");
      };
      hideMessege = function() {
        return VMM.Lib.animate($explainer, config.duration, config.ease, {
          opacity: 0
        }, detachMessege);
      };
      detachMessege = function() {
        return VMM.Lib.detach($explainer);
      };
      buildNavigation = function() {
        var temp_icon;

        temp_icon = "<div class='icon'>&nbsp;</div>";
        navigation.nextBtn = VMM.appendAndGetElement($slider, "<div>", "nav-next");
        navigation.prevBtn = VMM.appendAndGetElement($slider, "<div>", "nav-previous");
        navigation.nextBtnContainer = VMM.appendAndGetElement(navigation.nextBtn, "<div>", "nav-container", temp_icon);
        navigation.prevBtnContainer = VMM.appendAndGetElement(navigation.prevBtn, "<div>", "nav-container", temp_icon);
        if (config.type === "timeline") {
          navigation.nextDate = VMM.appendAndGetElement(navigation.nextBtnContainer, "<div>", "date", "");
          navigation.prevDate = VMM.appendAndGetElement(navigation.prevBtnContainer, "<div>", "date", "");
        }
        navigation.nextTitle = VMM.appendAndGetElement(navigation.nextBtnContainer, "<div>", "title", "");
        navigation.prevTitle = VMM.appendAndGetElement(navigation.prevBtnContainer, "<div>", "title", "");
        VMM.bindEvent(".nav-next", onNextClick);
        VMM.bindEvent(".nav-previous", onPrevClick);
        return VMM.bindEvent(window, onKeypressNav, "keydown");
      };
      build = function() {
        var __duration, _active;

        __duration = 3000;
        VMM.attachElement(layout, "");
        $slider = VMM.getElement(layout);
        $slider_mask = VMM.appendAndGetElement($slider, "<div>", "slider-container-mask");
        $slider_container = VMM.appendAndGetElement($slider_mask, "<div>", "slider-container");
        $slides_items = VMM.appendAndGetElement($slider_container, "<div>", "slider-item-container");
        buildNavigation();
        buildSlides(data);
        if (VMM.Browser.device === "tablet" || VMM.Browser.device === "mobile") {
          config.duration = 500;
          __duration = 1000;
          $dragslide = new VMM.DragSlider();
          $dragslide.createPanel($slider, $slider_container, "", config.touch, true);
          VMM.bindEvent($dragslide, onDragFinish, "DRAGUPDATE");
          $explainer = VMM.appendAndGetElement($slider_mask, "<div>", "vco-feedback", "");
          showMessege(null, "Swipe to Navigate");
          VMM.Lib.height($explainer, config.slider.height);
          VMM.bindEvent($explainer, onExplainerClick);
          VMM.bindEvent($explainer, onExplainerClick, "touchend");
        }
        reSize(false, true);
        VMM.Lib.visible(navigation.prevBtn, false);
        goToSlide(config.current_slide, "easeOutExpo", __duration, true, true);
        return _active = true;
      };
      touch = {
        move: false,
        x: 10,
        y: 0,
        off: 0,
        dampen: 48
      };
      content = "";
      _active = false;
      layout = parent;
      navigation = {
        nextBtn: "",
        prevBtn: "",
        nextDate: "",
        prevDate: "",
        nextTitle: "",
        prevTitle: ""
      };
      if (typeof parent_config !== "undefined") {
        config = parent_config;
      } else {
        config = {
          preload: 4,
          current_slide: 0,
          interval: 10,
          something: 0,
          width: 720,
          height: 400,
          ease: "easeInOutExpo",
          duration: 1000,
          timeline: false,
          spacing: 15,
          slider: {
            width: 720,
            height: 400,
            content: {
              width: 720,
              height: 400,
              padding: 120,
              padding_default: 120
            },
            nav: {
              width: 100,
              height: 200
            }
          }
        };
      }
      this.ver = "0.6";
      config.slider.width = config.width;
      config.slider.height = config.height;
      this.init = function(d) {
        slides = [];
        slide_positions = [];
        if (typeof d !== "undefined") {
          return this.setData(d);
        } else {
          return trace("WAITING ON DATA");
        }
      };
      this.width = function(w) {
        if ((w != null) && w !== "") {
          config.slider.width = w;
          return reSize();
        } else {
          return config.slider.width;
        }
      };
      this.height = function(h) {
        if ((h != null) && h !== "") {
          config.slider.height = h;
          return reSize();
        } else {
          return config.slider.height;
        }
      };
      this.setData = function(d) {
        if (typeof d !== "undefined") {
          data = d;
          return build();
        } else {
          return trace("NO DATA");
        }
      };
      this.getData = function() {
        return data;
      };
      this.setConfig = function(d) {
        if (typeof d !== "undefined") {
          return config = d;
        } else {
          return trace("NO CONFIG DATA");
        }
      };
      this.getConfig = function() {
        return config;
      };
      this.setSize = function(w, h) {
        if (w != null) {
          config.slider.width = w;
        }
        if (h != null) {
          config.slider.height = h;
        }
        if (_active) {
          return reSize();
        }
      };
      this.active = function() {
        return _active;
      };
      this.getCurrentNumber = function() {
        return current_slide;
      };
      this.setSlide = function(n) {
        return goToSlide(n);
      };
    };
  });

}).call(this);
