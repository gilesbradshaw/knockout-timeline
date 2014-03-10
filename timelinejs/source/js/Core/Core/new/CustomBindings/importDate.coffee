define ["jquery","knockout","VMM.Date","VMM.Util", "VMM.ExternalAPI"], ($,ko,vDate,util,externalAPI) ->

	ko.virtualElements.allowedBindings.importDates = true
	ko.virtualElements.allowedBindings.dates = true
	
	computed=(k)->
		ko.computed
			deferEvaluation:true
			read:k
	
	parseDate=(date)->
		result=
			_date:date
			startDate:computed ()-> vDate.parse(ko.unwrap(date.startDate), true).date
			precisionDate:computed ()-> vDate.parse(ko.unwrap(date.startDate), true).precision
			endDate:computed( ()->
				e= ko.unwrap date.endDate
				if e && !isNaN(vDate.parse(e))
					vDate.parse e 
				else
					result.startDate()
			)
			needs_slug:computed ()-> date.slug? and date.slug() isnt "" and (!date.headline or !date.headline())
			title:computed ()-> ko.unwrap date.headline
			headline:computed ()-> ko.unwrap date.headline
			type:computed ()-> ko.unwrap date.type
			date: computed ()-> vDate.prettyDate(result.startdate(), false, result.precisiondate())
			asset:computed ()-> ko.unwrap date.asset
			fullDate:computed ()->result.startDate().getTime()

			text: computed ()->ko.unwrap date.text
			content: ko.observable ""
			tag: computed ()->ko.unwrap date.tag
			slug: computed ()->ko.unwrap date.slug
			uniqueId: util.unique_ID(7)
			className: computed ()->ko.unwrap date.className

	ko.bindingHandlers.dates =
		init: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) ->
			importedDates=ko.observableArray()

			innerBindingContext = bindingContext.extend ()->
				$importedDates:importedDates
			ko.applyBindingsToDescendants innerBindingContext,element
			controlsDescendantBindings: true

		update:(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) ->
	ko.bindingHandlers.importDates =
		init: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) ->
			bindingContext.$importedDates(
				$.Enumerable.From(ko.unwrap(valueAccessor()))
					.Where((d)->ko.unwrap(d.startDate)  && !isNaN(vDate.parse(ko.unwrap(d.startDate), true).date))
					.Select((d)->parseDate d)
					.ToArray()
			)

		update:(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) ->
			dates = ko.unwrap valueAccessor()
			bindingContext.$importedDates.remove (d)-> dates.indexOf(d._date)<0

			$.Enumerable.From(dates)
				.Where((d)->!$.Enumerable.From(bindingContext.$importedDates()).Any((dd)->dd._date==d))
				.Select((d)->bindingContext.$importedDates.push parseDate d)
				.ToArray()
			