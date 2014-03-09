(function() {
  define([], function() {
    return (function() {
      var Class, fnTest, initializing;

      initializing = false;
      fnTest = (/xyz/.test(function() {
        xyz;
      }) ? /\b_super\b/ : /.*/);
      Class = function() {};
      Class.extend = function(prop) {
        var name, prototype, _super;

        Class = function() {
          if (!initializing && this.init) {
            this.init.apply(this, arguments);
          }
        };
        _super = this.prototype;
        initializing = true;
        prototype = new this();
        initializing = false;
        for (name in prop) {
          prototype[name] = (typeof prop[name] === "function" && typeof _super[name] === "function" && fnTest.test(prop[name]) ? (function(name, fn) {
            return function() {
              var ret, tmp;

              tmp = this._super;
              this._super = _super[name];
              ret = fn.apply(this, arguments);
              this._super = tmp;
              return ret;
            };
          })(name, prop[name]) : prop[name]);
        }
        Class.prototype = prototype;
        Class.prototype.constructor = Class;
        Class.extend = arguments.callee;
        return Class;
      };
      return Class;
    })();
  });

}).call(this);
