# Slider Slide 
#================================================== 
define [
	"trace"
	"type"
	"VMM.Date"
	"VMM.Library"
	"VMM.Util"
	"VMM.ExternalAPI"
	"VMM.MediaElement"
	"VMM.TextElement"
], (trace, type, vDate, library, util, ExternalAPI, MediaElement, TextElement)->
	Slide = (d, _parent) ->
		$media = undefined
		$text = undefined
		$slide = undefined
		$wrap = undefined
		element = undefined
		c = undefined
		data = d
		slide = {}
		element = ""
		media = ""
		loaded = false
		preloaded = false
		is_skinny = false
		_enqueue = true
		_removequeue = false
		_id = "slide_"
		_class = 0
		timer =
			pushqueue: ""
			render: ""
			relayout: ""
			remove: ""
			skinny: false

		times =
			pushqueue: 500
			render: 100
			relayout: 100
			remove: 30000

		_id = _id + data.uniqueid
		@enqueue = _enqueue
		@id = _id
		element = library.appendAndGetElement(_parent, "<div>", "slider-item")
		unless typeof data.classname is "undefined"
			trace "HAS CLASSNAME"
			library.addClass element, data.classname
		else
			trace "NO CLASSNAME"
			trace data
		c =
			slide: ""
			text: ""
			media: ""
			media_element: ""
			layout: "content-container layout"
			has:
				headline: false
				text: false
				media: false

		
		# PUBLIC
		#		================================================== 
		@show = (skinny) ->
			_enqueue = false
			timer.skinny = skinny
			_removequeue = false
			clearTimeout timer.remove
			unless loaded
				if preloaded
					clearTimeout timer.relayout
					timer.relayout = setTimeout(reloadLayout, times.relayout)
				else
					render skinny
			return

		@hide = ->
			if loaded and not _removequeue
				_removequeue = true
				clearTimeout timer.remove
				timer.remove = setTimeout(removeSlide, times.remove)
			return

		@clearTimers = ->
			
			#clearTimeout(timer.remove);
			clearTimeout timer.relayout
			clearTimeout timer.pushqueue
			clearTimeout timer.render
			return

		@layout = (skinny) ->
			reLayout skinny    if loaded and preloaded
			return

		@elem = ->
			element

		@position = ->
			library.position element

		@leftpos = (p) ->
			unless typeof p is "undefined"
				library.css element, "left", p
			else
				library.position(element).left
			#return

		@animate = (d, e, p) ->
			library.animate element, d, e, p
			return

		@css = (p, v) ->
			library.css element, p, v
			return

		@opacity = (p) ->
			library.css element, "opacity", p
			return

		@width = ->
			library.width element

		@height = ->
			library.height element

		@content_height = ->
			ch = library.find(element, ".content")[0]
			if ch isnt "undefined" and ch?
				library.height ch
			else
				0

		
		# PRIVATE
		#		================================================== 
		render = (skinny) ->
			trace "RENDER " + _id
			loaded = true
			preloaded = true
			timer.skinny = skinny
			buildSlide()
			clearTimeout timer.pushqueue
			clearTimeout timer.render
			timer.pushqueue = setTimeout(ExternalAPI.pushQueues, times.pushqueue)
			return

		removeSlide = ->
			
			#library.attachElement(element, "");
			trace "REMOVE SLIDE TIMER FINISHED"
			loaded = false
			library.detach $text
			library.detach $media
			return

		reloadLayout = ->
			loaded = true
			reLayout timer.skinny, true
			return

		reLayout = (skinny, reload) ->
			if c.has.text
				if skinny
					if not is_skinny or reload
						library.removeClass $slide, "pad-left"
						library.detach $text
						library.detach $media
						library.append $slide, $text
						library.append $slide, $media
						is_skinny = true
				else
					if is_skinny or reload
						library.addClass $slide, "pad-left"
						library.detach $text
						library.detach $media
						library.append $slide, $media
						library.append $slide, $text
						is_skinny = false
			else if reload
				if c.has.headline
					library.detach $text
					library.append $slide, $text
				library.detach $media
				library.append $slide, $media
			return

		buildSlide = ->
			trace "BUILDSLIDE"
			$wrap = library.appendAndGetElement(element, "<div>", "content")
			$slide = library.appendAndGetElement($wrap, "<div>")
			
			# DATE
			#			================================================== 
			if data.startdate? and data.startdate isnt ""
				if type.of(data.startdate) is "date"
					unless data.type is "start"
						st = vDate.prettyDate(data.startdate, false, data.precisiondate)
						en = vDate.prettyDate(data.enddate, false, data.precisiondate)
						tag = ""
						
						# TAG / CATEGORY
						#						================================================== 
						tag = library.createElement("span", data.tag, "slide-tag")    if data.tag? and data.tag isnt ""
						unless st is en
							c.text += library.createElement("h2", st + " &mdash; " + en + tag, "date")
						else
							c.text += library.createElement("h2", st + tag, "date")
			
			# HEADLINE
			#			================================================== 
			if data.headline? and data.headline isnt ""
				c.has.headline = true
				if data.type is "start"
					c.text += library.createElement("h2", util.linkify_with_twitter(data.headline, "_blank"), "start")
				else
					c.text += library.createElement("h3", util.linkify_with_twitter(data.headline, "_blank"))
			
			# TEXT
			#			================================================== 
			if data.text? and data.text isnt ""
				c.has.text = true
				c.text += library.createElement("p", util.linkify_with_twitter(data.text, "_blank"))
			if c.has.text or c.has.headline
				c.text = library.createElement("div", c.text, "container")
				
				#$text		=	library.appendAndGetElement($slide, "<div>", "text", c.text);
				$text = library.appendAndGetElement($slide, "<div>", "text", TextElement.create(c.text))
			
			# SLUG
			#			================================================== 
			dontcrashjs2coffee = 0    if data.needs_slug
			
			# MEDIA
			#			================================================== 
			if data.asset? and data.asset isnt ""
				if data.asset.media? and data.asset.media isnt ""
					c.has.media = true
					$media = library.appendAndGetElement($slide, "<div>", "media", MediaElement.create(data.asset, data.uniqueid))
			
			# COMBINE
			#			================================================== 
			c.layout += "-text"    if c.has.text
			c.layout += "-media"    if c.has.media
			if c.has.text
				if timer.skinny
					library.addClass $slide, c.layout
					is_skinny = true
				else
					library.addClass $slide, c.layout
					library.addClass $slide, "pad-left"
					library.detach $text
					library.append $slide, $text
			else
				library.addClass $slide, c.layout
			return

		return