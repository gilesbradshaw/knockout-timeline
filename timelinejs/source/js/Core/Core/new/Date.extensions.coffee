# CoffeeScript
define [], () ->
	# Extending Date to include Week
	#================================================== 
	Date::getWeek = ->
		onejan = new Date(@getFullYear(), 0, 1)
		Math.ceil (((this - onejan) / 86400000) + onejan.getDay() + 1) / 7


	# Extending Date to include Day of Year
	#================================================== 
	Date::getDayOfYear = ->
		onejan = new Date(@getFullYear(), 0, 1)
		Math.ceil (this - onejan) / 86400000

