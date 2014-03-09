#	* Utilities and Useful Functions
#================================================== 
define [
	"VMM"
	"trace"
	"type"
], (VMM, trace, type)->
	
	#B.C.
	
	# IE 8 < Won't accept dates with a "-" in them.
	
	# YEAR MONTH DAY HOUR MINUTE
	
	# YEAR MONTH DAY HOUR MINUTE
	
	# YEAR MONTH DAY HOUR
	
	# YEAR MONTH DAY
	
	# YEAR MONTH
	
	# YEAR ONLY
	
	# YEAR MONTH
	
	# YEAR MONTH DAY
	
	# YEAR MONTH DAY HOUR
	
	# YEAR MONTH DAY HOUR MINUTE
	
	#_date = "Jan"
	
	# BC TIME SUPPORT
	
	# BC TIME SUPPORT


		#
	#	 * Date Format 1.2.3
	#	 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
	#	 * MIT license
	#	 *
	#	 * Includes enhancements by Scott Trenda <scott.trenda.net>
	#	 * and Kris Kowal <cixar.com/~kris.kowal/>
	#	 *
	#	 * Accepts a date, a mask, or a date and a mask.
	#	 * Returns a formatted version of the given date.
	#	 * The date defaults to the current date/time.
	#	 * The mask defaults to dateFormat.masks.default.
	#	 
	dateFormat = (->
		token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g
		timezoneClip = /[^-+\dA-Z]/g
		pad = (val, len) ->
			val = String(val)
			len = len or 2
			val = "0" + val    while val.length < len
			val

		
		# Regexes and supporting functions are cached through closure
		(date, mask, utc) ->
			dF = dateFormat
			
			# You can't provide utc if you skip other args (use the "UTC:" mask prefix)
			if arguments.length is 1 and Object::toString.call(date) is "[object String]" and not /\d/.test(date)
				mask = date
				date = `undefined`
			
			# Passing date through Date applies Date.parse, if necessary
			# Caused problems in IE
			# date = date ? new Date(date) : new Date;
			trace "invalid date " + date    if isNaN(date)
			
			#return "";
			mask = String(dF.masks[mask] or mask or dF.masks["default"])
			
			# Allow setting the utc argument via the mask
			if mask.slice(0, 4) is "UTC:"
				mask = mask.slice(4)
				utc = true
			_ = (if utc then "getUTC" else "get")
			d = date[_ + "Date"]()
			D = date[_ + "Day"]()
			m = date[_ + "Month"]()
			y = date[_ + "FullYear"]()
			H = date[_ + "Hours"]()
			M = date[_ + "Minutes"]()
			s = date[_ + "Seconds"]()
			L = date[_ + "Milliseconds"]()
			o = (if utc then 0 else date.getTimezoneOffset())
			flags =
				d: d
				dd: pad(d)
				ddd: dF.i18n.dayNames[D]
				dddd: dF.i18n.dayNames[D + 7]
				m: m + 1
				mm: pad(m + 1)
				mmm: dF.i18n.monthNames[m]
				mmmm: dF.i18n.monthNames[m + 12]
				yy: String(y).slice(2)
				yyyy: y
				h: H % 12 or 12
				hh: pad(H % 12 or 12)
				H: H
				HH: pad(H)
				M: M
				MM: pad(M)
				s: s
				ss: pad(s)
				l: pad(L, 3)
				L: pad((if L > 99 then Math.round(L / 10) else L))
				t: (if H < 12 then "a" else "p")
				tt: (if H < 12 then "am" else "pm")
				T: (if H < 12 then "A" else "P")
				TT: (if H < 12 then "AM" else "PM")
				Z: (if utc then "UTC" else (String(date).match(timezone) or [""]).pop().replace(timezoneClip, ""))
				o: ((if o > 0 then "-" else "+")) + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4)
				S: [
					"th"
					"st"
					"nd"
					"rd"
				][(if d % 10 > 3 then 0 else (d % 100 - d % 10 isnt 10) * d % 10)]

			mask.replace token, ($0) ->
				(if $0 of flags then flags[$0] else $0.slice(1, $0.length - 1))

	)()
	
	# Some common format strings
	dateFormat.masks =
		default: "ddd mmm dd yyyy HH:MM:ss"
		shortDate: "m/d/yy"
		mediumDate: "mmm d, yyyy"
		longDate: "mmmm d, yyyy"
		fullDate: "dddd, mmmm d, yyyy"
		shortTime: "h:MM TT"
		mediumTime: "h:MM:ss TT"
		longTime: "h:MM:ss TT Z"
		isoDate: "yyyy-mm-dd"
		isoTime: "HH:MM:ss"
		isoDateTime: "yyyy-mm-dd'T'HH:MM:ss"
		isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"

	
	# Internationalization strings
	dateFormat.i18n =
		dayNames: [
			"Sun"
			"Mon"
			"Tue"
			"Wed"
			"Thu"
			"Fri"
			"Sat"
			"Sunday"
			"Monday"
			"Tuesday"
			"Wednesday"
			"Thursday"
			"Friday"
			"Saturday"
		]
		monthNames: [
			"Jan"
			"Feb"
			"Mar"
			"Apr"
			"May"
			"Jun"
			"Jul"
			"Aug"
			"Sep"
			"Oct"
			"Nov"
			"Dec"
			"January"
			"February"
			"March"
			"April"
			"May"
			"June"
			"July"
			"August"
			"September"
			"October"
			"November"
			"December"
		]

	
	# For convenience...
	Date::format = (mask, utc) ->
		dateFormat this, mask, utc



	vDate = (
		init: ->
			this

		dateformats:
			year: "yyyy"
			month_short: "mmm"
			month: "mmmm yyyy"
			full_short: "mmm d"
			full: "mmmm d',' yyyy"
			time_short: "h:MM:ss TT"
			time_no_seconds_short: "h:MM TT"
			time_no_seconds_small_date: "h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'"
			full_long: "mmm d',' yyyy 'at' hh:MM TT"
			full_long_small_date: "hh:MM TT'<br/><small>mmm d',' yyyy'</small>'"

		month: [
			"January"
			"February"
			"March"
			"April"
			"May"
			"June"
			"July"
			"August"
			"September"
			"October"
			"November"
			"December"
		]
		month_abbr: [
			"Jan."
			"Feb."
			"March"
			"April"
			"May"
			"June"
			"July"
			"Aug."
			"Sept."
			"Oct."
			"Nov."
			"Dec."
		]
		day: [
			"Sunday"
			"Monday"
			"Tuesday"
			"Wednesday"
			"Thursday"
			"Friday"
			"Saturday"
		]
		day_abbr: [
			"Sun."
			"Mon."
			"Tues."
			"Wed."
			"Thurs."
			"Fri."
			"Sat."
		]
		hour: [
			1
			2
			3
			4
			5
			6
			7
			8
			9
			10
			11
			12
			1
			2
			3
			4
			5
			6
			7
			8
			9
			10
			11
			12
		]
		hour_suffix: ["am"]
		bc_format:
			year: "yyyy"
			month_short: "mmm"
			month: "mmmm yyyy"
			full_short: "mmm d"
			full: "mmmm d',' yyyy"
			time_no_seconds_short: "h:MM TT"
			time_no_seconds_small_date: "dddd', 'h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'"
			full_long: "dddd',' mmm d',' yyyy 'at' hh:MM TT"
			full_long_small_date: "hh:MM TT'<br/><small>'dddd',' mmm d',' yyyy'</small>'"

		setLanguage: (lang) ->
			trace "SET DATE LANGUAGE"
			vDate.dateformats = lang.dateformats
			vDate.month = lang.date.month
			vDate.month_abbr = lang.date.month_abbr
			vDate.day = lang.date.day
			vDate.day_abbr = lang.date.day_abbr
			dateFormat.i18n.dayNames = lang.date.day_abbr.concat(lang.date.day)
			dateFormat.i18n.monthNames = lang.date.month_abbr.concat(lang.date.month)
			return

		parse: (d, precision) ->
			"use strict"
			date = undefined
			date_array = undefined
			time_array = undefined
			time_parse = undefined
			p =
				year: false
				month: false
				day: false
				hour: false
				minute: false
				second: false
				millisecond: false

			if type.of(d) is "date"
				trace "DEBUG THIS, ITs A DATE"
				date = d
			else
				date = new Date(0, 0, 1, 0, 0, 0, 0)
				if d.match(/,/g)
					date_array = d.split(",")
					i = 0

					while i < date_array.length
						date_array[i] = parseInt(date_array[i], 10)
						i++
					if date_array[0]
						date.setFullYear date_array[0]
						p.year = true
					if date_array[1]
						date.setMonth date_array[1] - 1
						p.month = true
					if date_array[2]
						date.setDate date_array[2]
						p.day = true
					if date_array[3]
						date.setHours date_array[3]
						p.hour = true
					if date_array[4]
						date.setMinutes date_array[4]
						p.minute = true
					if date_array[5]
						date.setSeconds date_array[5]
						p.second = true    if date_array[5] >= 1
					if date_array[6]
						date.setMilliseconds date_array[6]
						p.millisecond = true    if date_array[6] >= 1
				else if d.match("/")
					if d.match(" ")
						time_parse = d.split(" ")
						if d.match(":")
							time_array = time_parse[1].split(":")
							if time_array[0] >= 0
								date.setHours time_array[0]
								p.hour = true
							if time_array[1] >= 0
								date.setMinutes time_array[1]
								p.minute = true
							if time_array[2] >= 0
								date.setSeconds time_array[2]
								p.second = true
							if time_array[3] >= 0
								date.setMilliseconds time_array[3]
								p.millisecond = true
						date_array = time_parse[0].split("/")
					else
						date_array = d.split("/")
					if date_array[2]
						date.setFullYear date_array[2]
						p.year = true
					if date_array[0] >= 0
						date.setMonth date_array[0] - 1
						p.month = true
					if date_array[1] >= 0
						if date_array[1].length > 2
							date.setFullYear date_array[1]
							p.year = true
						else
							date.setDate date_array[1]
							p.day = true
				else if d.match("now")
					now = new Date()
					date.setFullYear now.getFullYear()
					p.year = true
					date.setMonth now.getMonth()
					p.month = true
					date.setDate now.getDate()
					p.day = true
					if d.match("hours")
						date.setHours now.getHours()
						p.hour = true
					if d.match("minutes")
						date.setHours now.getHours()
						date.setMinutes now.getMinutes()
						p.hour = true
						p.minute = true
					if d.match("seconds")
						date.setHours now.getHours()
						date.setMinutes now.getMinutes()
						date.setSeconds now.getSeconds()
						p.hour = true
						p.minute = true
						p.second = true
					if d.match("milliseconds")
						date.setHours now.getHours()
						date.setMinutes now.getMinutes()
						date.setSeconds now.getSeconds()
						date.setMilliseconds now.getMilliseconds()
						p.hour = true
						p.minute = true
						p.second = true
						p.millisecond = true
				else if d.length <= 8
					p.year = true
					date.setFullYear parseInt(d, 10)
					date.setMonth 0
					date.setDate 1
					date.setHours 0
					date.setMinutes 0
					date.setSeconds 0
					date.setMilliseconds 0
				else if d.match("T")
					if navigator.userAgent.match(/MSIE\s(?!9.0)/)
						time_parse = d.split("T")
						if d.match(":")
							time_array = time_parse[1].split(":")
							if time_array[0] >= 1
								date.setHours time_array[0]
								p.hour = true
							if time_array[1] >= 1
								date.setMinutes time_array[1]
								p.minute = true
							if time_array[2] >= 1
								date.setSeconds time_array[2]
								p.second = true    if time_array[2] >= 1
							if time_array[3] >= 1
								date.setMilliseconds time_array[3]
								p.millisecond = true    if time_array[3] >= 1
						date_array = time_parse[0].split("-")
						if date_array[0]
							date.setFullYear date_array[0]
							p.year = true
						if date_array[1] >= 0
							date.setMonth date_array[1] - 1
							p.month = true
						if date_array[2] >= 0
							date.setDate date_array[2]
							p.day = true
					else
						date = new Date(Date.parse(d))
						p.year = true
						p.month = true
						p.day = true
						p.hour = true
						p.minute = true
						p.second = true    if date.getSeconds() >= 1
						p.millisecond = true    if date.getMilliseconds() >= 1
				else
					date = new Date(parseInt(d.slice(0, 4), 10), parseInt(d.slice(4, 6), 10) - 1, parseInt(d.slice(6, 8), 10), parseInt(d.slice(8, 10), 10), parseInt(d.slice(10, 12), 10))
					p.year = true
					p.month = true
					p.day = true
					p.hour = true
					p.minute = true
					p.second = true    if date.getSeconds() >= 1
					p.millisecond = true    if date.getMilliseconds() >= 1
			if precision? and precision isnt ""
				date: date
				precision: p
			else
				date

		prettyDate: (d, is_abbr, p, d2) ->
			_date = undefined
			_date2 = undefined
			format = undefined
			bc_check = undefined
			is_pair = false
			bc_original = undefined
			bc_number = undefined
			bc_string = undefined
			if d2? and d2 isnt "" and typeof d2 isnt "undefined"
				is_pair = true
				trace "D2 " + d2
			if type.of(d) is "date"
				if type.of(p) is "object"
					if p.millisecond or p.second and d.getSeconds() >= 1
						if is_abbr
							format = vDate.dateformats.time_short
						else
							format = vDate.dateformats.time_short
					else if p.minute
						if is_abbr
							format = vDate.dateformats.time_no_seconds_short
						else
							format = vDate.dateformats.time_no_seconds_small_date
					else if p.hour
						if is_abbr
							format = vDate.dateformats.time_no_seconds_short
						else
							format = vDate.dateformats.time_no_seconds_small_date
					else if p.day
						if is_abbr
							format = vDate.dateformats.full_short
						else
							format = vDate.dateformats.full
					else if p.month
						if is_abbr
							format = vDate.dateformats.month_short
						else
							format = vDate.dateformats.month
					else if p.year
						format = vDate.dateformats.year
					else
						format = vDate.dateformats.year
				else
					if d.getMonth() is 0 and d.getDate() is 1 and d.getHours() is 0 and d.getMinutes() is 0
						format = vDate.dateformats.year
					else if d.getDate() <= 1 and d.getHours() is 0 and d.getMinutes() is 0
						if is_abbr
							format = vDate.dateformats.month_short
						else
							format = vDate.dateformats.month
					else if d.getHours() is 0 and d.getMinutes() is 0
						if is_abbr
							format = vDate.dateformats.full_short
						else
							format = vDate.dateformats.full
					else if d.getMinutes() is 0
						if is_abbr
							format = vDate.dateformats.time_no_seconds_short
						else
							format = vDate.dateformats.time_no_seconds_small_date
					else
						if is_abbr
							format = vDate.dateformats.time_no_seconds_short
						else
							format = vDate.dateformats.full_long
				_date = dateFormat(d, format, false)
				bc_check = _date.split(" ")
				i = 0

				while i < bc_check.length
					if parseInt(bc_check[i], 10) < 0
						trace "YEAR IS BC"
						bc_original = bc_check[i]
						bc_number = Math.abs(parseInt(bc_check[i], 10))
						bc_string = bc_number.toString() + " B.C."
						_date = _date.replace(bc_original, bc_string)
					i++
				if is_pair
					_date2 = dateFormat(d2, format, false)
					bc_check = _date2.split(" ")
					j = 0

					while j < bc_check.length
						if parseInt(bc_check[j], 10) < 0
							trace "YEAR IS BC"
							bc_original = bc_check[j]
							bc_number = Math.abs(parseInt(bc_check[j], 10))
							bc_string = bc_number.toString() + " B.C."
							_date2 = _date2.replace(bc_original, bc_string)
						j++
			else
				trace "NOT A VALID DATE?"
				trace d
			if is_pair
				_date + " &mdash; " + _date2
			else
				_date
	).init()
	
