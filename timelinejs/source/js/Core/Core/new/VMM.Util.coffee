#	* Utilities and Useful Functions
#================================================== 
define ["VMM", "trace"], (VMM, trace)->
	# rather than change Array.prototype; Thanks Jeff McWhirter for nudge
	
	#	* CORRECT PROTOCOL (DOES NOT WORK)
	#		================================================== 
	
	#	* MERGE CONFIG
	#		================================================== 
	
	#	* GET OBJECT ATTRIBUTE BY INDEX
	#		================================================== 
	
	#	* ORDINAL
	#		================================================== 
	
	#	* RANDOM BETWEEN
	#		================================================== 
	
	#VMM.Util.randomBetween(1, 3)
	
	#	* AVERAGE
	#			* http://jsfromhell.com/array/average
	#			* var x = VMM.Util.average([2, 3, 4]);
	#			* VMM.Util.average([2, 3, 4]).mean
	#		================================================== 
	
	#	* CUSTOM SORT
	#		================================================== 
	
	#	* Remove Duplicates from Array
	#		================================================== 
	
	#	* Given an int or decimal, turn that into string in $xxx,xxx.xx format.
	#		================================================== 
	# add $
	#pad with .00
	# rounded correctly to two digits, if decimals passed
	
	# no decimal and padding is enabled
	
	# add money sign
	
	#	* Returns a word count number
	#		================================================== 
	
	#VMM.Util.ratio.fit(w, h, ratio_w, ratio_h).width;
	
	# TRY WIDTH FIRST
	
	#_fit.height = Math.round((h / ratio_h) * ratio_w);
	
	#_fit.width = Math.round((w / ratio_w) * ratio_h);
	
	#VMM.Util.ratio.r16_9(w, h) // Returns corresponding number
	
	#	* Returns a truncated segement of a long string of between min and max words. If possible, ends on a period (otherwise goes to max).
	#		================================================== 
	
	#	* Turns plain text links into real links
	#		================================================== 
	
	# http://, https://, ftp://
	
	# www. sans http:// or https://
	
	# Email addresses
	
	# http://, https://, ftp://
	
	# www. sans http:// or https://
	
	# Email addresses
	
	#var twitterHandlePattern = /(@([\w]+))/g;
	
	#.replace(urlPattern, "<a target='_blank' href='$&' onclick='void(0)'>$&</a>")
	
	# TURN THIS BACK ON TO AUTOMAGICALLY LINK HASHTAGS TO TWITTER SEARCH
	#.replace(twitterSearchPattern, "<a href='http://twitter.com/search?q=%23$2' target='_blank' 'void(0)'>$1</a>");
	
	#	* Turns plain text links into real links
	#		================================================== 
	
	# VMM.Util.unlinkify();
	
	#	* TK
	#		================================================== 
	
	#	* Generate a Unique ID
	#		================================================== 
	
	# VMM.Util.unique_ID(size);
	
	#	* Tells you if a number is even or not
	#		================================================== 
	
	# VMM.Util.isEven(n)
	
	#	* Get URL Variables
	#		================================================== 
	
	#	var somestring = VMM.Util.getUrlVars(str_url)["varname"];
	
	#	* Cleans up strings to become real HTML
	#		================================================== 
	
	#	* Returns text strings as CamelCase
	#		================================================== 
	
	#	* Replaces dumb quote marks with smart ones
	#		================================================== 
	
	#	* Add Commas to numbers
	#		================================================== 
	
	#	* Transform text to Title Case
	#		================================================== 
	
	# lowercase the list of small words
	
	# if the first word in the title is a small word then capitalize it
	
	# if the last word in the title is a small word, then capitalize it
	
	# special cases
	VMM.Util = (
		init: ->
			this

		removeRange: (array, from, to) ->
			rest = array.slice((to or from) + 1 or array.length)
			array.length = (if from < 0 then array.length + from else from)
			array.push.apply array, rest

		correctProtocol: (url) ->
			loc = (window.parent.location.protocol).toString()
			prefix = ""
			the_url = url.split("://", 2)
			if loc.match("http")
				prefix = loc
			else
				prefix = "https"
			prefix + "://" + the_url[1]

		mergeConfig: (config_main, config_to_merge) ->
			x = undefined
			for x of config_to_merge
				config_main[x] = config_to_merge[x]    if Object::hasOwnProperty.call(config_to_merge, x)
			config_main

		getObjectAttributeByIndex: (obj, index) ->
			unless typeof obj is "undefined"
				i = 0
				for attr of obj
					return obj[attr]    if index is i
					i++
				""
			else
				""

		ordinal: (n) ->
			[
				"th"
				"st"
				"nd"
				"rd"
			][(not (((n % 10) > 3) or (Math.floor(n % 100 / 10) is 1))) * (n % 10)]

		randomBetween: (min, max) ->
			Math.floor Math.random() * (max - min + 1) + min

		average: (a) ->
			r =
				mean: 0
				variance: 0
				deviation: 0

			t = a.length
			m = undefined
			s = 0
			l = t

			while l--
				s += a[l]
			m = r.mean = s / t
			l = t
			s = 0

			while l--
				s += Math.pow(a[l] - m, 2)
			r.deviation = Math.sqrt(r.variance = s / t)
			r

		customSort: (a, b) ->
			a1 = a
			b1 = b
			return 0    if a1 is b1
			(if a1 > b1 then 1 else -1)

		deDupeArray: (arr) ->
			i = undefined
			len = arr.length
			out = []
			obj = {}
			i = 0
			while i < len
				obj[arr[i]] = 0
				i++
			for i of obj
				out.push i
			out

		number2money: (n, symbol, padding) ->
			symbol = (if (symbol isnt null) then symbol else true)
			padding = (if (padding isnt null) then padding else false)
			number = VMM.Math2.floatPrecision(n, 2)
			formatted = @niceNumber(number)
			formatted = formatted + ".00"    if not formatted.split(/\./g)[1] and padding
			formatted = "$" + formatted    if symbol
			formatted

		wordCount: (s) ->
			fullStr = s + " "
			initial_whitespace_rExp = /^[^A-Za-z0-9\'\-]+/g
			left_trimmedStr = fullStr.replace(initial_whitespace_rExp, "")
			non_alphanumerics_rExp = /[^A-Za-z0-9\'\-]+/g
			cleanedStr = left_trimmedStr.replace(non_alphanumerics_rExp, " ")
			splitString = cleanedStr.split(" ")
			word_count = splitString.length - 1
			word_count = 0    if fullStr.length < 2
			word_count

		ratio:
			fit: (w, h, ratio_w, ratio_h) ->
				_fit =
					width: 0
					height: 0

				_fit.width = w
				_fit.height = Math.round((w / ratio_w) * ratio_h)
				if _fit.height > h
					_fit.height = h
					_fit.width = Math.round((h / ratio_h) * ratio_w)
					trace "FIT: DIDN'T FIT!!! "    if _fit.width > w
				_fit

			r16_9: (w, h) ->
				if w isnt null and w isnt ""
					Math.round (h / 16) * 9
				else Math.round (w / 9) * 16    if h isnt null and h isnt ""

			r4_3: (w, h) ->
				if w isnt null and w isnt ""
					Math.round (h / 4) * 3
				else Math.round (w / 3) * 4    if h isnt null and h isnt ""

		doubledigit: (n) ->
			((if n < 10 then "0" else "")) + n

		truncateWords: (s, min, max) ->
			min = 30    unless min
			max = min    unless max
			initial_whitespace_rExp = /^[^A-Za-z0-9\'\-]+/g
			left_trimmedStr = s.replace(initial_whitespace_rExp, "")
			words = left_trimmedStr.split(" ")
			result = []
			min = Math.min(words.length, min)
			max = Math.min(words.length, max)
			i = 0

			while i < min
				result.push words[i]
				i++
			j = min

			while i < max
				word = words[i]
				result.push word
				break    if word.charAt(word.length - 1) is "."
				i++
			result.join " "

		linkify: (text, targets, is_touch) ->
			urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/g
			pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/g
			emailAddressPattern = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/g
			text.replace(urlPattern, "<a target='_blank' href='$&' onclick='void(0)'>$&</a>").replace(pseudoUrlPattern, "$1<a target='_blank' onclick='void(0)' href='http://$2'>$2</a>").replace emailAddressPattern, "<a target='_blank' onclick='void(0)' href='mailto:$1'>$1</a>"

		linkify_with_twitter: (text, targets, is_touch) ->
			replaceURLWithHTMLLinks = (text) ->
				exp = /(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/g
				text.replace exp, "<a href='$1' target='_blank'>$3</a>"
			urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/g
			url_pattern = /(\()((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\))|(\[)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\])|(\{)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\})|(<|&(?:lt|#60|#x3c);)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(>|&(?:gt|#62|#x3e);)|((?:^|[^=\s'"\]])\s*['"]?|[^=\s]\s+)(\b(?:ht|f)tps?:\/\/[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]+(?:(?!&(?:gt|#0*62|#x0*3e);|&(?:amp|apos|quot|#0*3[49]|#x0*2[27]);[.!&',:?;]?(?:[^a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]|$))&[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]*)*[a-z0-9\-_~$()*+=\/#[\]@%])/g
			url_replace = "$1$4$7$10$13<a href=\"$2$5$8$11$14\" target=\"_blank\" class=\"hyphenate\">$2$5$8$11$14</a>$3$6$9$12"
			pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/g
			emailAddressPattern = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/g
			twitterHandlePattern = /\B@([\w-]+)/g
			twitterSearchPattern = /(#([\w]+))/g
			text.replace(url_pattern, url_replace).replace(pseudoUrlPattern, "$1<a target='_blank' class='hyphenate' onclick='void(0)' href='http://$2'>$2</a>").replace(emailAddressPattern, "<a target='_blank' onclick='void(0)' href='mailto:$1'>$1</a>").replace twitterHandlePattern, "<a href='http://twitter.com/$1' target='_blank' onclick='void(0)'>@$1</a>"

		linkify_wikipedia: (text) ->
			urlPattern = /<i[^>]*>(.*?)<\/i>/g
			text.replace(urlPattern, "<a target='_blank' href='http://en.wikipedia.org/wiki/$&' onclick='void(0)'>$&</a>").replace(/<i\b[^>]*>/g, "").replace(/<\/i>/g, "").replace(/<b\b[^>]*>/g, "").replace /<\/b>/g, ""

		unlinkify: (text) ->
			return text    unless text
			text = text.replace(/<a\b[^>]*>/i, "")
			text = text.replace(/<\/a>/i, "")
			text

		untagify: (text) ->
			return text    unless text
			text = text.replace(/<\s*\w.*?>/g, "")
			text

		nl2br: (text) ->
			text.replace /(\r\n|[\r\n]|\\n|\\r)/g, "<br/>"

		unique_ID: (size) ->
			getRandomNumber = (range) ->
				Math.floor Math.random() * range

			getRandomChar = ->
				chars = "abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ"
				chars.substr getRandomNumber(62), 1

			randomID = (size) ->
				str = ""
				i = 0

				while i < size
					str += getRandomChar()
					i++
				str

			randomID size

		isEven: (n) ->
			(if (n % 2 is 0) then true else false)

		getUrlVars: (string) ->
			str = string.toString()
			if str.match("&#038;")
				str = str.replace("&#038;", "&")
			else if str.match("&#38;")
				str = str.replace("&#38;", "&")
			else str = str.replace("&amp;", "&")    if str.match("&amp;")
			vars = []
			hash = undefined
			hashes = str.slice(str.indexOf("?") + 1).split("&")
			i = 0

			while i < hashes.length
				hash = hashes[i].split("=")
				vars.push hash[0]
				vars[hash[0]] = hash[1]
				i++
			vars

		toHTML: (text) ->
			text = @nl2br(text)
			text = @linkify(text)
			text.replace /\s\s/g, "&nbsp;&nbsp;"

		toCamelCase: (s, forceLowerCase) ->
			forceLowerCase = true    if forceLowerCase isnt false
			sps = ((if (forceLowerCase) then s.toLowerCase() else s)).split(" ")
			i = 0

			while i < sps.length
				sps[i] = sps[i].substr(0, 1).toUpperCase() + sps[i].substr(1)
				i++
			sps.join " "

		properQuotes: (str) ->
			str.replace /\"([^\"]*)\"/g, "&#8220;$1&#8221;"

		niceNumber: (nStr) ->
			nStr += ""
			x = nStr.split(".")
			x1 = x[0]
			x2 = (if x.length > 1 then "." + x[1] else "")
			rgx = /(\d+)(\d{3})/
			x1 = x1.replace(rgx, "$1" + "," + "$2")    while rgx.test(x1)
			x1 + x2

		toTitleCase: (t) ->
			if browser.browser is "Explorer" and parseInt(browser.version, 10) >= 7
				t.replace "_", "%20"
			else
				__TitleCase =
					__smallWords: [
						"a"
						"an"
						"and"
						"as"
						"at"
						"but"
						"by"
						"en"
						"for"
						"if"
						"in"
						"of"
						"on"
						"or"
						"the"
						"to"
						"v[.]?"
						"via"
						"vs[.]?"
					]
					init: ->
						@__smallRE = @__smallWords.join("|")
						@__lowerCaseWordsRE = new RegExp("\\b(" + @__smallRE + ")\\b", "gi")
						@__firstWordRE = new RegExp("^([^a-zA-Z0-9 \\r\\n\\t]*)(" + @__smallRE + ")\\b", "gi")
						@__lastWordRE = new RegExp("\\b(" + @__smallRE + ")([^a-zA-Z0-9 \\r\\n\\t]*)$", "gi")
						return

					toTitleCase: (string) ->
						line = ""
						split = string.split(/([:.;?!][ ]|(?:[ ]|^)["“])/)
						i = 0

						while i < split.length
							s = split[i]
							s = s.replace(/\b([a-zA-Z][a-z.'’]*)\b/g, @__titleCaseDottedWordReplacer)
							s = s.replace(@__lowerCaseWordsRE, @__lowerReplacer)
							s = s.replace(@__firstWordRE, @__firstToUpperCase)
							s = s.replace(@__lastWordRE, @__firstToUpperCase)
							line += s
							++i
						line = line.replace(RegExp(" V(s?)\\. ", "g"), " v$1. ")
						line = line.replace(/(['’])S\b/g, "$1s")
						line = line.replace(/\b(AT&T|Q&A)\b/g, @__upperReplacer)
						line

					__titleCaseDottedWordReplacer: (w) ->
						(if (w.match(/[a-zA-Z][.][a-zA-Z]/)) then w else __TitleCase.__firstToUpperCase(w))

					__lowerReplacer: (w) ->
						w.toLowerCase()

					__upperReplacer: (w) ->
						w.toUpperCase()

					__firstToUpperCase: (w) ->
						split = w.split(/(^[^a-zA-Z0-9]*[a-zA-Z0-9])(.*)$/)
						split[1] = split[1].toUpperCase()    if split[1]
						split.join ""

				__TitleCase.init()
				t = t.replace(/_/g, " ")
				t = __TitleCase.toTitleCase(t)
				t
	).init()