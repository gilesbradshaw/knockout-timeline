(function() {
  define(["jquery", "knockout", "VMM.Library"], function($, ko, library) {
    return ko.bindingHandlers.easing = {
      init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return library.animate($(element), ko.unwrap(valueAccessor().initialDuration), ko.unwrap(valueAccessor().ease), ko.unwrap(valueAccessor().easing));
      },
      update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return library.animate($(element), ko.unwrap(valueAccessor().duration), ko.unwrap(valueAccessor().ease), ko.unwrap(valueAccessor().easing));
      }
    };
  });

}).call(this);
