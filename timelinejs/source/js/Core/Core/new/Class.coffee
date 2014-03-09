

#	Simple JavaScript Inheritance
#	By John Resig http://ejohn.org/
#	MIT Licensed.
#================================================== 

# The base Class implementation (does nothing)

# Create a new Class that inherits from this class

# Instantiate a base class (but only create the instance,
# don't run the init constructor)

# Copy the properties over onto the new prototype

# Check if we're overwriting an existing function

# Add a new ._super() method that is the same method
# but on the super-class

# The method only need to be bound temporarily, so we
# remove it when we're done executing

# The dummy class constructor

# All construction is actually done in the init method

# Populate our constructed prototype object

# Enforce the constructor to be what we expect

# And make this class extendable

define [], () ->
	(->
		initializing = false
		fnTest = (if /xyz/.test(->
			xyz
			return
		) then /\b_super\b/ else /.*/)
		Class = ->

		Class.extend = (prop) ->
			Class = ->
				@init.apply this, arguments    if not initializing and @init
				return
			_super = @::
			initializing = true
			prototype = new this()
			initializing = false
			for name of prop
				prototype[name] = (if typeof prop[name] is "function" and typeof _super[name] is "function" and fnTest.test(prop[name]) then ((name, fn) ->
					->
						tmp = @_super
						@_super = _super[name]
						ret = fn.apply(this, arguments)
						@_super = tmp
						ret
				)(name, prop[name]) else prop[name])
			Class:: = prototype
			Class::constructor = Class
			Class.extend = arguments.callee
			Class

		return Class
	)()
