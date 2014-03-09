(function() {
  define([], function() {
    Date.prototype.getWeek = function() {
      var onejan;

      onejan = new Date(this.getFullYear(), 0, 1);
      return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    };
    return Date.prototype.getDayOfYear = function() {
      var onejan;

      onejan = new Date(this.getFullYear(), 0, 1);
      return Math.ceil((this - onejan) / 86400000);
    };
  });

}).call(this);
