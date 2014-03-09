# VMM.Timeline.js
#	* CodeKit Import
#	* http://incident57.com/codekit/
#================================================== 

# @codekit-prepend "Core/VMM.StoryJS.js";

# @codekit-append "VMM.Timeline.TimeNav.js";
# @codekit-append "dataObj.js";

# Timeline
#================================================== 
define [
	"type"
	"trace"
	"global"
	"VMM.Browser"
	"VMM.Date"
	"VMM.Library"
	"VMM.Util"
	"VMM.masterConfig"
	"VMM.Timeline.TimeNav"
	"VMM.Timeline.DataObj"
	"VMM.Slider"
	"VMM.ExternalAPI"
	"VMM.Language"
	"VMM.Extender"
	"Date.extensions"
	"aes"
	"bootstrap-tooltip"
	"leaflet"
], (type, trace, global, browser, vDate, library, util, masterConfig, TimeNav, dataObj, Slider, ExternalAPI, language)->
	Timeline = (_timeline_id, w, h) ->



		$timeline = undefined
		$container = undefined
		$feature = undefined
		$feedback = undefined
		$slider = undefined
		$navigation = undefined
		slider = undefined
		timenav = undefined
		version = "2.x"
		timeline_id = "#timelinejs"
		events = {}
		data = {}
		_dates = []
		config = {}
		has_width = false
		has_height = false
		ie7 = false
		is_moving = false

		#CONFIG
		#		================================================== 
		
		# CREATE CONFIG
		#		================================================== 
		createConfig = (conf) ->
			
			# APPLY SUPPLIED CONFIG TO TIMELINE CONFIG
			timeline_config = embed_config    if typeof embed_config is "object"
			if typeof timeline_config is "object"
				trace "HAS TIMELINE CONFIG"
				config = util.mergeConfig(config, timeline_config)
			else config = util.mergeConfig(config, conf)    if typeof conf is "object"
			config.touch = true    if browser.device is "mobile" or browser.device is "tablet"
			config.nav.width = config.width
			config.nav.height = 200
			config.feature.width = config.width
			config.feature.height = config.height - config.nav.height
			config.nav.zoom.adjust = parseInt(config.start_zoom_adjust, 10)
			Timeline.Config = config
			masterConfig.Timeline = Timeline.Config
			@events = config.events
			config.api_keys.google = config.gmap_key    unless config.gmap_key is ""
			trace "VERSION " + config.version
			version = config.version
			return
		
		# CREATE TIMELINE STRUCTURE
		#		================================================== 
		createStructure = ->
			
			# CREATE DOM STRUCTURE
			$timeline = library.getElement(timeline_id)
			library.addClass $timeline, "vco-timeline"
			library.addClass $timeline, "vco-storyjs"
			$container = library.appendAndGetElement($timeline, "<div>", "vco-container vco-main")
			$feature = library.appendAndGetElement($container, "<div>", "vco-feature")
			$slider = library.appendAndGetElement($feature, "<div>", "vco-slider")
			$navigation = library.appendAndGetElement($container, "<div>", "vco-navigation")
			$feedback = library.appendAndGetElement($timeline, "<div>", "vco-feedback", "")
			library.addClass $timeline, "vco-right-to-left"    unless typeof config.language.right_to_left is "undefined"
			slider = new Slider($slider, config)
			timenav = new TimeNav($navigation)
			unless has_width
				config.width = library.width($timeline)
			else
				library.width $timeline, config.width
			unless has_height
				config.height = library.height($timeline)
			else
				library.height $timeline, config.height
			if config.touch
				library.addClass $timeline, "vco-touch"
			else
				library.addClass $timeline, "vco-notouch"
			return
		
		# ON EVENT
		#		================================================== 
		onDataReady = (e, d) ->
			trace "onDataReady"
			data = d.timeline
			data.era = []    unless type.of(data.era) is "array"
			buildDates()
			return
		onDatesProcessed = ->
			build()
			return
		reSize = ->
			updateSize()
			slider.setSize config.feature.width, config.feature.height
			timenav.setSize config.width, config.height
			setViewport()    if orientationChange()
			return
		onSliderLoaded = (e) ->
			config.loaded.slider = true
			onComponentLoaded()
			return
		onComponentLoaded = (e) ->
			config.loaded.percentloaded = config.loaded.percentloaded + 25
			hideMessege()    if config.loaded.slider and config.loaded.timenav
			return
		onTimeNavLoaded = (e) ->
			config.loaded.timenav = true
			onComponentLoaded()
			return
		onSlideUpdate = (e) ->
			is_moving = true
			config.current_slide = slider.getCurrentNumber()
			setHash config.current_slide
			timenav.setMarker config.current_slide, config.ease, config.duration
			return
		onMarkerUpdate = (e) ->
			is_moving = true
			config.current_slide = timenav.getCurrentNumber()
			setHash config.current_slide
			slider.setSlide config.current_slide
			return
		goToEvent = (n) ->
			if n <= _dates.length - 1 and n >= 0
				config.current_slide = n
				slider.setSlide config.current_slide
				timenav.setMarker config.current_slide, config.ease, config.duration
			return
		setHash = (n) ->
			window.location.hash = "#" + n.toString()    if config.hash_bookmark
			return
		getViewport = ->
		setViewport = ->
			viewport_content = ""
			viewport_orientation = searchOrientation(window.orientation)
			if browser.device is "mobile"
				if viewport_orientation is "portrait"
					
					#viewport_content	= "width=device-width; initial-scale=0.75, maximum-scale=0.75";
					viewport_content = "width=device-width; initial-scale=0.5, maximum-scale=0.5"
				else if viewport_orientation is "landscape"
					viewport_content = "width=device-width; initial-scale=0.5, maximum-scale=0.5"
				else
					viewport_content = "width=device-width, initial-scale=1, maximum-scale=1.0"
			else dontcrashjs2coffee = 0    if browser.device is "tablet"
			
			#viewport_content		= "width=device-width, initial-scale=1, maximum-scale=1.0";
			if document.getElementById("viewport")
				dontcrashjs2coffee = 0
			
			#library.attr("#viewport", "content", viewport_content);
			else
				dontcrashjs2coffee = 0
			return
		
		#library.appendElement("head", "<meta id='viewport' name='viewport' content=" + viewport_content + "/>");
		
		# ORIENTATION
		#		================================================== 
		searchOrientation = (orientation) ->
			orient = ""
			if orientation is 0 or orientation is 180
				orient = "portrait"
			else if orientation is 90 or orientation is -90
				orient = "landscape"
			else
				orient = "normal"
			orient
		orientationChange = ->
			orientation = searchOrientation(window.orientation)
			if orientation is config.orientation
				false
			else
				config.orientation = orientation
				true
		
		# PUBLIC FUNCTIONS
		#		================================================== 
		
		# LANGUAGE
		
		# EXTERNAL API
		
		# EVENTS
		
		# GET DATA
		#			================================================== 
		
		#DataObj.getData(library.getElement(timeline_id));
		
		# DATA 
		#		================================================== 
		getData = (url) ->
			library.getJSON url, (d) ->
				data = dataObj.getData(d)
				library.fireEvent global, config.events.data_ready
				return

			return
		
		# MESSEGES 
		#		================================================== 
		showMessege = (e, msg, other) ->
			trace "showMessege " + msg
			
			#library.attachElement($timeline, $feedback);
			if other
				library.attachElement $feedback, msg
			else
				library.attachElement $feedback, library.loadingmessage(msg)
			return
		hideMessege = ->
			library.animate $feedback, config.duration, config.ease * 4,
				opacity: 0
			, detachMessege
			return
		detachMessege = ->
			library.detach $feedback
			return
		
		# BUILD DISPLAY
		#		================================================== 
		build = ->
			
			# START AT SLIDE
			config.current_slide = parseInt(config.start_at_slide)    if parseInt(config.start_at_slide) > 0 and config.current_slide is 0
			
			# START AT END
			config.current_slide = _dates.length - 1    if config.start_at_end and config.current_slide is 0
			
			# IE7
			if ie7
				ie7 = true
				library.fireEvent global, config.events.messege, "Internet Explorer " + browser.version + " is not supported by TimelineJS. Please update your browser to version 8 or higher."
			else
				detachMessege()
				reSize()
				
				# EVENT LISTENERS
				library.bindEvent $slider, onSliderLoaded, "LOADED"
				library.bindEvent $navigation, onTimeNavLoaded, "LOADED"
				library.bindEvent $slider, onSlideUpdate, "UPDATE"
				library.bindEvent $navigation, onMarkerUpdate, "UPDATE"
				
				# INITIALIZE COMPONENTS
				slider.init _dates
				timenav.init _dates, data.era
				
				# RESIZE EVENT LISTENERS
				library.bindEvent global, reSize, config.events.resize
			return
		updateSize = ->
			trace "UPDATE SIZE"
			config.width = library.width($timeline)
			config.height = library.height($timeline)
			config.nav.width = config.width
			config.feature.width = config.width
			config.feature.height = config.height - config.nav.height - 3
			dontcrashjs2coffee = 0    if browser.device is "mobile"
			
			#
			#				if (browser.orientation == "portrait") {
			#					config.feature.height	= 480;
			#					config.height			= 480 + config.nav.height;
			#				} else if(browser.orientation == "landscape") {
			#					config.feature.height	= 320;
			#					config.height			= 320 + config.nav.height;
			#				} else {
			#					config.feature.height = config.height - config.nav.height - 3;
			#				}
			#				
			if config.width < 641
				library.addClass $timeline, "vco-skinny"
			else
				library.removeClass $timeline, "vco-skinny"
			return
		
		# BUILD DATE OBJECTS
		buildDates = ->
			_dates = []
			library.fireEvent global, config.events.messege, "Building Dates"
			updateSize()
			i = 0

			while i < data.date.length
				if data.date[i].startDate? and data.date[i].startDate isnt ""
					_date = {}
					do_start = vDate.parse(data.date[i].startDate, true)
					do_end = undefined
					_date.startdate = do_start.date
					_date.precisiondate = do_start.precision
					unless isNaN(_date.startdate)
						
						# END DATE
						if data.date[i].endDate? and data.date[i].endDate isnt ""
							_date.enddate = vDate.parse(data.date[i].endDate)
						else
							_date.enddate = _date.startdate
						_date.needs_slug = false
						_date.needs_slug = true    if data.date[i].slug? and data.date[i].slug isnt ""    if data.date[i].headline is ""
						_date.title = data.date[i].headline
						_date.headline = data.date[i].headline
						_date.type = data.date[i].type
						_date.date = vDate.prettyDate(_date.startdate, false, _date.precisiondate)
						_date.asset = data.date[i].asset
						_date.fulldate = _date.startdate.getTime()
						_date.text = data.date[i].text
						_date.content = ""
						_date.tag = data.date[i].tag
						_date.slug = data.date[i].slug
						_date.uniqueid = util.unique_ID(7)
						_date.classname = data.date[i].classname
						_dates.push _date
				i++
			
			# CUSTOM SORT
			#			================================================== 
			unless data.type is "storify"
				_dates.sort (a, b) ->
					a.fulldate - b.fulldate

			
			# CREATE START PAGE IF AVAILABLE
			#			================================================== 
			if data.headline? and data.headline isnt "" and data.text? and data.text isnt ""
				startpage_date = undefined
				do_start = undefined
				_date = {}
				td_num = 0
				td = undefined
				unless typeof data.startDate is "undefined"
					do_start = vDate.parse(data.startDate, true)
					startpage_date = do_start.date
				else
					startpage_date = false
				trace "HAS STARTPAGE"
				trace startpage_date
				if startpage_date and startpage_date < _dates[0].startdate
					_date.startdate = new Date(startpage_date)
				else
					td = _dates[0].startdate
					_date.startdate = new Date(_dates[0].startdate)
					if td.getMonth() is 0 and td.getDate() is 1 and td.getHours() is 0 and td.getMinutes() is 0
						
						# trace("YEAR ONLY");
						_date.startdate.setFullYear td.getFullYear() - 1
					else if td.getDate() <= 1 and td.getHours() is 0 and td.getMinutes() is 0
						
						# trace("YEAR MONTH");
						_date.startdate.setMonth td.getMonth() - 1
					else if td.getHours() is 0 and td.getMinutes() is 0
						
						# trace("YEAR MONTH DAY");
						_date.startdate.setDate td.getDate() - 1
					else if td.getMinutes() is 0
						
						# trace("YEAR MONTH DAY HOUR");
						_date.startdate.setHours td.getHours() - 1
					else
						
						# trace("YEAR MONTH DAY HOUR MINUTE");
						_date.startdate.setMinutes td.getMinutes() - 1
				_date.uniqueid = util.unique_ID(7)
				_date.enddate = _date.startdate
				_date.precisiondate = do_start.precision
				_date.title = data.headline
				_date.headline = data.headline
				_date.text = data.text
				_date.type = "start"
				_date.date = vDate.prettyDate(data.startDate, false, _date.precisiondate)
				_date.asset = data.asset
				_date.slug = false
				_date.needs_slug = false
				_date.fulldate = _date.startdate.getTime()
				library.fireEvent global, config.events.headline, _date.headline    if config.embed
				_dates.unshift _date
			
			# CUSTOM SORT
			#			================================================== 
			unless data.type is "storify"
				_dates.sort (a, b) ->
					a.fulldate - b.fulldate

			onDatesProcessed()
			return
		
		if type.of(_timeline_id) is "string"
			if _timeline_id.match("#")
				timeline_id = _timeline_id
			else
				timeline_id = "#" + _timeline_id
		else
			timeline_id = "#timelinejs"
		config =
			embed: false
			events:
				data_ready: "DATAREADY"
				messege: "MESSEGE"
				headline: "HEADLINE"
				slide_change: "SLIDE_CHANGE"
				resize: "resize"

			id: timeline_id
			source: "nothing"
			type: "timeline"
			touch: false
			orientation: "normal"
			maptype: ""
			version: "2.x"
			preload: 4
			current_slide: 0
			hash_bookmark: false
			start_at_end: false
			start_at_slide: 0
			start_zoom_adjust: 0
			start_page: false
			api_keys:
				google: ""
				flickr: ""
				twitter: ""

			interval: 10
			something: 0
			width: 960
			height: 540
			spacing: 15
			loaded:
				slider: false
				timenav: false
				percentloaded: 0

			nav:
				start_page: false
				interval_width: 200
				density: 4
				minor_width: 0
				minor_left: 0
				constraint:
					left: 0
					right: 0
					right_min: 0
					right_max: 0

				zoom:
					adjust: 0

				multiplier:
					current: 6
					min: .1
					max: 50

				rows: [
					1
					1
					1
				]
				width: 960
				height: 200
				marker:
					width: 150
					height: 50

			feature:
				width: 960
				height: 540

			slider:
				width: 720
				height: 400
				content:
					width: 720
					height: 400
					padding: 130
					padding_default: 130

				nav:
					width: 100
					height: 200

			ease: "easeInOutExpo"
			duration: 1000
			gmap_key: ""
			language: language

		if w? and w isnt ""
			config.width = w
			has_width = true
		if h? and h isnt ""
			config.height = h
			has_height = true
		if window.location.hash
			hash = window.location.hash.substring(1)
			config.current_slide = parseInt(hash)    unless isNaN(hash)
		window.onhashchange = ->
			hash = window.location.hash.substring(1)
			if config.hash_bookmark
				if is_moving
					goToEvent parseInt(hash)
				else
					is_moving = false
			else
				goToEvent parseInt(hash)
			return

		@init = (c, _data) ->
			trace "INIT"
			setViewport()
			createConfig c
			createStructure()
			config.source = _data    if type.of(_data) is "string"
			vDate.setLanguage config.language
			masterConfig.language = config.language
			ExternalAPI.setKeys config.api_keys
			ExternalAPI.googlemaps.setMapType config.maptype
			library.bindEvent global, onDataReady, config.events.data_ready
			library.bindEvent global, showMessege, config.events.messege
			library.fireEvent global, config.events.messege, config.language.messages.loading_timeline
			ie7 = true    if parseInt(browser.version, 10) <= 7    if browser.browser is "Explorer" or browser.browser is "MSIE"
			if type.of(config.source) is "string" or type.of(config.source) is "object"
				dataObj.getData config.source
			else
				library.fireEvent global, config.events.messege, "No data source provided"
			return

		@iframeLoaded = ->
			trace "iframeLoaded"
			return

		@reload = (_d) ->
			trace "Load new timeline data" + _d
			library.fireEvent global, config.events.messege, config.language.messages.loading_timeline
			data = {}
			dataObj.getData _d
			config.current_slide = 0
			slider.setSlide 0
			timenav.setMarker 0, config.ease, config.duration
			return

		return

	Timeline.Config = {}
	Timeline