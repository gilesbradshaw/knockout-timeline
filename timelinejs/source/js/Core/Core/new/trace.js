(function() {
  define(["VMM"], function(VMM) {
    var trace;

    return trace = function(msg) {
      if (VMM.debug) {
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
