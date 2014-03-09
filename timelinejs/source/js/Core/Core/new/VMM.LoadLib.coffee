#
#	LoadLib
#	Designed and built by Zach Wise digitalartwork.net
#

#	* CodeKit Import
#	* http://incident57.com/codekit/
#================================================== 
define ["trace","lazyload"], (trace)->
# @codekit-prepend "../Library/LazyLoad.js";
	LoadLib = ((doc) ->
		isLoaded = (url) ->
			i = 0
			has_loaded = false
			i = 0
			while i < loaded.length
				has_loaded = true    if loaded[i] is url
				i++
			if has_loaded
				true
			else
				loaded.push url
				false
		loaded = []
		css: (urls, callback, obj, context) ->
			LazyLoad.css urls, callback, obj, context    unless isLoaded(urls)
			return

		js: (urls, callback, obj, context) ->
			LazyLoad.js urls, callback, obj, context    unless isLoaded(urls)
			return
	)(document)