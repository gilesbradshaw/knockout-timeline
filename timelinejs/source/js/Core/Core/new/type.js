(function() {
  define(["is_"], function(is_) {
    var type;

    return type = {
      of: function(a) {
        var i;

        for (i in is_) {
          if (is_[i](a)) {
            return i.toLowerCase();
          }
        }
      }
    };
  });

}).call(this);
