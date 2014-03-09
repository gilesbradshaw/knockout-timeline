(function() {
  define([], function() {
    var trace;

    return trace = function(msg) {
      var debug;

      debug = true;
      if (debug) {
        if (window.console) {
          console.log(msg);
        } else if (typeof jsTrace !== "undefined") {
          jsTrace.send(msg);
        } else {

        }
      }
    };
  });

}).call(this);
