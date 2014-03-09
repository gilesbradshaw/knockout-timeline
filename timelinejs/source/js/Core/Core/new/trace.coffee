# CoffeeScript
define ["VMM"], (VMM) ->
	trace = (msg) ->
		if VMM.debug
			if window.console
				console.log msg
			else unless typeof (jsTrace) is "undefined"
				jsTrace.send msg
			else
		return