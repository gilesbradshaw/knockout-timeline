# CoffeeScript
define ["is_"], (is_) ->
	# A MORE SPECIFIC TYPEOF();
#//	http://rolandog.com/archives/2007/01/18/typeof-a-more-specific-typeof/
#================================================== 

	type = of: (a) ->
		for i of is_
			return i.toLowerCase()    if is_[i](a)
		return