# 	VMM.Timeline.TimeNav.js
#        TimeNav
#	This class handles the bottom timeline navigation.
#	It requires the VMM.Util class and VMM.Date class
#================================================== 
define [
	"trace"
	"type"
	"VMM.Browser"
	"VMM.Date"
	"VMM.Library"
	"VMM.Util"
	"VMM.masterConfig"
	"VMM.DragSlider"
	"VMM.ExternalAPI"
	"VMM.MediaElement"
], (trace, type, browser, vDate, library, util,masterConfig, DragSlider,ExternalAPI,MediaElement)->
	timeNav = (parent, content_width, content_height) ->
		
		trace "VMM.Timeline.TimeNav"
		$timenav = undefined
		$content = undefined
		$time = undefined
		$timeintervalminor = undefined
		$timeinterval = undefined
		$timeintervalmajor = undefined
		$timebackground = undefined
		$timeintervalbackground = undefined
		$timenavline = undefined
		$timenavindicator = undefined
		$timeintervalminor_minor = undefined
		$toolbar = undefined
		$zoomin = undefined
		$zoomout = undefined
		$dragslide = undefined
		config = masterConfig.Timeline
		row_height = undefined
		events = {}
		timespan = {}
		layout = parent
		data = []
		era_markers = []
		markers = []
		interval_array = []
		interval_major_array = []
		tags = []
		current_marker = 0
		_active = false
		eras = undefined
		content = undefined
		timeouts = interval_position: ""
		timenav_pos =
			left: ""
			visible:
				left: ""
				right: ""

		timelookup =
			day: 24
			month: 12
			year: 10
			hour: 60
			minute: 60
			second: 1000
			decade: 10
			century: 100
			millenium: 1000
			age: 1000000
			epoch: 10000000
			era: 100000000
			eon: 500000000
			week: 4.34812141
			days_in_month: 30.4368499
			days_in_week: 7
			weeks_in_month: 4.34812141
			weeks_in_year: 52.177457
			days_in_year: 365.242199
			hours_in_day: 24

		dateFractionBrowser =
			day: 86400000
			week: 7
			month: 30.4166666667
			year: 12
			hour: 24
			minute: 1440
			second: 86400
			decade: 10
			century: 100
			millenium: 1000
			age: 1000000
			epoch: 10000000
			era: 100000000
			eon: 500000000

		interval =
			type: "year"
			number: 10
			first: 1970
			last: 2011
			multiplier: 100
			classname: "_idd"
			interval_type: "interval"

		interval_major =
			type: "year"
			number: 10
			first: 1970
			last: 2011
			multiplier: 100
			classname: "major"
			interval_type: "interval major"

		interval_macro =
			type: "year"
			number: 10
			first: 1970
			last: 2011
			multiplier: 100
			classname: "_dd_minor"
			interval_type: "interval minor"

		interval_calc =
			day: {}
			month: {}
			year: {}
			hour: {}
			minute: {}
			second: {}
			decade: {}
			century: {}
			millenium: {}
			week: {}
			age: {}
			epoch: {}
			era: {}
			eon: {}

		row_height = config.nav.marker.height / 2
		config.nav.rows =
			full: [
				1
				row_height * 2
				row_height * 4
			]
			half: [
				1
				row_height
				row_height * 2
				row_height * 3
				row_height * 4
				row_height * 5
			]
			current: []

		config.nav.width = content_width    if content_width? and content_width isnt ""
		config.nav.height = content_height    if content_height? and content_height isnt ""
		onConfigSet = ->
			trace "onConfigSet"
			return
		reSize = (firstrun) ->
			config.nav.constraint.left = (config.width / 2)
			config.nav.constraint.right = config.nav.constraint.right_min - (config.width / 2)
			$dragslide.updateConstraint config.nav.constraint
			library.css $timenavline, "left", Math.round(config.width / 2) + 2
			library.css $timenavindicator, "left", Math.round(config.width / 2) - 8
			goToMarker config.current_slide, config.ease, config.duration, true, firstrun
			return
		upDate = ->
			library.fireEvent layout, "UPDATE"
			return
		onZoomIn = ->
			$dragslide.cancelSlide()
			if config.nav.multiplier.current > config.nav.multiplier.min
				if config.nav.multiplier.current <= 1
					config.nav.multiplier.current = config.nav.multiplier.current - .25
				else
					if config.nav.multiplier.current > 5
						if config.nav.multiplier.current > 16
							config.nav.multiplier.current = Math.round(config.nav.multiplier.current - 10)
						else
							config.nav.multiplier.current = Math.round(config.nav.multiplier.current - 4)
					else
						config.nav.multiplier.current = Math.round(config.nav.multiplier.current - 1)
				config.nav.multiplier.current = config.nav.multiplier.min    if config.nav.multiplier.current <= 0
				refreshTimeline()
			return
		onZoomOut = ->
			$dragslide.cancelSlide()
			if config.nav.multiplier.current < config.nav.multiplier.max
				if config.nav.multiplier.current > 4
					if config.nav.multiplier.current > 16
						config.nav.multiplier.current = Math.round(config.nav.multiplier.current + 10)
					else
						config.nav.multiplier.current = Math.round(config.nav.multiplier.current + 4)
				else
					config.nav.multiplier.current = Math.round(config.nav.multiplier.current + 1)
				config.nav.multiplier.current = config.nav.multiplier.max    if config.nav.multiplier.current >= config.nav.multiplier.max
				refreshTimeline()
			return
		onBackHome = (e) ->
			$dragslide.cancelSlide()
			goToMarker 0
			upDate()
			return
		onMouseScroll = (e) ->
			delta = 0
			scroll_to = 0
			e = window.event    unless e
			e = e.originalEvent    if e.originalEvent
			
			# Browsers unable to differntiate between up/down and left/right scrolling
			#
			#			if (e.wheelDelta) {
			#				delta = e.wheelDelta/6;
			#			} else if (e.detail) {
			#				delta = -e.detail*12;
			#			}
			#			
			
			# Webkit and browsers able to differntiate between up/down and left/right scrolling
			unless typeof e.wheelDeltaX is "undefined"
				delta = e.wheelDeltaY / 6
				if Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)
					delta = e.wheelDeltaX / 6
				else
					
					#delta = e.wheelDeltaY/6;
					delta = 0
			if delta
				e.preventDefault()    if e.preventDefault
				e.returnValue = false
			
			# Stop from scrolling too far
			scroll_to = library.position($timenav).left + delta
			if scroll_to > config.nav.constraint.left
				scroll_to = config.width / 2
			else scroll_to = config.nav.constraint.right    if scroll_to < config.nav.constraint.right
			
			#library.stop($timenav);
			#library.animate($timenav, config.duration/2, "linear", {"left": scroll_to});
			library.css $timenav, "left", scroll_to
			return
		refreshTimeline = ->
			trace "config.nav.multiplier " + config.nav.multiplier.current
			positionMarkers true
			positionEras true
			positionInterval $timeinterval, interval_array, true, true
			positionInterval $timeintervalmajor, interval_major_array, true
			config.nav.constraint.left = (config.width / 2)
			config.nav.constraint.right = config.nav.constraint.right_min - (config.width / 2)
			$dragslide.updateConstraint config.nav.constraint
			return
		
		# MARKER EVENTS
		#		================================================== 
		onMarkerClick = (e) ->
			$dragslide.cancelSlide()
			goToMarker e.data.number
			upDate()
			return
		onMarkerHover = (e) ->
			library.toggleClass e.data.elem, "zFront"
			return
		goToMarker = (n, ease, duration, fast, firstrun) ->
			trace "GO TO MARKER"
			_ease = config.ease
			_duration = config.duration
			is_last = false
			is_first = false
			current_marker = n
			timenav_pos.left = (config.width / 2) - markers[current_marker].pos_left
			timenav_pos.visible.left = Math.abs(timenav_pos.left) - 100
			timenav_pos.visible.right = Math.abs(timenav_pos.left) + config.width + 100
			is_first = true    if current_marker is 0
			is_last = true    if current_marker + 1 is markers.length
			_ease = ease    if ease? and ease isnt ""
			_duration = duration    if duration? and duration isnt ""
			
			# set marker style
			i = 0

			while i < markers.length
				library.removeClass markers[i].marker, "active"
				i++
			if config.start_page and markers[0].type is "start"
				library.visible markers[0].marker, false
				library.addClass markers[0].marker, "start"
			library.addClass markers[current_marker].marker, "active"
			
			# ANIMATE MARKER
			library.stop $timenav
			library.animate $timenav, _duration, _ease,
				left: timenav_pos.left

			return
		
		# TOUCH EVENTS
		#		================================================== 
		onTouchUpdate = (e, b) ->
			library.animate $timenav, b.time / 2, config.ease,
				left: b.left

			return
		
		# CALCULATIONS
		#		================================================== 
		averageMarkerPositionDistance = ->
			last_pos = 0
			pos = 0
			pos_dif = 0
			mp_diff = []
			i = 0
			i = 0
			while i < markers.length
				if data[i].type is "start"
					dontcrashjs2coffee = 0
				else
					_pos = positionOnTimeline(interval, markers[i].relative_pos)
					last_pos = pos
					pos = _pos.begin
					pos_dif = pos - last_pos
					mp_diff.push pos_dif
				i++
			util.average(mp_diff).mean
		averageDateDistance = ->
			last_dd = 0
			dd = 0
			_dd = ""
			date_dif = 0
			date_diffs = []
			is_first_date = true
			i = 0
			i = 0
			while i < data.length
				if data[i].type is "start"
					trace "DATA DATE IS START"
				else
					_dd = data[i].startdate
					last_dd = dd
					dd = _dd
					date_dif = dd - last_dd
					date_diffs.push date_dif
				i++
			util.average date_diffs
		calculateMultiplier = ->
			temp_multiplier = config.nav.multiplier.current
			i = 0
			i = 0
			while i < temp_multiplier
				config.nav.multiplier.current = (config.nav.multiplier.current - 1)    if config.nav.multiplier.current > 1    if averageMarkerPositionDistance() < 75
				i++
			return
		calculateInterval = ->
			
			# NEED TO REWRITE ALL OF THIS
			_first = getDateFractions(data[0].startdate)
			_last = getDateFractions(data[data.length - 1].enddate)
			
			# EON
			interval_calc.eon.type = "eon"
			interval_calc.eon.first = _first.eons
			interval_calc.eon.base = Math.floor(_first.eons)
			interval_calc.eon.last = _last.eons
			interval_calc.eon.number = timespan.eons
			interval_calc.eon.multiplier = timelookup.eons
			interval_calc.eon.minor = timelookup.eons
			
			# ERA
			interval_calc.era.type = "era"
			interval_calc.era.first = _first.eras
			interval_calc.era.base = Math.floor(_first.eras)
			interval_calc.era.last = _last.eras
			interval_calc.era.number = timespan.eras
			interval_calc.era.multiplier = timelookup.eras
			interval_calc.era.minor = timelookup.eras
			
			# EPOCH
			interval_calc.epoch.type = "epoch"
			interval_calc.epoch.first = _first.epochs
			interval_calc.epoch.base = Math.floor(_first.epochs)
			interval_calc.epoch.last = _last.epochs
			interval_calc.epoch.number = timespan.epochs
			interval_calc.epoch.multiplier = timelookup.epochs
			interval_calc.epoch.minor = timelookup.epochs
			
			# AGE
			interval_calc.age.type = "age"
			interval_calc.age.first = _first.ages
			interval_calc.age.base = Math.floor(_first.ages)
			interval_calc.age.last = _last.ages
			interval_calc.age.number = timespan.ages
			interval_calc.age.multiplier = timelookup.ages
			interval_calc.age.minor = timelookup.ages
			
			# MILLENIUM
			interval_calc.millenium.type = "millenium"
			interval_calc.millenium.first = _first.milleniums
			interval_calc.millenium.base = Math.floor(_first.milleniums)
			interval_calc.millenium.last = _last.milleniums
			interval_calc.millenium.number = timespan.milleniums
			interval_calc.millenium.multiplier = timelookup.millenium
			interval_calc.millenium.minor = timelookup.millenium
			
			# CENTURY
			interval_calc.century.type = "century"
			interval_calc.century.first = _first.centuries
			interval_calc.century.base = Math.floor(_first.centuries)
			interval_calc.century.last = _last.centuries
			interval_calc.century.number = timespan.centuries
			interval_calc.century.multiplier = timelookup.century
			interval_calc.century.minor = timelookup.century
			
			# DECADE
			interval_calc.decade.type = "decade"
			interval_calc.decade.first = _first.decades
			interval_calc.decade.base = Math.floor(_first.decades)
			interval_calc.decade.last = _last.decades
			interval_calc.decade.number = timespan.decades
			interval_calc.decade.multiplier = timelookup.decade
			interval_calc.decade.minor = timelookup.decade
			
			# YEAR
			interval_calc.year.type = "year"
			interval_calc.year.first = _first.years
			interval_calc.year.base = Math.floor(_first.years)
			interval_calc.year.last = _last.years
			interval_calc.year.number = timespan.years
			interval_calc.year.multiplier = 1
			interval_calc.year.minor = timelookup.month
			
			# MONTH
			interval_calc.month.type = "month"
			interval_calc.month.first = _first.months
			interval_calc.month.base = Math.floor(_first.months)
			interval_calc.month.last = _last.months
			interval_calc.month.number = timespan.months
			interval_calc.month.multiplier = 1
			interval_calc.month.minor = Math.round(timelookup.week)
			
			# WEEK
			# NOT DONE
			interval_calc.week.type = "week"
			interval_calc.week.first = _first.weeks
			interval_calc.week.base = Math.floor(_first.weeks)
			interval_calc.week.last = _last.weeks
			interval_calc.week.number = timespan.weeks
			interval_calc.week.multiplier = 1
			interval_calc.week.minor = 7
			
			# DAY
			interval_calc.day.type = "day"
			interval_calc.day.first = _first.days
			interval_calc.day.base = Math.floor(_first.days)
			interval_calc.day.last = _last.days
			interval_calc.day.number = timespan.days
			interval_calc.day.multiplier = 1
			interval_calc.day.minor = 24
			
			# HOUR
			interval_calc.hour.type = "hour"
			interval_calc.hour.first = _first.hours
			interval_calc.hour.base = Math.floor(_first.hours)
			interval_calc.hour.last = _last.hours
			interval_calc.hour.number = timespan.hours
			interval_calc.hour.multiplier = 1
			interval_calc.hour.minor = 60
			
			# MINUTE
			interval_calc.minute.type = "minute"
			interval_calc.minute.first = _first.minutes
			interval_calc.minute.base = Math.floor(_first.minutes)
			interval_calc.minute.last = _last.minutes
			interval_calc.minute.number = timespan.minutes
			interval_calc.minute.multiplier = 1
			interval_calc.minute.minor = 60
			
			# SECOND
			interval_calc.second.type = "decade"
			interval_calc.second.first = _first.seconds
			interval_calc.second.base = Math.floor(_first.seconds)
			interval_calc.second.last = _last.seconds
			interval_calc.second.number = timespan.seconds
			interval_calc.second.multiplier = 1
			interval_calc.second.minor = 10
			return
		getDateFractions = (the_date, is_utc) ->
			_time = {}
			_time.days = the_date / dateFractionBrowser.day
			_time.weeks = _time.days / dateFractionBrowser.week
			_time.months = _time.days / dateFractionBrowser.month
			_time.years = _time.months / dateFractionBrowser.year
			_time.hours = _time.days * dateFractionBrowser.hour
			_time.minutes = _time.days * dateFractionBrowser.minute
			_time.seconds = _time.days * dateFractionBrowser.second
			_time.decades = _time.years / dateFractionBrowser.decade
			_time.centuries = _time.years / dateFractionBrowser.century
			_time.milleniums = _time.years / dateFractionBrowser.millenium
			_time.ages = _time.years / dateFractionBrowser.age
			_time.epochs = _time.years / dateFractionBrowser.epoch
			_time.eras = _time.years / dateFractionBrowser.era
			_time.eons = _time.years / dateFractionBrowser.eon
			
			#
			#			trace("AGES "		 + 		_time.ages);
			#			trace("EPOCHS "		 + 		_time.epochs);
			#			trace("MILLENIUMS "    + 		_time.milleniums);
			#			trace("CENTURIES "	 + 		_time.centuries);
			#			trace("DECADES "	 + 		_time.decades);
			#			trace("YEARS "		 + 		_time.years);
			#			trace("MONTHS "		 + 		_time.months);
			#			trace("WEEKS "		 + 		_time.weeks);
			#			trace("DAYS "		 + 		_time.days);
			#			trace("HOURS "		 + 		_time.hours);
			#			trace("MINUTES "	 + 		_time.minutes);
			#			trace("SECONDS "	 + 		_time.seconds);
			#			
			_time
		
		#	POSITION
		#			Positions elements on the timeline based on date
		#			relative to the calculated interval
		#		================================================== 
		positionRelative = (_interval, first, last) ->
			_first = undefined
			_last = undefined
			_type = _interval.type
			timerelative =
				start: ""
				end: ""
				type: _type

			
			# FIRST
			#			================================================== 
			_first = getDateFractions(first)
			timerelative.start = first.months
			if _type is "eon"
				timerelative.start = _first.eons
			else if _type is "era"
				timerelative.start = _first.eras
			else if _type is "epoch"
				timerelative.start = _first.epochs
			else if _type is "age"
				timerelative.start = _first.ages
			else if _type is "millenium"
				timerelative.start = first.milleniums
			else if _type is "century"
				timerelative.start = _first.centuries
			else if _type is "decade"
				timerelative.start = _first.decades
			else if _type is "year"
				timerelative.start = _first.years
			else if _type is "month"
				timerelative.start = _first.months
			else if _type is "week"
				timerelative.start = _first.weeks
			else if _type is "day"
				timerelative.start = _first.days
			else if _type is "hour"
				timerelative.start = _first.hours
			else timerelative.start = _first.minutes    if _type is "minute"
			
			# LAST
			#			================================================== 
			if type.of(last) is "date"
				_last = getDateFractions(last)
				timerelative.end = last.months
				if _type is "eon"
					timerelative.end = _last.eons
				else if _type is "era"
					timerelative.end = _last.eras
				else if _type is "epoch"
					timerelative.end = _last.epochs
				else if _type is "age"
					timerelative.end = _last.ages
				else if _type is "millenium"
					timerelative.end = last.milleniums
				else if _type is "century"
					timerelative.end = _last.centuries
				else if _type is "decade"
					timerelative.end = _last.decades
				else if _type is "year"
					timerelative.end = _last.years
				else if _type is "month"
					timerelative.end = _last.months
				else if _type is "week"
					timerelative.end = _last.weeks
				else if _type is "day"
					timerelative.end = _last.days
				else if _type is "hour"
					timerelative.end = _last.hours
				else timerelative.end = _last.minutes    if _type is "minute"
			else
				timerelative.end = timerelative.start
			timerelative
		positionOnTimeline = (the_interval, timerelative) ->
			begin: (timerelative.start - interval.base) * (config.nav.interval_width / config.nav.multiplier.current)
			end: (timerelative.end - interval.base) * (config.nav.interval_width / config.nav.multiplier.current)
		positionMarkers = (is_animated) ->
			row = 2
			previous_pos = 0
			pos_offset = -2
			row_depth = 0
			row_depth_sub = 0
			line_last_height_pos = 150
			line_height = 6
			cur_mark = 0
			in_view_margin = config.width
			pos_cache_array = []
			pos_cache_max = 6
			in_view =
				left: timenav_pos.visible.left - in_view_margin
				right: timenav_pos.visible.right + in_view_margin

			i = 0
			k = 0
			config.nav.minor_width = config.width
			library.removeClass ".flag", "row1"
			library.removeClass ".flag", "row2"
			library.removeClass ".flag", "row3"
			i = 0
			while i < markers.length
				line = undefined
				marker = markers[i]
				pos = positionOnTimeline(interval, markers[i].relative_pos)
				row_pos = 0
				is_in_view = false
				pos_cache_obj =
					id: i
					pos: 0
					row: 0

				pos_cache_close = 0
				
				# COMPENSATE FOR DATES BEING POITIONED IN THE MIDDLE
				pos.begin = Math.round(pos.begin + pos_offset)
				pos.end = Math.round(pos.end + pos_offset)
				line = Math.round(pos.end - pos.begin)
				marker.pos_left = pos.begin
				if current_marker is i
					timenav_pos.left = (config.width / 2) - pos
					timenav_pos.visible.left = Math.abs(timenav_pos.left)
					timenav_pos.visible.right = Math.abs(timenav_pos.left) + config.width
					in_view.left = timenav_pos.visible.left - in_view_margin
					in_view.right = timenav_pos.visible.right + in_view_margin
				is_in_view = true    if Math.abs(pos.begin) >= in_view.left and Math.abs(pos.begin) <= in_view.right
				
				# APPLY POSITION TO MARKER
				if is_animated
					library.stop marker.marker
					library.animate marker.marker, config.duration / 2, config.ease,
						left: pos.begin

				else
					library.stop marker.marker
					library.css marker.marker, "left", pos.begin
				cur_mark = pos.begin    if i is current_marker
				
				# EVENT LENGTH LINE
				if line > 5
					library.css marker.lineevent, "height", line_height
					library.css marker.lineevent, "top", line_last_height_pos
					if is_animated
						library.animate marker.lineevent, config.duration / 2, config.ease,
							width: line

					else
						library.css marker.lineevent, "width", line
				
				# CONTROL ROW POSITION
				if tags.length > 0
					k = 0
					while k < tags.length
						if k < config.nav.rows.current.length
							if marker.tag is tags[k]
								row = k
								if k is config.nav.rows.current.length - 1
									trace "ON LAST ROW"
									library.addClass marker.flag, "flag-small-last"
						k++
					row_pos = config.nav.rows.current[row]
				else
					if pos.begin - previous_pos.begin < (config.nav.marker.width + config.spacing)
						if row < config.nav.rows.current.length - 1
							row++
						else
							row = 0
							row_depth++
					else
						row_depth = 1
						row = 1
					row_pos = config.nav.rows.current[row]
				
				# SET LAST MARKER POSITION
				previous_pos = pos
				
				# POSITION CACHE
				pos_cache_obj.pos = pos
				pos_cache_obj.row = row
				pos_cache_array.push pos_cache_obj
				util.removeRange pos_cache_array, 0    if pos_cache_array.length > pos_cache_max
				
				#if (is_animated && is_in_view) {
				if is_animated
					library.stop marker.flag
					library.animate marker.flag, config.duration, config.ease,
						top: row_pos

				else
					library.stop marker.flag
					library.css marker.flag, "top", row_pos
				
				# IS THE MARKER A REPRESENTATION OF A START SCREEN?
				library.visible marker.marker, false    if config.start_page and markers[i].type is "start"
				config.nav.minor_width = pos    if pos > config.nav.minor_width
				config.nav.minor_left = pos    if pos < config.nav.minor_left
				i++
			
			# ANIMATE THE TIMELINE TO ADJUST TO CHANGES
			if is_animated
				library.stop $timenav
				library.animate $timenav, config.duration / 2, config.ease,
					left: (config.width / 2) - (cur_mark)

			else

			return
		
		#library.delay_animate(config.duration, $timenav, config.duration/2, config.ease, {"left": (config.width/2) - (cur_mark)});
		positionEras = (is_animated) ->
			i = 0
			p = 0
			i = 0
			while i < era_markers.length
				era = era_markers[i]
				pos = positionOnTimeline(interval, era.relative_pos)
				row_pos = 0
				row = 0
				era_height = config.nav.marker.height * config.nav.rows.full.length
				era_length = pos.end - pos.begin
				
				# CONTROL ROW POSITION
				unless era.tag is ""
					era_height = (config.nav.marker.height * config.nav.rows.full.length) / config.nav.rows.current.length
					p = 0
					while p < tags.length
						row = p    if era.tag is tags[p]    if p < config.nav.rows.current.length
						p++
					row_pos = config.nav.rows.current[row]
				else
					row_pos = -1
				
				# APPLY POSITION TO MARKER
				if is_animated
					library.stop era.content
					library.stop era.text_content
					library.animate era.content, config.duration / 2, config.ease,
						top: row_pos
						left: pos.begin
						width: era_length
						height: era_height

					library.animate era.text_content, config.duration / 2, config.ease,
						left: pos.begin

				else
					library.stop era.content
					library.stop era.text_content
					library.css era.content, "left", pos.begin
					library.css era.content, "width", era_length
					library.css era.content, "height", era_height
					library.css era.content, "top", row_pos
					library.css era.text_content, "left", pos.begin
				i++
			return
		positionInterval = (the_main_element, the_intervals, is_animated, is_minor) ->
			last_position = 0
			last_position_major = 0
			
			#in_view_margin		= (config.nav.minor_width/config.nav.multiplier.current)/2,
			in_view_margin = config.width
			in_view =
				left: timenav_pos.visible.left - in_view_margin
				right: timenav_pos.visible.right + in_view_margin

			not_too_many = true
			i = 0

			config.nav.minor_left = 0
			if the_intervals.length > 100
				not_too_many = false
				trace "TOO MANY " + the_intervals.length
			i = 0
			while i < the_intervals.length
				_interval = the_intervals[i].element
				_interval_date = the_intervals[i].date
				_interval_visible = the_intervals[i].visible
				_pos = positionOnTimeline(interval, the_intervals[i].relative_pos)
				pos = _pos.begin
				_animation = the_intervals[i].animation
				is_visible = true
				is_in_view = false
				pos_offset = 50
				_animation.pos = pos
				_animation.animate = false
				is_in_view = true    if Math.abs(pos) >= in_view.left and Math.abs(pos) <= in_view.right
				if true
					
					# CONDENSE WHAT IS DISPLAYED
					if config.nav.multiplier.current > 16 and is_minor
						is_visible = false
					else
						if (pos - last_position) < 65
							if (pos - last_position) < 35
								if i % 4 is 0
									is_visible = false    if pos is 0
								else
									is_visible = false
							else
								is_visible = false    unless util.isEven(i)
					if is_visible
						if the_intervals[i].is_detached
							library.append the_main_element, _interval
							the_intervals[i].is_detached = false
					else
						the_intervals[i].is_detached = true
						library.detach _interval
					if _interval_visible
						unless is_visible
							_animation.opacity = "0"
							_animation.animate = true    if is_animated and not_too_many
							the_intervals[i].interval_visible = false
						else
							_animation.opacity = "100"
							_animation.animate = true    if is_animated and is_in_view
					else
						_animation.opacity = "100"
						if is_visible
							if is_animated and not_too_many
								_animation.animate = true
							else
								_animation.animate = true    if is_animated and is_in_view
							the_intervals[i].interval_visible = true
						else
							_animation.animate = true    if is_animated and not_too_many
					last_position = pos
					config.nav.minor_width = pos    if pos > config.nav.minor_width
					config.nav.minor_left = pos    if pos < config.nav.minor_left
				if _animation.animate
					library.animate _interval, config.duration / 2, config.ease,
						opacity: _animation.opacity
						left: _animation.pos

				else
					library.css _interval, "opacity", _animation.opacity
					library.css _interval, "left", pos
				i++
			config.nav.constraint.right_min = -(config.nav.minor_width) + (config.width)
			config.nav.constraint.right = config.nav.constraint.right_min + (config.width / 2)
			library.css $timeintervalminor_minor, "left", config.nav.minor_left - (config.width) / 2
			library.width $timeintervalminor_minor, (config.nav.minor_width) + (config.width) + Math.abs(config.nav.minor_left)
			return
		
		# Interval Elements
		#		================================================== 
		createIntervalElements = (_interval, _array, _element_parent) ->
			inc_time = 0
			_first_run = true
			_last_pos = 0
			_largest_pos = 0
			_timezone_offset = undefined
			_first_date = undefined
			_last_date = undefined
			int_number = Math.ceil(_interval.number) + 2
			firefox =
				flag: false
				offset: 0

			i = 0
			library.attachElement _element_parent, ""
			_interval.date = new Date(data[0].startdate.getFullYear(), 0, 1, 0, 0, 0)
			_timezone_offset = _interval.date.getTimezoneOffset()
			i = 0
			while i < int_number
				trace _interval.type
				_is_year = false
				int_obj =
					element: library.appendAndGetElement(_element_parent, "<div>", _interval.classname)
					date: new Date(data[0].startdate.getFullYear(), 0, 1, 0, 0, 0)
					visible: false
					date_string: ""
					type: _interval.interval_type
					relative_pos: 0
					is_detached: false
					animation:
						animate: false
						pos: ""
						opacity: "100"

				if _interval.type is "eon"
					_first_date = Math.floor(data[0].startdate.getFullYear() / 500000000) * 500000000    if _first_run
					int_obj.date.setFullYear _first_date + (inc_time * 500000000)
					_is_year = true
				else if _interval.type is "era"
					_first_date = Math.floor(data[0].startdate.getFullYear() / 100000000) * 100000000    if _first_run
					int_obj.date.setFullYear _first_date + (inc_time * 100000000)
					_is_year = true
				else if _interval.type is "epoch"
					_first_date = Math.floor(data[0].startdate.getFullYear() / 10000000) * 10000000    if _first_run
					int_obj.date.setFullYear _first_date + (inc_time * 10000000)
					_is_year = true
				else if _interval.type is "age"
					_first_date = Math.floor(data[0].startdate.getFullYear() / 1000000) * 1000000    if _first_run
					int_obj.date.setFullYear _first_date + (inc_time * 1000000)
					_is_year = true
				else if _interval.type is "millenium"
					_first_date = Math.floor(data[0].startdate.getFullYear() / 1000) * 1000    if _first_run
					int_obj.date.setFullYear _first_date + (inc_time * 1000)
					_is_year = true
				else if _interval.type is "century"
					_first_date = Math.floor(data[0].startdate.getFullYear() / 100) * 100    if _first_run
					int_obj.date.setFullYear _first_date + (inc_time * 100)
					_is_year = true
				else if _interval.type is "decade"
					_first_date = Math.floor(data[0].startdate.getFullYear() / 10) * 10    if _first_run
					int_obj.date.setFullYear _first_date + (inc_time * 10)
					_is_year = true
				else if _interval.type is "year"
					_first_date = data[0].startdate.getFullYear()    if _first_run
					int_obj.date.setFullYear _first_date + inc_time
					_is_year = true
				else if _interval.type is "month"
					_first_date = data[0].startdate.getMonth()    if _first_run
					int_obj.date.setMonth _first_date + inc_time
				else if _interval.type is "week"
					_first_date = data[0].startdate.getMonth()    if _first_run
					int_obj.date.setMonth data[0].startdate.getMonth()
					int_obj.date.setDate _first_date + (inc_time * 7)
				else if _interval.type is "day"
					_first_date = data[0].startdate.getDate()    if _first_run
					int_obj.date.setMonth data[0].startdate.getMonth()
					int_obj.date.setDate _first_date + inc_time
				else if _interval.type is "hour"
					_first_date = data[0].startdate.getHours()    if _first_run
					int_obj.date.setMonth data[0].startdate.getMonth()
					int_obj.date.setDate data[0].startdate.getDate()
					int_obj.date.setHours _first_date + inc_time
				else if _interval.type is "minute"
					_first_date = data[0].startdate.getMinutes()    if _first_run
					int_obj.date.setMonth data[0].startdate.getMonth()
					int_obj.date.setDate data[0].startdate.getDate()
					int_obj.date.setHours data[0].startdate.getHours()
					int_obj.date.setMinutes _first_date + inc_time
				else if _interval.type is "second"
					_first_date = data[0].startdate.getSeconds()    if _first_run
					int_obj.date.setMonth data[0].startdate.getMonth()
					int_obj.date.setDate data[0].startdate.getDate()
					int_obj.date.setHours data[0].startdate.getHours()
					int_obj.date.setMinutes data[0].startdate.getMinutes()
					int_obj.date.setSeconds _first_date + inc_time
				else if _interval.type is "millisecond"
					_first_date = data[0].startdate.getMilliseconds()    if _first_run
					int_obj.date.setMonth data[0].startdate.getMonth()
					int_obj.date.setDate data[0].startdate.getDate()
					int_obj.date.setHours data[0].startdate.getHours()
					int_obj.date.setMinutes data[0].startdate.getMinutes()
					int_obj.date.setSeconds data[0].startdate.getSeconds()
					int_obj.date.setMilliseconds _first_date + inc_time
				
				# FIX WEIRD FIREFOX BUG FOR GMT TIME FORMATTING
				if browser.browser is "Firefox"
					if int_obj.date.getFullYear() is "1970" and int_obj.date.getTimezoneOffset() isnt _timezone_offset
						trace "FIREFOX 1970 TIMEZONE OFFSET " + int_obj.date.getTimezoneOffset() + " SHOULD BE " + _timezone_offset
						trace _interval.type + " " + _interval.date
						
						# try and fix firefox bug, if not the flag will catch it
						firefox.offset = (int_obj.date.getTimezoneOffset() / 60)
						firefox.flag = true
						int_obj.date.setHours int_obj.date.getHours() + firefox.offset
					else if firefox.flag
						
						# catch the bug the second time around
						firefox.flag = false
						int_obj.date.setHours int_obj.date.getHours() + firefox.offset
						firefox.flag = true    if _is_year
				if _is_year
					if int_obj.date.getFullYear() < 0
						int_obj.date_string = Math.abs(int_obj.date.getFullYear()).toString() + " B.C."
					else
						int_obj.date_string = int_obj.date.getFullYear()
				else
					int_obj.date_string = vDate.prettyDate(int_obj.date, true)
				
				# Increment Time
				inc_time = inc_time + 1
				
				# No longer first run
				_first_run = false
				int_obj.relative_pos = positionRelative(interval, int_obj.date)
				_last_pos = int_obj.relative_pos.begin
				_largest_pos = int_obj.relative_pos.begin    if int_obj.relative_pos.begin > _largest_pos
				
				# Add the time string to the element and position it.
				library.appendElement int_obj.element, int_obj.date_string
				library.css int_obj.element, "text-indent", -(library.width(int_obj.element) / 2)
				library.css int_obj.element, "opacity", "0"
				
				# add the interval element to the array
				_array.push int_obj
				i++
			library.width $timeintervalminor_minor, _largest_pos
			positionInterval _element_parent, _array
			return
		
		# BUILD
		#		================================================== 
		build = ->
			i = 0
			j = 0
			library.attachElement layout, ""
			$timenav = library.appendAndGetElement(layout, "<div>", "timenav")
			$content = library.appendAndGetElement($timenav, "<div>", "content")
			$time = library.appendAndGetElement($timenav, "<div>", "time")
			$timeintervalminor = library.appendAndGetElement($time, "<div>", "time-interval-minor")
			$timeintervalminor_minor = library.appendAndGetElement($timeintervalminor, "<div>", "minor")
			$timeintervalmajor = library.appendAndGetElement($time, "<div>", "time-interval-major")
			$timeinterval = library.appendAndGetElement($time, "<div>", "time-interval")
			$timebackground = library.appendAndGetElement(layout, "<div>", "timenav-background")
			$timenavline = library.appendAndGetElement($timebackground, "<div>", "timenav-line")
			$timenavindicator = library.appendAndGetElement($timebackground, "<div>", "timenav-indicator")
			$timeintervalbackground = library.appendAndGetElement($timebackground, "<div>", "timenav-interval-background", "<div class='top-highlight'></div>")
			$toolbar = library.appendAndGetElement(layout, "<div>", "vco-toolbar")
			buildInterval()
			buildMarkers()
			buildEras()
			calculateMultiplier()
			positionMarkers false
			positionEras()
			positionInterval $timeinterval, interval_array, false, true
			positionInterval $timeintervalmajor, interval_major_array
			if config.start_page
				$backhome = library.appendAndGetElement($toolbar, "<div>", "back-home", "<div class='icon'></div>")
				library.bindEvent ".back-home", onBackHome, "click"
				library.attribute $backhome, "title", masterConfig.language.messages.return_to_title
				library.attribute $backhome, "rel", "timeline-tooltip"
			
			# MAKE TIMELINE DRAGGABLE/TOUCHABLE
			$dragslide = new DragSlider()
			$dragslide.createPanel layout, $timenav, config.nav.constraint, config.touch
			if config.touch and config.start_page
				library.addClass $toolbar, "touch"
				library.css $toolbar, "top", 55
				library.css $toolbar, "left", 10
			else
				library.css $toolbar, "top", 27    if config.start_page
				$zoomin = library.appendAndGetElement($toolbar, "<div>", "zoom-in", "<div class='icon'></div>")
				$zoomout = library.appendAndGetElement($toolbar, "<div>", "zoom-out", "<div class='icon'></div>")
				
				# ZOOM EVENTS
				library.bindEvent $zoomin, onZoomIn, "click"
				library.bindEvent $zoomout, onZoomOut, "click"
				
				# TOOLTIP
				library.attribute $zoomin, "title", masterConfig.language.messages.expand_timeline
				library.attribute $zoomin, "rel", "timeline-tooltip"
				library.attribute $zoomout, "title", masterConfig.language.messages.contract_timeline
				library.attribute $zoomout, "rel", "timeline-tooltip"
				$toolbar.tooltip
					selector: "div[rel=timeline-tooltip]"
					placement: "right"

				
				# MOUSE EVENTS
				library.bindEvent layout, onMouseScroll, "DOMMouseScroll"
				library.bindEvent layout, onMouseScroll, "mousewheel"
			
			# USER CONFIGURABLE ADJUSTMENT TO DEFAULT ZOOM
			unless config.nav.zoom.adjust is 0
				if config.nav.zoom.adjust < 0
					i = 0
					while i < Math.abs(config.nav.zoom.adjust)
						onZoomOut()
						i++
				else
					j = 0
					while j < config.nav.zoom.adjust
						onZoomIn()
						j++
			
			#library.fireEvent(layout, "LOADED");
			_active = true
			reSize true
			library.fireEvent layout, "LOADED"
			return
		buildInterval = ->
			i = 0
			j = 0
			
			# CALCULATE INTERVAL
			timespan = getDateFractions((data[data.length - 1].enddate) - (data[0].startdate), true)
			trace timespan
			calculateInterval()
			
			# DETERMINE DEFAULT INTERVAL TYPE
			#				millenium, ages, epoch, era and eon are not optimized yet. They may never be.
			#			================================================== 
			
			#
			#			if (timespan.eons				>		data.length / config.nav.density) {
			#				interval					=		interval_calc.eon;
			#				interval_major				=		interval_calc.eon;
			#				interval_macro				=		interval_calc.era;
			#			} else if (timespan.eras		>		data.length / config.nav.density) {
			#				interval					=		interval_calc.era;
			#				interval_major				=		interval_calc.eon;
			#				interval_macro				=		interval_calc.epoch;
			#			} else if (timespan.epochs		>		data.length / config.nav.density) {
			#				interval					=		interval_calc.epoch;
			#				interval_major				=		interval_calc.era;
			#				interval_macro				=		interval_calc.age;
			#			} else if (timespan.ages		>		data.length / config.nav.density) {
			#				interval					=		interval_calc.ages;
			#				interval_major				=		interval_calc.epoch;
			#				interval_macro				=		interval_calc.millenium;
			#			} else if (timespan.milleniums			>		data.length / config.nav.density) {
			#				interval					=		interval_calc.millenium;
			#				interval_major				=		interval_calc.age;
			#				interval_macro				=		interval_calc.century;
			#			} else 
			#			
			if timespan.centuries > data.length / config.nav.density
				interval = interval_calc.century
				interval_major = interval_calc.millenium
				interval_macro = interval_calc.decade
			else if timespan.decades > data.length / config.nav.density
				interval = interval_calc.decade
				interval_major = interval_calc.century
				interval_macro = interval_calc.year
			else if timespan.years > data.length / config.nav.density
				interval = interval_calc.year
				interval_major = interval_calc.decade
				interval_macro = interval_calc.month
			else if timespan.months > data.length / config.nav.density
				interval = interval_calc.month
				interval_major = interval_calc.year
				interval_macro = interval_calc.day
			else if timespan.days > data.length / config.nav.density
				interval = interval_calc.day
				interval_major = interval_calc.month
				interval_macro = interval_calc.hour
			else if timespan.hours > data.length / config.nav.density
				interval = interval_calc.hour
				interval_major = interval_calc.day
				interval_macro = interval_calc.minute
			else if timespan.minutes > data.length / config.nav.density
				interval = interval_calc.minute
				interval_major = interval_calc.hour
				interval_macro = interval_calc.second
			else if timespan.seconds > data.length / config.nav.density
				interval = interval_calc.second
				interval_major = interval_calc.minute
				interval_macro = interval_calc.second
			else
				trace "NO IDEA WHAT THE TYPE SHOULD BE"
				interval = interval_calc.day
				interval_major = interval_calc.month
				interval_macro = interval_calc.hour
			trace "INTERVAL TYPE: " + interval.type
			trace "INTERVAL MAJOR TYPE: " + interval_major.type
			createIntervalElements interval, interval_array, $timeinterval
			createIntervalElements interval_major, interval_major_array, $timeintervalmajor
			
			# Cleanup duplicate interval elements between normal and major
			i = 0
			while i < interval_array.length
				j = 0
				while j < interval_major_array.length
					library.attachElement interval_array[i].element, ""    if interval_array[i].date_string is interval_major_array[j].date_string
					j++
				i++
			return
		buildMarkers = ->
			row = 2
			lpos = 0
			row_depth = 0
			i = 0
			k = 0
			l = 0
			markers = []
			era_markers = []
			i = 0
			while i < data.length
				_marker = undefined
				_marker_flag = undefined
				_marker_content = undefined
				_marker_dot = undefined
				_marker_line = undefined
				_marker_line_event = undefined
				_marker_obj = undefined
				_marker_title = ""
				has_title = false
				_marker = library.appendAndGetElement($content, "<div>", "marker")
				_marker_flag = library.appendAndGetElement(_marker, "<div>", "flag")
				_marker_content = library.appendAndGetElement(_marker_flag, "<div>", "flag-content")
				_marker_dot = library.appendAndGetElement(_marker, "<div>", "dot")
				_marker_line = library.appendAndGetElement(_marker, "<div>", "line")
				_marker_line_event = library.appendAndGetElement(_marker_line, "<div>", "event-line")
				_marker_relative_pos = positionRelative(interval, data[i].startdate, data[i].enddate)
				_marker_thumb = ""
				
				# THUMBNAIL
				if data[i].asset? and data[i].asset isnt ""
					library.appendElement _marker_content, MediaElement.thumbnail(data[i].asset, 24, 24, data[i].uniqueid)
				else
					library.appendElement _marker_content, "<div style='margin-right:7px;height:50px;width:2px;float:left;'></div>"
				
				# ADD DATE AND TITLE
				if data[i].title is "" or data[i].title is " "
					trace "TITLE NOTHING"
					if typeof data[i].slug isnt "undefined" and data[i].slug isnt ""
						trace "SLUG"
						_marker_title = util.untagify(data[i].slug)
						has_title = true
					else
						m = ExternalAPI.mediaTypeFromAsset(data[i].asset)
						if m.type is "quote" or m.type is "unknown"
							_marker_title = util.untagify(m.id)
							has_title = true
						else
							has_title = false
				else if data[i].title isnt "" or data[i].title isnt " "
					trace data[i].title
					_marker_title = util.untagify(data[i].title)
					has_title = true
				else
					trace "TITLE SLUG NOT FOUND " + data[i].slug
				if has_title
					library.appendElement _marker_content, "<h3>" + _marker_title + "</h3>"
				else
					library.appendElement _marker_content, "<h3>" + _marker_title + "</h3>"
					library.appendElement _marker_content, "<h3 id='marker_content_" + data[i].uniqueid + "'>" + _marker_title + "</h3>"
				
				# ADD ID
				library.attr _marker, "id", ("marker_" + data[i].uniqueid).toString()
				
				# MARKER CLICK
				library.bindEvent _marker_flag, onMarkerClick, "",
					number: i

				library.bindEvent _marker_flag, onMarkerHover, "mouseenter mouseleave",
					number: i
					elem: _marker_flag

				_marker_obj =
					marker: _marker
					flag: _marker_flag
					lineevent: _marker_line_event
					type: "marker"
					full: true
					relative_pos: _marker_relative_pos
					tag: data[i].tag
					pos_left: 0

				if data[i].type is "start"
					trace "BUILD MARKER HAS START PAGE"
					config.start_page = true
					_marker_obj.type = "start"
				_marker_obj.type = "storify"    if data[i].type is "storify"
				tags.push data[i].tag    if data[i].tag
				markers.push _marker_obj
				i++
			
			# CREATE TAGS
			tags = util.deDupeArray(tags)
			if tags.length > 3
				config.nav.rows.current = config.nav.rows.half
			else
				config.nav.rows.current = config.nav.rows.full
			k = 0
			while k < tags.length
				if k < config.nav.rows.current.length
					tag_element = library.appendAndGetElement($timebackground, "<div>", "timenav-tag")
					library.addClass tag_element, "timenav-tag-row-" + (k + 1)
					if tags.length > 3
						library.addClass tag_element, "timenav-tag-size-half"
					else
						library.addClass tag_element, "timenav-tag-size-full"
					library.appendElement tag_element, "<div><h3>" + tags[k] + "</h3></div>"
				k++
			
			# RESIZE FLAGS IF NEEDED
			if tags.length > 3
				l = 0
				while l < markers.length
					library.addClass markers[l].flag, "flag-small"
					markers[l].full = false
					l++
			return
		buildEras = ->
			number_of_colors = 6
			current_color = 0
			j = 0
			
			# CREATE ERAS
			j = 0
			while j < eras.length
				era =
					content: library.appendAndGetElement($content, "<div>", "era")
					text_content: library.appendAndGetElement($timeinterval, "<div>", "era")
					startdate: vDate.parse(eras[j].startDate)
					enddate: vDate.parse(eras[j].endDate)
					title: eras[j].headline
					uniqueid: util.unique_ID(6)
					tag: ""
					relative_pos: ""

				st = vDate.prettyDate(era.startdate)
				en = vDate.prettyDate(era.enddate)
				era_text = "<div>&nbsp;</div>"
				era.tag = eras[j].tag    unless typeof eras[j].tag is "undefined"
				era.relative_pos = positionRelative(interval, era.startdate, era.enddate)
				library.attr era.content, "id", era.uniqueid
				library.attr era.text_content, "id", era.uniqueid + "_text"
				
				# Background Color
				library.addClass era.content, "era" + (current_color + 1)
				library.addClass era.text_content, "era" + (current_color + 1)
				if current_color < number_of_colors
					current_color++
				else
					current_color = 0
				library.appendElement era.content, era_text
				library.appendElement era.text_content, util.unlinkify(era.title)
				era_markers.push era
				j++
			return
		
		
		@init = (d, e) ->
			trace "VMM.Timeline.TimeNav init"
			unless typeof d is "undefined"
				@setData d, e
			else
				trace "WAITING ON DATA"
			return

		@setData = (d, e) ->
			unless typeof d is "undefined"
				data = {}
				data = d
				eras = e
				build()
			else
				trace "NO DATA"
			return

		@setSize = (w, h) ->
			config.width = w    if w?
			config.height = h    if h?
			reSize()    if _active
			return

		@setMarker = (n, ease, duration, fast) ->
			goToMarker n, ease, duration
			return

		@getCurrentNumber = ->
			current_marker

		return