define [
	"jquery"
	"easing"
] , (jQuery)->

	#	XDR AJAX Extension FOR jQuery
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
