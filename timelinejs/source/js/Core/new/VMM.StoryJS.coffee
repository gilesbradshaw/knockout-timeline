# VeriteCo StoryJS
#================================================== 

#	* CodeKit Import
#	* http://incident57.com/codekit/
#================================================== 

# @codekit-prepend "Core/VMM.Core.js";
# @codekit-prepend "Language/VMM.Language.js";
# @codekit-prepend "Media/VMM.Media.js";
# @codekit-prepend "Slider/VMM.DragSlider.js";
# @codekit-prepend "Slider/VMM.Slider.js";
# @codekit-prepend "Library/AES.js";
# @codekit-prepend "Library/bootstrap-tooltip.js";
if typeof VMM isnt "undefined" and typeof VMM.StoryJS is "undefined"
VMM.StoryJS = ->
		
	# PRIVATE VARS
	#		================================================== 
		
	# PUBLIC FUNCTIONS
	#		================================================== 
	@init = (d) ->

	return