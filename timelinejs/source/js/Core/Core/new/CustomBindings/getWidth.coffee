define ["jquery","knockout", "VMM.Library"], ($,ko, library) ->


	ko.virtualElements.allowedBindings.createWidth = true
	ko.bindingHandlers.createWidth =
		init: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) ->
			innerBindingContext = bindingContext.extend ()->
				$width:ko.observable()
			ko.applyBindingsToDescendants innerBindingContext,element
			controlsDescendantBindings: true
	ko.bindingHandlers.measureWidth =
		init: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) ->
			ko.unwrap valueAccessor()
			bindingContext.$width $(element).width()
		update: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) ->
			ko.unwrap valueAccessor()
			setTimeout(
				()->
					bindingContext.$width  $(element).first().width()
					
				0
			)