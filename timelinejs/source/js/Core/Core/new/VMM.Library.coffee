#	* LIBRARY ABSTRACTION
#================================================== 
define [
	"jquery"
	"VMM"
	"trace"
	"easing"
] , (jQuery,VMM, trace)->
	VMM.smoothScrollTo = (elem, duration, ease) ->
		unless typeof (jQuery) is "undefined"
			_ease = "easein"
			_duration = 1000
			if duration?
				if duration < 1
					_duration = 1
				else
					_duration = Math.round(duration)
			_ease = ease    if ease? and ease isnt ""
			unless jQuery(window).scrollTop() is VMM.Lib.offset(elem).top
				VMM.Lib.animate "html,body", _duration, _ease,
					scrollTop: VMM.Lib.offset(elem).top

	VMM.attachElement = (element, content) ->
		jQuery(element).html content    unless typeof (jQuery) is "undefined"

	VMM.appendElement = (element, content) ->
		jQuery(element).append content    unless typeof (jQuery) is "undefined"

	VMM.getHTML = (element) ->
		e = undefined
		unless typeof (jQuery) is "undefined"
			e = jQuery(element).html()
			e

	VMM.getElement = (element, p) ->
		e = undefined
		unless typeof (jQuery) is "undefined"
			if p
				e = jQuery(element).parent().get(0)
			else
				e = jQuery(element).get(0)
			e

	VMM.bindEvent = (element, the_handler, the_event_type, event_data) ->
		e = undefined
		_event_type = "click"
		_event_data = {}
		_event_type = the_event_type    if the_event_type? and the_event_type isnt ""
		_event_data = event_data    if _event_data? and _event_data isnt ""
		jQuery(element).bind _event_type, _event_data, the_handler    unless typeof (jQuery) is "undefined"

	
	#return e;
	VMM.unbindEvent = (element, the_handler, the_event_type) ->
		e = undefined
		_event_type = "click"
		_event_data = {}
		_event_type = the_event_type    if the_event_type? and the_event_type isnt ""
		jQuery(element).unbind _event_type, the_handler    unless typeof (jQuery) is "undefined"

	
	#return e;
	VMM.fireEvent = (element, the_event_type, the_data) ->
		e = undefined
		_event_type = "click"
		_data = []
		_event_type = the_event_type    if the_event_type? and the_event_type isnt ""
		_data = the_data    if the_data? and the_data isnt ""
		jQuery(element).trigger _event_type, _data    unless typeof (jQuery) is "undefined"

	
	#return e;
	VMM.getJSON = (url, data, callback) ->
		unless typeof (jQuery) is "undefined"
			jQuery.ajaxSetup timeout: 3000
			
			# CHECK FOR IE
			#			================================================== 
			if VMM.Browser.browser is "Explorer" and parseInt(VMM.Browser.version, 10) >= 7 and window.XDomainRequest
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

	VMM.parseJSON = (the_json) ->
		jQuery.parseJSON the_json    unless typeof (jQuery) is "undefined"

	
	# ADD ELEMENT AND RETURN IT
	VMM.appendAndGetElement = (append_to_element, tag, cName, content) ->
		e = undefined
		_tag = "<div>"
		_class = ""
		_content = ""
		_id = ""
		_tag = tag    if tag? and tag isnt ""
		_class = cName    if cName? and cName isnt ""
		_content = content    if content? and content isnt ""
		unless typeof (jQuery) is "undefined"
			e = jQuery(tag)
			e.addClass _class
			e.html _content
			jQuery(append_to_element).append e
		e

	VMM.Lib =
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
				VMM.Lib.attribute element, aName, value
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
			if VMM.Browser.device is "mobile" or VMM.Browser.device is "tablet"
				_tdd = Math.round((duration / 1500) * 10) / 10
				__duration = _tdd + "s"
				VMM.Lib.css element, "-webkit-transition", "all " + __duration + " ease"
				VMM.Lib.css element, "-moz-transition", "all " + __duration + " ease"
				VMM.Lib.css element, "-o-transition", "all " + __duration + " ease"
				VMM.Lib.css element, "-ms-transition", "all " + __duration + " ease"
				VMM.Lib.css element, "transition", "all " + __duration + " ease"
				VMM.Lib.cssmultiple element, _att
			else
				unless typeof (jQuery) is "undefined"
					jQuery(element).delay(delay).animate att,
						duration: duration
						easing: ease

		animate: (element, duration, ease, att, que, callback_function) ->
			_ease = "easein"
			_que = false
			_duration = 1000
			_att = {}
			if duration?
				if duration < 1
					_duration = 1
				else
					_duration = Math.round(duration)
			_ease = ease    if ease? and ease isnt ""
			_que = que    if que? and que isnt ""
			if att?
				_att = att
			else
				_att = opacity: 0
			if VMM.Browser.device is "mobile" or VMM.Browser.device is "tablet"
				_tdd = Math.round((_duration / 1500) * 10) / 10
				__duration = _tdd + "s"
				_ease = " cubic-bezier(0.33, 0.66, 0.66, 1)"
				
				#_ease = " ease-in-out";
				for x of _att
					if Object::hasOwnProperty.call(_att, x)
						trace x + " to " + _att[x]
						VMM.Lib.css element, "-webkit-transition", x + " " + __duration + _ease
						VMM.Lib.css element, "-moz-transition", x + " " + __duration + _ease
						VMM.Lib.css element, "-o-transition", x + " " + __duration + _ease
						VMM.Lib.css element, "-ms-transition", x + " " + __duration + _ease
						VMM.Lib.css element, "transition", x + " " + __duration + _ease
				VMM.Lib.cssmultiple element, _att
			else
				unless typeof (jQuery) is "undefined"
					if callback_function? and callback_function isnt ""
						jQuery(element).animate _att,
							queue: _que
							duration: _duration
							easing: _ease
							complete: callback_function

					else
						jQuery(element).animate _att,
							queue: _que
							duration: _duration
							easing: _ease

	
	#	XDR AJAX EXTENTION FOR jQuery
	#		https://github.com/jaubourg/ajaxHooks/blob/master/src/ajax/xdr.js
	#	================================================== 
	((jQuery) ->
		if window.XDomainRequest
			jQuery.ajaxTransport (s) ->
				if s.crossDomain and s.async
					if s.timeout
						s.xdrTimeout = s.timeout
						delete s.timeout
					xdr = undefined
					send: (_, complete) ->
						callback = (status, statusText, responses, responseHeaders) ->
							xdr.onload = xdr.onerror = xdr.ontimeout = jQuery.noop
							xdr = `undefined`
							complete status, statusText, responses, responseHeaders
							return
						xdr = new XDomainRequest()
						xdr.open s.type, s.url
						xdr.onload = ->
							callback 200, "OK",
								text: xdr.responseText
							, "Content-Type: " + xdr.contentType
							return

						xdr.onerror = ->
							callback 404, "Not Found"
							return

						if s.xdrTimeout
							xdr.ontimeout = ->
								callback 0, "timeout"
								return

							xdr.timeout = s.xdrTimeout
						xdr.send (s.hasContent and s.data) or null
						return

					abort: ->
						if xdr
							xdr.onerror = jQuery.noop()
							xdr.abort()
						return

		return
	) jQuery
	
	#	jQuery Easing v1.3
	#		http://gsgd.co.uk/sandbox/jquery/easing/
	#	================================================== 
	jQuery.easing["jswing"] = jQuery.easing["swing"]
	jQuery.extend jQuery.easing,
		def: "easeOutQuad"
		swing: (x, t, b, c, d) ->
			
			#alert(jQuery.easing.default);
			jQuery.easing[jQuery.easing.def] x, t, b, c, d

		easeInExpo: (x, t, b, c, d) ->
			(if (t is 0) then b else c * Math.pow(2, 10 * (t / d - 1)) + b)

		easeOutExpo: (x, t, b, c, d) ->
			(if (t is d) then b + c else c * (-Math.pow(2, -10 * t / d) + 1) + b)

		easeInOutExpo: (x, t, b, c, d) ->
			return b    if t is 0
			return b + c    if t is d
			return c / 2 * Math.pow(2, 10 * (t - 1)) + b    if (t /= d / 2) < 1
			c / 2 * (-Math.pow(2, -10 * --t) + 2) + b

		easeInQuad: (x, t, b, c, d) ->
			c * (t /= d) * t + b

		easeOutQuad: (x, t, b, c, d) ->
			-c * (t /= d) * (t - 2) + b

		easeInOutQuad: (x, t, b, c, d) ->
			return c / 2 * t * t + b    if (t /= d / 2) < 1
			-c / 2 * ((--t) * (t - 2) - 1) + b
