(function () {
	define([], function () {
		var global = (function () {
			return this || (1, eval)('this');
		}());
		return global;
	});

}).call(this);
