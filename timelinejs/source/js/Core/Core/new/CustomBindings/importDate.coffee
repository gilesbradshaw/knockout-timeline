define ["jquery","knockout","VMM.Date","VMM.Util", "VMM.ExternalAPI"], ($,ko,vDate,util,externalAPI) ->

	ko.virtualElements.allowedBindings.importDates = true
	ko.virtualElements.allowedBindings.dates = true
	
	computed=(k)->
		ko.computed
			deferEvaluation:true
			read:k
	
	parseDate=(date, configuration)->
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
			fullDate:computed ()->result.startDate().getTime()
			period:computed ()->
				text = vDate.prettyDate(result.startDate(), false, result.precisionDate())
				if result.startDate() != result.endDate()
					text += ' - ' + vDate.prettyDate(result.endDate(), false, result.precisionDate())
			date: computed ()-> vDate.prettyDate(result.startDate(), false, result.precisionDate())
			needs_slug:computed ()-> date.slug? and date.slug() isnt "" and (!date.headline or !date.headline())
			title:computed ()-> ko.unwrap date.headline
			unlinkedTitle: computed ()-> util.unlinkify(result.title())
			headline:computed ()-> ko.unwrap date.headline
			
			type:computed ()-> ko.unwrap date.type
			
			asset:computed ()-> 
				$.extend {}, ko.unwrap(date.asset),
					((asset)->
						credit:computed ()->
							ko.unwrap(asset.credit) || ""
						caption:computed ()->
							ko.unwrap(asset.caption) || ""
					)(ko.unwrap date.asset)
			

			text: computed ()->ko.unwrap date.text
			content: ko.observable ""
			tag: computed ()->ko.unwrap date.tag
			slug: computed ()->ko.unwrap date.slug
			uniqueId: util.unique_ID(7)
			className: computed ()->ko.unwrap date.className
			mediaType:computed ()->
				m= externalAPI.mediaTypeFromAsset ko.unwrap(date.asset)
				m.uid = result.uniqueId
				m
			create:computed ()-> result.mediaType().mediaType.createElement result.mediaType(), "comooneeee!"
			configuration:computed ()->configuration
			

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
			configuration = ko.unwrap(valueAccessor().configuration)

			bindingContext.$importedDates(
				$.Enumerable.From(ko.unwrap(valueAccessor().dates))
					.Where((d)->ko.unwrap(d.startDate)  && !isNaN(vDate.parse(ko.unwrap(d.startDate), true).date))
					.Select((d)->parseDate d, configuration)
					.ToArray()
			)

		update:(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) ->
			configuration = ko.unwrap(valueAccessor().configuration)

			dates = ko.unwrap valueAccessor().dates
			bindingContext.$importedDates.remove (d)-> dates.indexOf(d._date)<0

			$.Enumerable.From(dates)
				.Where((d)->!$.Enumerable.From(bindingContext.$importedDates()).Any((dd)->dd._date==d))
				.Select((d)->bindingContext.$importedDates.push parseDate d, configuration)
				.ToArray()
			