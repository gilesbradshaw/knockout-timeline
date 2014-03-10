#	* LIBRARY ABSTRACTION
#================================================== 
define [
	"jquery"
	"trace"
	"VMM.Browser"
	"jQueryExtender"
] , (jQuery,trace, browser)->
	
	


	

	library =
		init: ->
			this

		hide: (element, duration) ->
			if duration? and duration isnt ""
				jQuery(element).hide duration    unless typeof (jQuery) is "undefined"
			else
				jQuery(element).hide()    unless typeof (jQuery) is "undefined"

		remove: (element) ->
			jQuery(element).remove()    unless typeof (jQuery) is "undefined"

		detach: (element) ->
			jQuery(element).detach()    unless typeof (jQuery) is "undefined"

		append: (element, value) ->
			jQuery(element).append value    unless typeof (jQuery) is "undefined"

		prepend: (element, value) ->
			jQuery(element).prepend value    unless typeof (jQuery) is "undefined"

		show: (element, duration) ->
			if duration? and duration isnt ""
				jQuery(element).show duration    unless typeof (jQuery) is "undefined"
			else
				jQuery(element).show()    unless typeof (jQuery) is "undefined"

		load: (element, callback_function, event_data) ->
			_event_data = elem: element # return element by default
			_event_data = event_data    if _event_data? and _event_data isnt ""
			jQuery(element).load _event_data, callback_function    unless typeof (jQuery) is "undefined"

		addClass: (element, cName) ->
			jQuery(element).addClass cName    unless typeof (jQuery) is "undefined"

		removeClass: (element, cName) ->
			jQuery(element).removeClass cName    unless typeof (jQuery) is "undefined"

		attr: (element, aName, value) ->
			if value? and value isnt ""
				jQuery(element).attr aName, value    unless typeof (jQuery) is "undefined"
			else
				jQuery(element).attr aName    unless typeof (jQuery) is "undefined"

		prop: (element, aName, value) ->
			if typeof jQuery is "undefined" or not /[1-9]\.[3-9].[1-9]/.test(jQuery.fn.jquery)
				library.attribute element, aName, value
			else
				jQuery(element).prop aName, value

		attribute: (element, aName, value) ->
			if value? and value isnt ""
				jQuery(element).attr aName, value    unless typeof (jQuery) is "undefined"
			else
				jQuery(element).attr aName    unless typeof (jQuery) is "undefined"
	
		visible: (element, show) ->
			if show?
				unless typeof (jQuery) is "undefined"
					if show
						jQuery(element).show 0
					else
						jQuery(element).hide 0
			else
				unless typeof (jQuery) is "undefined"
					if jQuery(element).is(":visible")
						true
					else
						false
	
		css: (element, prop, value) ->
			if value
				jQuery(element).css prop, value    unless typeof (jQuery) is "undefined"
			else
				jQuery(element).css prop    unless typeof (jQuery) is "undefined"
			

		cssmultiple: (element, propval) ->
			jQuery(element).css propval    unless typeof (jQuery) is "undefined"

		offset: (element) ->
			p = undefined
			p = jQuery(element).offset()    unless typeof (jQuery) is "undefined"
			p

		position: (element) ->
			p = undefined
			p = jQuery(element).position()    unless typeof (jQuery) is "undefined"
			p

		width: (element, s) ->
			if s? and s isnt ""
				jQuery(element).width s    unless typeof (jQuery) is "undefined"
			else
				jQuery(element).width()    unless typeof (jQuery) is "undefined"

		height: (element, s) ->
			if s? and s isnt ""
				jQuery(element).height s    unless typeof (jQuery) is "undefined"
			else
				jQuery(element).height()    unless typeof (jQuery) is "undefined"

		toggleClass: (element, cName) ->
			jQuery(element).toggleClass cName    unless typeof (jQuery) is "undefined"

		each: (element, return_function) ->
			jQuery(element).each return_function    unless typeof (jQuery) is "undefined"

		html: (element, str) ->
			e = undefined
			unless typeof (jQuery) is "undefined"
				e = jQuery(element).html()
				return e
			if str? and str isnt ""
				jQuery(element).html str    unless typeof (jQuery) is "undefined"
			else
				e = undefined
				unless typeof (jQuery) is "undefined"
					e = jQuery(element).html()
					e

		find: (element, selec) ->
			jQuery(element).find selec    unless typeof (jQuery) is "undefined"

		stop: (element) ->
			jQuery(element).stop()    unless typeof (jQuery) is "undefined"

		delay_animate: (delay, element, duration, ease, att, callback_function) ->
			if browser.device is "mobile" or browser.device is "tablet"
				_tdd = Math.round((duration / 1500) * 10) / 10
				__duration = _tdd + "s"
				library.css element, "-webkit-transition", "all " + __duration + " ease"
				library.css element, "-moz-transition", "all " + __duration + " ease"
				library.css element, "-o-transition", "all " + __duration + " ease"
				library.css element, "-ms-transition", "all " + __duration + " ease"
				library.css element, "transition", "all " + __duration + " ease"
				library.cssmultiple element, _att
			else
				unless typeof (jQuery) is "undefined"
					jQuery(element).delay(delay).animate att,
						duration: duration
						easing: ease

		animate: (element, duration, ease, att, queue, callback_function) ->
			_ease = "easein"
			_queue = false
			_duration = 1000
			_att = {}
			if duration?
				if duration < 1
					_duration = 1
				else
					_duration = Math.round(duration)
			_ease = ease    if ease? and ease isnt ""
			_queue = queue    if queue? and queue isnt ""
			if att?
				_att = att
			else
				_att = opacity: 0
			if browser.device is "mobile" or browser.device is "tablet"
				_tdd = Math.round((_duration / 1500) * 10) / 10
				__duration = _tdd + "s"
				_ease = " cubic-bezier(0.33, 0.66, 0.66, 1)"
				
				#_ease = " ease-in-out";
				for x of _att
					if Object::hasOwnProperty.call(_att, x)
						trace x + " to " + _att[x]
						library.css element, "-webkit-transition", x + " " + __duration + _ease
						library.css element, "-moz-transition", x + " " + __duration + _ease
						library.css element, "-o-transition", x + " " + __duration + _ease
						library.css element, "-ms-transition", x + " " + __duration + _ease
						library.css element, "transition", x + " " + __duration + _ease
				library.cssmultiple element, _att
			else
				unless typeof (jQuery) is "undefined"
					if callback_function? and callback_function isnt ""
						jQuery(element).animate _att,
							queue: _queue
							duration: _duration
							easing: _ease
							complete: callback_function

					else
						jQuery(element).animate _att,
							queue: _queue
							duration: _duration
							easing: _ease
		smoothScrollTo: (elem, duration, ease) ->
			unless typeof (jQuery) is "undefined"
				_ease = "easein"
				_duration = 1000
				if duration?
					if duration < 1
						_duration = 1
					else
						_duration = Math.round(duration)
				_ease = ease    if ease? and ease isnt ""
				unless jQuery(window).scrollTop() is library.offset(elem).top
					library.animate "html,body", _duration, _ease,
						scrollTop: library.offset(elem).top
		attachElement: (element, content) ->
			jQuery(element).html content    unless typeof (jQuery) is "undefined"
		appendElement: (element, content) ->
			jQuery(element).append content    unless typeof (jQuery) is "undefined"
		getHTML: (element) ->
			e = undefined
			unless typeof (jQuery) is "undefined"
				e = jQuery(element).html()
				e


		getElement: (element, p) ->
			e = undefined
			unless typeof (jQuery) is "undefined"
				if p
					e = jQuery(element).parent().get(0)
				else
					e = jQuery(element).get(0)
				e

		bindEvent: (element, the_handler, the_event_type, event_data) ->
			e = undefined
			_event_type = "click"
			_event_data = {}
			_event_type = the_event_type    if the_event_type? and the_event_type isnt ""
			_event_data = event_data    if _event_data? and _event_data isnt ""
			jQuery(element).bind _event_type, _event_data, the_handler    unless typeof (jQuery) is "undefined"

	
		#return e;
		unbindEvent: (element, the_handler, the_event_type) ->
			e = undefined
			_event_type = "click"
			_event_data = {}
			_event_type = the_event_type    if the_event_type? and the_event_type isnt ""
			jQuery(element).unbind _event_type, the_handler    unless typeof (jQuery) is "undefined"

	
		#return e;
		fireEvent: (element, the_event_type, the_data) ->
			e = undefined
			_event_type = "click"
			_data = []
			_event_type = the_event_type    if the_event_type? and the_event_type isnt ""
			_data = the_data    if the_data? and the_data isnt ""
			jQuery(element).trigger _event_type, _data    unless typeof (jQuery) is "undefined"

	
		#return e;
		getJSON: (url, data, callback) ->
			unless typeof (jQuery) is "undefined"
				jQuery.ajaxSetup timeout: 3000
			
				# CHECK FOR IE
				#			================================================== 
				if browser.browser is "Explorer" and parseInt(browser.version, 10) >= 7 and window.XDomainRequest
					trace "IE JSON"
					ie_url = url
					if ie_url.match("^http://")
						jQuery.getJSON ie_url, data, callback
					else if ie_url.match("^https://")
						ie_url = ie_url.replace("https://", "http://")
						jQuery.getJSON ie_url, data, callback
					else
						jQuery.getJSON url, data, callback
				else
					jQuery.getJSON url, data, callback

		parseJSON: (the_json) ->
			jQuery.parseJSON the_json    unless typeof (jQuery) is "undefined"

	
		# ADD ELEMENT AND RETURN IT
		appendAndGetElement: (append_to_element, tag, cName, content) ->
			e = undefined
			_tag = "<div>"
			_class = ""
			_content = ""
			_id = ""
			_tag = tag    if tag? and tag isnt ""
			_class = cName    if cName? and cName isnt ""
			_content = content    if content
			unless typeof (jQuery) is "undefined"
				e = jQuery(tag)
				e.addClass _class
				e.html _content
				jQuery(append_to_element).append e
			e
		createElement: (tag, value, cName, attrs, styles) ->
			ce = ""
			if tag? and tag isnt ""
				ce += "<" + tag
				ce += " class='" + cName + "'"    if cName? and cName isnt ""
				ce += " " + attrs    if attrs? and attrs isnt ""
				ce += " style='" + styles + "'"    if styles? and styles isnt ""
				ce += ">"
				ce += value    if value? and value isnt ""
				ce = ce + "</" + tag + ">"
			ce

		createMediaElement: (media, caption, credit) ->
			ce = ""
			_valid = false
			ce += "<div class='media'>"
			if media? and media isnt ""
				valid = true
				ce += "<img src='" + media + "'>"
				ce += library.createElement("div", credit, "credit")    if credit? and credit isnt ""
				ce += library.createElement("div", caption, "caption")    if caption? and caption isnt ""
			ce += "</div>"
			ce

		hideUrlBar: ->
			win = window
			doc = win.document
			if not location.hash or not win.addEventListener
				window.scrollTo 0, 1
				scrollTop = 1
				bodycheck = setInterval(->
					if doc.body
						clearInterval bodycheck
						scrollTop = (if "scrollTop" of doc.body then doc.body.scrollTop else 1)
						win.scrollTo 0, (if scrollTop is 1 then 0 else 1)
					return
				, 15)
				win.addEventListener "load", (->
					setTimeout (->
						win.scrollTo 0, (if scrollTop is 1 then 0 else 1)
						return
					), 0
					return
				), false
			return
		loadingmessage: (m) ->
			"<div class='vco-loading'><div class='vco-loading-container'><div class='vco-loading-icon'></div>" + "<div class='vco-message'><p>" + m + "</p></div></div></div>"
