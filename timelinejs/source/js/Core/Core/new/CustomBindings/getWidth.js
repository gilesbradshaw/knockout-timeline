(function() {
  define(["jquery", "knockout", "VMM.Library"], function($, ko, library) {
    ko.virtualElements.allowedBindings.createWidth = true;
    ko.bindingHandlers.createWidth = {
      init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var innerBindingContext;

        innerBindingContext = bindingContext.extend(function() {
          return {
            $width: ko.observable()
          };
        });
        ko.applyBindingsToDescendants(innerBindingContext, element);
        return {
          controlsDescendantBindings: true
        };
      }
    };
    return ko.bindingHandlers.measureWidth = {
      init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        ko.unwrap(valueAccessor());
        return bindingContext.$width($(element).width());
      },
      update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        ko.unwrap(valueAccessor());
        return setTimeout(function() {
          return bindingContext.$width($(element).first().width());
        }, 0);
      }
    };
  });

}).call(this);
