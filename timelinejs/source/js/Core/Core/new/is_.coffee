# CoffeeScript
define [], () ->
	# A MORE SPECIFIC TYPEOF();
#//	http://rolandog.com/archives/2007/01/18/typeof-a-more-specific-typeof/
#================================================== 

# type.of()
	is_ =
		Null: (a) ->
			a is null

		Undefined: (a) ->
			a is `undefined`

		nt: (a) ->
			a is null or a is `undefined`

		Function: (a) ->
			(if (typeof (a) is "function") then a.constructor.toString().match(/Function/) isnt null else false)

		String: (a) ->
			(if (typeof (a) is "string") then true else (if (typeof (a) is "object") then a.constructor.toString().match(/string/i) isnt null else false))

		Array: (a) ->
			(if (typeof (a) is "object") then a.constructor.toString().match(/array/i) isnt null or a.length isnt `undefined` else false)

		Boolean: (a) ->
			(if (typeof (a) is "boolean") then true else (if (typeof (a) is "object") then a.constructor.toString().match(/boolean/i) isnt null else false))

		Date: (a) ->
			(if (typeof (a) is "date") then true else (if (typeof (a) is "object") then a.constructor.toString().match(/date/i) isnt null else false))

		HTML: (a) ->
			(if (typeof (a) is "object") then a.constructor.toString().match(/html/i) isnt null else false)

		Number: (a) ->
			(if (typeof (a) is "number") then true else (if (typeof (a) is "object") then a.constructor.toString().match(/Number/) isnt null else false))

		Object: (a) ->
			(if (typeof (a) is "object") then a.constructor.toString().match(/object/i) isnt null else false)

		RegExp: (a) ->
			(if (typeof (a) is "function") then a.constructor.toString().match(/regexp/i) isnt null else false)


