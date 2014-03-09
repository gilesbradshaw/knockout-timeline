(function() {
  define(["VMM", "trace"], function(VMM, trace) {
    return VMM.TextElement = {
      init: function() {
        return this;
      },
      create: function(data) {
        return data;
      }
    }.init();
  });

}).call(this);
