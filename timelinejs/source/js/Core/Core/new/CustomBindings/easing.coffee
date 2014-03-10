define ["jquery","knockout", "VMM.Library"], ($,ko, library) ->

	ko.bindingHandlers.easing =
		init: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) ->
			library.animate $(element), ko.unwrap(valueAccessor().initialDuration), ko.unwrap(valueAccessor().ease),ko.unwrap valueAccessor().easing

		update:(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) ->
			library.animate $(element), ko.unwrap(valueAccessor().duration), ko.unwrap(valueAccessor().ease), ko.unwrap valueAccessor().easing