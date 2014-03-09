# CoffeeScript
define [], () ->
	trace = (msg) ->
		debug=true
		if debug
			if window.console
				console.log msg
			else unless typeof (jsTrace) is "undefined"
				jsTrace.send msg
			else
		return