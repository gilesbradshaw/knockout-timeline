(function() {
  define(["trace", "lazyload"], function(trace) {
    var LoadLib;

    return LoadLib = (function(doc) {
      var isLoaded, loaded;

      isLoaded = function(url) {
        var has_loaded, i;

        i = 0;
        has_loaded = false;
        i = 0;
        while (i < loaded.length) {
          if (loaded[i] === url) {
            has_loaded = true;
          }
          i++;
        }
        if (has_loaded) {
          return true;
        } else {
          loaded.push(url);
          return false;
        }
      };
      loaded = [];
      return {
        css: function(urls, callback, obj, context) {
          if (!isLoaded(urls)) {
            LazyLoad.css(urls, callback, obj, context);
          }
        },
        js: function(urls, callback, obj, context) {
          if (!isLoaded(urls)) {
            LazyLoad.js(urls, callback, obj, context);
          }
        }
      };
    })(document);
  });

}).call(this);
