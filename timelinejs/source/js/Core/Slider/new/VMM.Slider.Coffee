# Slider
#================================================== 

#	* CodeKit Import
#	* http://incident57.com/codekit/
#================================================== 

# @codekit-append "VMM.Slider.Slide.js";
define ["VMM", "trace"], (VMM, trace)->
	VMM.Slider = (parent, parent_config) ->
		

		config = undefined
		timer = undefined
		$slider = undefined
		$slider_mask = undefined
		$slider_container = undefined
		$slides_items = undefined
		$dragslide = undefined
		$explainer = undefined
		events = {}
		data = []
		slides = []
		slide_positions = []
		slides_content = ""
		current_slide = 0
		current_width = 960

		# CONFIG
		
		# PUBLIC VARS
		#		================================================== 
		
		# PUBLIC FUNCTIONS
		#		================================================== 
		
		# GETTERS AND SETTERS
		#		================================================== 
		
		# ON EVENT
		#		================================================== 
		onConfigSet = ->
			trace "onConfigSet"
			return
		reSize = (go_to_slide, from_start) ->
			_go_to_slide = true
			_from_start = false
			_go_to_slide = go_to_slide    if go_to_slide?
			_from_start = from_start    if from_start?
			current_width = config.slider.width
			config.slider.nav.height = VMM.Lib.height(navigation.prevBtnContainer)
			
			# Handle smaller sizes
			if VMM.Browser.device is "mobile" or current_width <= 640
				config.slider.content.padding = 10
			else
				config.slider.content.padding = config.slider.content.padding_default
			config.slider.content.width = current_width - (config.slider.content.padding * 2)
			VMM.Lib.width $slides_items, (slides.length * config.slider.content.width)
			VMM.Lib.css $slider_container, "left", slides[current_slide].leftpos()    if _from_start
			
			# RESIZE SLIDES
			sizeSlides()
			
			# POSITION SLIDES
			positionSlides()
			
			# POSITION NAV
			VMM.Lib.css navigation.nextBtn, "left", (current_width - config.slider.nav.width)
			VMM.Lib.height navigation.prevBtn, config.slider.height
			VMM.Lib.height navigation.nextBtn, config.slider.height
			VMM.Lib.css navigation.nextBtnContainer, "top", ((config.slider.height / 2) - (config.slider.nav.height / 2)) + 10
			VMM.Lib.css navigation.prevBtnContainer, "top", ((config.slider.height / 2) - (config.slider.nav.height / 2)) + 10
			
			# Animate Changes
			VMM.Lib.height $slider_mask, config.slider.height
			VMM.Lib.width $slider_mask, current_width
			goToSlide current_slide, "linear", 1    if _go_to_slide
			VMM.Lib.visible navigation.prevBtn, false    if current_slide is 0
			
		onDragFinish = (e, d) ->
			trace "DRAG FINISH"
			trace d.left_adjust
			trace (config.slider.width / 2)
			if d.left_adjust < 0
				if Math.abs(d.left_adjust) > (config.slider.width / 2)
					
					#onNextClick(e);
					if current_slide is slides.length - 1
						backToCurrentSlide()
					else
						goToSlide current_slide + 1, "easeOutExpo"
						upDate()
				else
					backToCurrentSlide()
			else if Math.abs(d.left_adjust) > (config.slider.width / 2)
				if current_slide is 0
					backToCurrentSlide()
				else
					goToSlide current_slide - 1, "easeOutExpo"
					upDate()
			else
				backToCurrentSlide()
			
		
		# NAVIGATION
		#		================================================== 
		onNextClick = (e) ->
			if current_slide is slides.length - 1
				backToCurrentSlide()
			else
				goToSlide current_slide + 1
				upDate()
			
		onPrevClick = (e) ->
			if current_slide is 0
				backToCurrentSlide()
			else
				goToSlide current_slide - 1
				upDate()
			
		onKeypressNav = (e) ->
			switch e.keyCode
				when 39
					
					# RIGHT ARROW
					onNextClick e
				when 37
					
					# LEFT ARROW
					onPrevClick e
		onTouchUpdate = (e, b) ->
			if slide_positions.length is 0
				i = 0

				while i < slides.length
					slide_positions.push slides[i].leftpos()
					i++
			if typeof b.left is "number"
				_pos = b.left
				_slide_pos = -(slides[current_slide].leftpos())
				if _pos < _slide_pos - (config.slider_width / 3)
					onNextClick()
				else if _pos > _slide_pos + (config.slider_width / 3)
					onPrevClick()
				else
					VMM.Lib.animate $slider_container, config.duration, config.ease,
						left: _slide_pos

			else
				VMM.Lib.animate $slider_container, config.duration, config.ease,
					left: _slide_pos

			if typeof b.top is "number"
				VMM.Lib.animate $slider_container, config.duration, config.ease,
					top: -b.top

			else

			
		onExplainerClick = (e) ->
			detachMessege()
			
		
		# UPDATE
		#		================================================== 
		upDate = ->
			config.current_slide = current_slide
			VMM.fireEvent layout, "UPDATE"
			
		
		# GET DATA
		#		================================================== 
		getData = (d) ->
			data = d
			
		
		# BUILD SLIDES
		#		================================================== 
		buildSlides = (d) ->
			i = 0
			VMM.attachElement $slides_items, ""
			slides = []
			i = 0
			while i < d.length
				_slide = new VMM.Slider.Slide(d[i], $slides_items)
				
				#_slide.show();
				slides.push _slide
				i++
			
		preloadSlides = (skip) ->
			i = 0
			if skip
				preloadTimeOutSlides()
			else
				i = 0
				while i < slides.length
					slides[i].clearTimers()
					i++
				timer = setTimeout(preloadTimeOutSlides, config.duration)
			
		preloadTimeOutSlides = ->
			i = 0
			i = 0
			while i < slides.length
				slides[i].enqueue = true
				i++
			i = 0
			while i < config.preload
				unless (current_slide + i) > slides.length - 1
					slides[current_slide + i].show()
					slides[current_slide + i].enqueue = false
				unless (current_slide - i) < 0
					slides[current_slide - i].show()
					slides[current_slide - i].enqueue = false
				i++
			if slides.length > 50
				i = 0
				while i < slides.length
					slides[i].hide()    if slides[i].enqueue
					i++
			sizeSlides()
			
		sizeSlide = (slide_id) ->
		
		# SIZE SLIDES
		#		================================================== 
		sizeSlides = ->
			i = 0
			layout_text_media = ".slider-item .layout-text-media .media .media-container "
			layout_media = ".slider-item .layout-media .media .media-container "
			layout_both = ".slider-item .media .media-container"
			layout_caption = ".slider-item .media .media-container .media-shadow .caption"
			is_skinny = false
			mediasize =
				text_media:
					width: (config.slider.content.width / 100) * 60
					height: config.slider.height - 60
					video:
						width: 0
						height: 0

					text:
						width: ((config.slider.content.width / 100) * 40) - 30
						height: config.slider.height

				media:
					width: config.slider.content.width
					height: config.slider.height - 110
					video:
						width: 0
						height: 0

			
			# Handle smaller sizes
			is_skinny = true    if VMM.Browser.device is "mobile" or current_width < 641
			VMM.master_config.sizes.api.width = mediasize.media.width
			VMM.master_config.sizes.api.height = mediasize.media.height
			mediasize.text_media.video = VMM.Util.ratio.fit(mediasize.text_media.width, mediasize.text_media.height, 16, 9)
			mediasize.media.video = VMM.Util.ratio.fit(mediasize.media.width, mediasize.media.height, 16, 9)
			VMM.Lib.css ".slider-item", "width", config.slider.content.width
			VMM.Lib.height ".slider-item", config.slider.height
			if is_skinny
				mediasize.text_media.width = config.slider.content.width - (config.slider.content.padding * 2)
				mediasize.media.width = config.slider.content.width - (config.slider.content.padding * 2)
				mediasize.text_media.height = ((config.slider.height / 100) * 50) - 50
				mediasize.media.height = ((config.slider.height / 100) * 70) - 40
				mediasize.text_media.video = VMM.Util.ratio.fit(mediasize.text_media.width, mediasize.text_media.height, 16, 9)
				mediasize.media.video = VMM.Util.ratio.fit(mediasize.media.width, mediasize.media.height, 16, 9)
				VMM.Lib.css ".slider-item .layout-text-media .text", "width", "100%"
				VMM.Lib.css ".slider-item .layout-text-media .text", "display", "block"
				VMM.Lib.css ".slider-item .layout-text-media .text .container", "display", "block"
				VMM.Lib.css ".slider-item .layout-text-media .text .container", "width", mediasize.media.width
				VMM.Lib.css ".slider-item .layout-text-media .text .container .start", "width", "auto"
				VMM.Lib.css ".slider-item .layout-text-media .media", "float", "none"
				VMM.Lib.addClass ".slider-item .content-container", "pad-top"
				VMM.Lib.css ".slider-item .media blockquote p", "line-height", "18px"
				VMM.Lib.css ".slider-item .media blockquote p", "font-size", "16px"
				VMM.Lib.css ".slider-item", "overflow-y", "auto"
			else
				VMM.Lib.css ".slider-item .layout-text-media .text", "width", "40%"
				VMM.Lib.css ".slider-item .layout-text-media .text", "display", "table-cell"
				VMM.Lib.css ".slider-item .layout-text-media .text .container", "display", "table-cell"
				VMM.Lib.css ".slider-item .layout-text-media .text .container", "width", "auto"
				VMM.Lib.css ".slider-item .layout-text-media .text .container .start", "width", mediasize.text_media.text.width
				
				#VMM.Lib.addClass(".slider-item .content-container", "pad-left");
				VMM.Lib.removeClass ".slider-item .content-container", "pad-top"
				VMM.Lib.css ".slider-item .layout-text-media .media", "float", "left"
				VMM.Lib.css ".slider-item .layout-text-media", "display", "table"
				VMM.Lib.css ".slider-item .media blockquote p", "line-height", "36px"
				VMM.Lib.css ".slider-item .media blockquote p", "font-size", "28px"
				VMM.Lib.css ".slider-item", "display", "table"
				VMM.Lib.css ".slider-item", "overflow-y", "auto"
			
			# MEDIA FRAME
			VMM.Lib.css layout_text_media + ".media-frame", "max-width", mediasize.text_media.width
			VMM.Lib.height layout_text_media + ".media-frame", mediasize.text_media.height
			VMM.Lib.width layout_text_media + ".media-frame", mediasize.text_media.width
			
			# WEBSITES
			#VMM.Lib.css(	layout_both + 		".website", 			"max-width", 	300 );
			
			# IMAGES
			VMM.Lib.css layout_text_media + "img", "max-height", mediasize.text_media.height
			VMM.Lib.css layout_media + "img", "max-height", mediasize.media.height
			
			# FIX FOR NON-WEBKIT BROWSERS
			VMM.Lib.css layout_text_media + "img", "max-width", mediasize.text_media.width
			VMM.Lib.css layout_text_media + ".avatar img", "max-width", 32
			VMM.Lib.css layout_text_media + ".avatar img", "max-height", 32
			VMM.Lib.css layout_media + ".avatar img", "max-width", 32
			VMM.Lib.css layout_media + ".avatar img", "max-height", 32
			VMM.Lib.css layout_text_media + ".article-thumb", "max-width", "50%"
			
			#VMM.Lib.css(	layout_text_media + ".article-thumb", "max-height", 		100 );
			VMM.Lib.css layout_media + ".article-thumb", "max-width", 200
			
			#VMM.Lib.css(	layout_media + 		".article-thumb", "max-height", 		100 );
			
			# IFRAME FULL SIZE VIDEO
			VMM.Lib.width layout_text_media + ".media-frame", mediasize.text_media.video.width
			VMM.Lib.height layout_text_media + ".media-frame", mediasize.text_media.video.height
			VMM.Lib.width layout_media + ".media-frame", mediasize.media.video.width
			VMM.Lib.height layout_media + ".media-frame", mediasize.media.video.height
			VMM.Lib.css layout_media + ".media-frame", "max-height", mediasize.media.video.height
			VMM.Lib.css layout_media + ".media-frame", "max-width", mediasize.media.video.width
			
			# SOUNDCLOUD
			VMM.Lib.height layout_media + ".soundcloud", 168
			VMM.Lib.height layout_text_media + ".soundcloud", 168
			VMM.Lib.width layout_media + ".soundcloud", mediasize.media.width
			VMM.Lib.width layout_text_media + ".soundcloud", mediasize.text_media.width
			VMM.Lib.css layout_both + ".soundcloud", "max-height", 168
			
			# MAPS
			VMM.Lib.height layout_text_media + ".map", mediasize.text_media.height
			VMM.Lib.width layout_text_media + ".map", mediasize.text_media.width
			VMM.Lib.css layout_media + ".map", "max-height", mediasize.media.height
			VMM.Lib.width layout_media + ".map", mediasize.media.width
			
			# DOCS
			VMM.Lib.height layout_text_media + ".doc", mediasize.text_media.height
			VMM.Lib.width layout_text_media + ".doc", mediasize.text_media.width
			VMM.Lib.height layout_media + ".doc", mediasize.media.height
			VMM.Lib.width layout_media + ".doc", mediasize.media.width
			
			# IE8 NEEDS THIS
			VMM.Lib.width layout_media + ".wikipedia", mediasize.media.width
			VMM.Lib.width layout_media + ".twitter", mediasize.media.width
			VMM.Lib.width layout_media + ".plain-text-quote", mediasize.media.width
			VMM.Lib.width layout_media + ".plain-text", mediasize.media.width
			VMM.Lib.css layout_both, "max-width", mediasize.media.width
			
			# CAPTION WIDTH
			VMM.Lib.css layout_text_media + ".caption", "max-width", mediasize.text_media.video.width
			VMM.Lib.css layout_media + ".caption", "max-width", mediasize.media.video.width
			
			#VMM.Lib.css( layout_text_media + 	".caption",	"max-width",	mediasize.text_media.width);
			#VMM.Lib.css( layout_media + 		".caption",	"max-width",	mediasize.media.width);
			
			# MAINTAINS VERTICAL CENTER IF IT CAN
			i = 0
			while i < slides.length
				slides[i].layout is_skinny
				if slides[i].content_height() > config.slider.height + 20
					slides[i].css "display", "block"
				else
					slides[i].css "display", "table"
				i++
			
		
		# POSITION SLIDES
		#		================================================== 
		positionSlides = ->
			pos = 0
			i = 0
			i = 0
			while i < slides.length
				pos = i * (config.slider.width + config.spacing)
				slides[i].leftpos pos
				i++
			
		
		# OPACITY SLIDES
		#		================================================== 
		opacitySlides = (n) ->
			_ease = "linear"
			i = 0
			i = 0
			while i < slides.length
				if i is current_slide
					slides[i].animate config.duration, _ease,
						opacity: 1

				else if i is current_slide - 1 or i is current_slide + 1
					slides[i].animate config.duration, _ease,
						opacity: 0.1

				else
					slides[i].opacity n
				i++
			
		
		# GO TO SLIDE
		#			goToSlide(n, ease, duration);
		#		================================================== 
		goToSlide = (n, ease, duration, fast, firstrun) ->
			_ease = config.ease
			_duration = config.duration
			is_last = false
			is_first = false
			_title = ""
			_pos = undefined
			
			# STOP ANY VIDEO PLAYERS ACTIVE
			#			================================================== 
			VMM.ExternalAPI.youtube.stopPlayers()
			
			# Set current slide
			current_slide = n
			_pos = slides[current_slide].leftpos()
			is_first = true    if current_slide is 0
			is_last = true    if current_slide + 1 >= slides.length
			_ease = ease    if ease? and ease isnt ""
			_duration = duration    if duration? and duration isnt ""
			
			#	NAVIGATION
			#				set proper nav titles and dates etc.
			#			================================================== 
			
			# Handle smaller sizes
			if VMM.Browser.device is "mobile"
				
				#if (VMM.Browser.device == "mobile" || current_width <= 640) {
				VMM.Lib.visible navigation.prevBtn, false
				VMM.Lib.visible navigation.nextBtn, false
			else
				if is_first
					VMM.Lib.visible navigation.prevBtn, false
				else
					VMM.Lib.visible navigation.prevBtn, true
					_title = VMM.Util.unlinkify(data[current_slide - 1].title)
					if config.type is "timeline"
						if typeof data[current_slide - 1].date is "undefined"
							VMM.attachElement navigation.prevDate, _title
							VMM.attachElement navigation.prevTitle, ""
						else
							VMM.attachElement navigation.prevDate, VMM.Date.prettyDate(data[current_slide - 1].startdate, false, data[current_slide - 1].precisiondate)
							VMM.attachElement navigation.prevTitle, _title
					else
						VMM.attachElement navigation.prevTitle, _title
				if is_last
					VMM.Lib.visible navigation.nextBtn, false
				else
					VMM.Lib.visible navigation.nextBtn, true
					_title = VMM.Util.unlinkify(data[current_slide + 1].title)
					if config.type is "timeline"
						if typeof data[current_slide + 1].date is "undefined"
							VMM.attachElement navigation.nextDate, _title
							VMM.attachElement navigation.nextTitle, ""
						else
							VMM.attachElement navigation.nextDate, VMM.Date.prettyDate(data[current_slide + 1].startdate, false, data[current_slide + 1].precisiondate)
							VMM.attachElement navigation.nextTitle, _title
					else
						VMM.attachElement navigation.nextTitle, _title
			
			# ANIMATE SLIDE
			#			================================================== 
			if fast
				VMM.Lib.css $slider_container, "left", -(_pos - config.slider.content.padding)
			else
				VMM.Lib.stop $slider_container
				VMM.Lib.animate $slider_container, _duration, _ease,
					left: -(_pos - config.slider.content.padding)

			VMM.fireEvent layout, "LOADED"    if firstrun
			
			# SET Vertical Scoll
			#			================================================== 
			if slides[current_slide].height() > config.slider_height
				VMM.Lib.css ".slider", "overflow-y", "scroll"
			else
				VMM.Lib.css layout, "overflow-y", "hidden"
				scroll_height = 0
				try
					scroll_height = VMM.Lib.prop(layout, "scrollHeight")
					VMM.Lib.animate layout, _duration, _ease,
						scrollTop: scroll_height - VMM.Lib.height(layout)

				catch err
					scroll_height = VMM.Lib.height(layout)
			preloadSlides()
			VMM.fireEvent $slider, "MESSAGE", "TEST"
			
		backToCurrentSlide = ->
			VMM.Lib.stop $slider_container
			VMM.Lib.animate $slider_container, config.duration, "easeOutExpo",
				left: -(slides[current_slide].leftpos()) + config.slider.content.padding

			
		
		# MESSEGES 
		#		================================================== 
		showMessege = (e, msg, other) ->
			trace "showMessege " + msg
			
			#VMM.attachElement($timeline, $feedback);
			VMM.attachElement $explainer, "<div class='vco-explainer'><div class='vco-explainer-container'><div class='vco-bezel'><div class='vco-gesture-icon'></div>" + "<div class='vco-message'><p>" + msg + "</p></div></div></div></div>"
			
		hideMessege = ->
			VMM.Lib.animate $explainer, config.duration, config.ease,
				opacity: 0
			, detachMessege
			
		detachMessege = ->
			VMM.Lib.detach $explainer
			
		
		# BUILD NAVIGATION
		#		================================================== 
		buildNavigation = ->
			temp_icon = "<div class='icon'>&nbsp;</div>"
			navigation.nextBtn = VMM.appendAndGetElement($slider, "<div>", "nav-next")
			navigation.prevBtn = VMM.appendAndGetElement($slider, "<div>", "nav-previous")
			navigation.nextBtnContainer = VMM.appendAndGetElement(navigation.nextBtn, "<div>", "nav-container", temp_icon)
			navigation.prevBtnContainer = VMM.appendAndGetElement(navigation.prevBtn, "<div>", "nav-container", temp_icon)
			if config.type is "timeline"
				navigation.nextDate = VMM.appendAndGetElement(navigation.nextBtnContainer, "<div>", "date", "")
				navigation.prevDate = VMM.appendAndGetElement(navigation.prevBtnContainer, "<div>", "date", "")
			navigation.nextTitle = VMM.appendAndGetElement(navigation.nextBtnContainer, "<div>", "title", "")
			navigation.prevTitle = VMM.appendAndGetElement(navigation.prevBtnContainer, "<div>", "title", "")
			VMM.bindEvent ".nav-next", onNextClick
			VMM.bindEvent ".nav-previous", onPrevClick
			VMM.bindEvent window, onKeypressNav, "keydown"
			
		
		# BUILD
		#		================================================== 
		build = ->
			__duration = 3000
			
			# Clear out existing content
			VMM.attachElement layout, ""
			
			# Get DOM Objects to local objects
			$slider = VMM.getElement(layout)
			$slider_mask = VMM.appendAndGetElement($slider, "<div>", "slider-container-mask")
			$slider_container = VMM.appendAndGetElement($slider_mask, "<div>", "slider-container")
			$slides_items = VMM.appendAndGetElement($slider_container, "<div>", "slider-item-container")
			
			# BUILD NAVIGATION
			buildNavigation()
			
			# ATTACH SLIDES
			buildSlides data
			
			# MAKE SLIDER DRAGGABLE/TOUCHABLE
			#			================================================== 
			if VMM.Browser.device is "tablet" or VMM.Browser.device is "mobile"
				
				# Different Animation duration for touch
				config.duration = 500
				__duration = 1000
				
				# Make touchable
				$dragslide = new VMM.DragSlider()
				$dragslide.createPanel $slider, $slider_container, "", config.touch, true
				VMM.bindEvent $dragslide, onDragFinish, "DRAGUPDATE"
				
				# EXPLAINER
				$explainer = VMM.appendAndGetElement($slider_mask, "<div>", "vco-feedback", "")
				showMessege null, "Swipe to Navigate"
				VMM.Lib.height $explainer, config.slider.height
				VMM.bindEvent $explainer, onExplainerClick
				VMM.bindEvent $explainer, onExplainerClick, "touchend"
			reSize false, true
			VMM.Lib.visible navigation.prevBtn, false
			goToSlide config.current_slide, "easeOutExpo", __duration, true, true
			_active = true
			
		
		touch =
			move: false
			x: 10
			y: 0
			off: 0
			dampen: 48

		content = ""
		_active = false
		layout = parent
		navigation =
			nextBtn: ""
			prevBtn: ""
			nextDate: ""
			prevDate: ""
			nextTitle: ""
			prevTitle: ""

		unless typeof parent_config is "undefined"
			config = parent_config
		else
			config =
				preload: 4
				current_slide: 0
				interval: 10
				something: 0
				width: 720
				height: 400
				ease: "easeInOutExpo"
				duration: 1000
				timeline: false
				spacing: 15
				slider:
					width: 720
					height: 400
					content:
						width: 720
						height: 400
						padding: 120
						padding_default: 120

					nav:
						width: 100
						height: 200
		@ver = "0.6"
		config.slider.width = config.width
		config.slider.height = config.height
		@init = (d) ->
			slides = []
			slide_positions = []
			unless typeof d is "undefined"
				@setData d
			else
				trace "WAITING ON DATA"
			

		@width = (w) ->
			if w? and w isnt ""
				config.slider.width = w
				reSize()
			else
				config.slider.width
			

		@height = (h) ->
			if h? and h isnt ""
				config.slider.height = h
				reSize()
			else
				config.slider.height
			

		@setData = (d) ->
			unless typeof d is "undefined"
				data = d
				build()
			else
				trace "NO DATA"
			

		@getData = ->
			data

		@setConfig = (d) ->
			unless typeof d is "undefined"
				config = d
			else
				trace "NO CONFIG DATA"
			

		@getConfig = ->
			config

		@setSize = (w, h) ->
			config.slider.width = w    if w?
			config.slider.height = h    if h?
			reSize()    if _active
			

		@active = ->
			_active

		@getCurrentNumber = ->
			current_slide

		@setSlide = (n) ->
			goToSlide n
			

		return