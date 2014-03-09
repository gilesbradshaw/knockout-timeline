(function() {
  if (typeof VMM !== "undefined" && typeof VMM.StoryJS === "undefined") {
    VMM.StoryJS = function() {
      return this.init = function(d) {};
    };
    return;
  }

}).call(this);
