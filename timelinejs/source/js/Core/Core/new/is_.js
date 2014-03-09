(function() {
  define([], function() {
    var is_;

    return is_ = {
      Null: function(a) {
        return a === null;
      },
      Undefined: function(a) {
        return a === undefined;
      },
      nt: function(a) {
        return a === null || a === undefined;
      },
      Function: function(a) {
        if (typeof a === "function") {
          return a.constructor.toString().match(/Function/) !== null;
        } else {
          return false;
        }
      },
      String: function(a) {
        if (typeof a === "string") {
          return true;
        } else {
          if (typeof a === "object") {
            return a.constructor.toString().match(/string/i) !== null;
          } else {
            return false;
          }
        }
      },
      Array: function(a) {
        if (typeof a === "object") {
          return a.constructor.toString().match(/array/i) !== null || a.length !== undefined;
        } else {
          return false;
        }
      },
      Boolean: function(a) {
        if (typeof a === "boolean") {
          return true;
        } else {
          if (typeof a === "object") {
            return a.constructor.toString().match(/boolean/i) !== null;
          } else {
            return false;
          }
        }
      },
      Date: function(a) {
        if (typeof a === "date") {
          return true;
        } else {
          if (typeof a === "object") {
            return a.constructor.toString().match(/date/i) !== null;
          } else {
            return false;
          }
        }
      },
      HTML: function(a) {
        if (typeof a === "object") {
          return a.constructor.toString().match(/html/i) !== null;
        } else {
          return false;
        }
      },
      Number: function(a) {
        if (typeof a === "number") {
          return true;
        } else {
          if (typeof a === "object") {
            return a.constructor.toString().match(/Number/) !== null;
          } else {
            return false;
          }
        }
      },
      Object: function(a) {
        if (typeof a === "object") {
          return a.constructor.toString().match(/object/i) !== null;
        } else {
          return false;
        }
      },
      RegExp: function(a) {
        if (typeof a === "function") {
          return a.constructor.toString().match(/regexp/i) !== null;
        } else {
          return false;
        }
      }
    };
  });

}).call(this);
