# MediaElement
#================================================== 
define ["VMM","trace", "VMM.ExternalAPI"], (VMM, trace)->
	#returns an object with .type and .id
	
	# DETERMINE THUMBNAIL OR ICON
	
	#loading_messege			=	"<span class='messege'><p>" + VMM.master_config.language.messages.loading + "</p></span>";
	#returns an object with .type and .id
	
	# CREDIT
	
	# CAPTION
	
	# IMAGE
	
	# FLICKR
	
	#mediaElem			=	"<div class='media-image media-shadow' id='" + uid + "'>" + loading_messege + "</div>";
	
	# INSTAGRAM
	
	# GOOGLE DOCS
	
	# YOUTUBE
	
	# VIMEO
	
	# DAILYMOTION
	
	# VINE
	
	# TWITTER
	
	# TWITTER
	
	# SOUNDCLOUD
	
	# GOOGLE MAPS
	
	# GOOGLE PLUS
	
	# WIKIPEDIA
	
	# STORIFY
	
	# IFRAME
	
	# QUOTE
	
	# UNKNOWN
	
	# WEBSITE
	
	#mediaElem			=	"<div class='media-shadow website'><a href='" + m.id + "' target='_blank'>" + "<img src='http://api1.thumbalizr.com/?url=" + m.id.replace(/[\./]$/g, "") + "&width=300' class='media-image'></a></div>";
	
	# NO MATCH
	
	# WRAP THE MEDIA ELEMENT
	
	# RETURN
	VMM.MediaElement = (
		init: ->
			this

		loadingmessage: (m) ->
			"<div class='vco-loading'><div class='vco-loading-container'><div class='vco-loading-icon'></div>" + "<div class='vco-message'><p>" + m + "</p></div></div></div>"

		thumbnail: (data, w, h, uid) ->
			_uid = ""
			_uid = uid    if uid? and uid isnt ""
			if data.media? and data.media isnt ""
				m = VMM.ExternalAPI.mediaTypeFromAsset(data)

				if data.thumbnail? and data.thumbnail isnt ""
					trace "CUSTOM THUMB"
					"<div class='thumbnail thumb-custom' id='" + uid + "_custom_thumb'><img src='" + data.thumbnail + "'></div>"
				else
					return m.mediaType.thumbnail m, uid
		create: (data, uid) ->
			_valid = false
			loading_message = VMM.MediaElement.loadingmessage(VMM.master_config.language.messages.loading + "...")
			if data.media? and data.media isnt ""
				mediaElem = ""
				captionElem = ""
				creditElem = ""
				_id = ""
				m = undefined
				m = VMM.ExternalAPI.mediaTypeFromAsset(data)
				m.uid = uid
				_valid = true
				creditElem = "<div class='credit'>" + VMM.Util.linkify_with_twitter(data.credit, "_blank") + "</div>"    if data.credit? and data.credit isnt ""
				captionElem = "<div class='caption'>" + VMM.Util.linkify_with_twitter(data.caption, "_blank") + "</div>"    if data.caption? and data.caption isnt ""
				
				mediaElem = "<div class='media-container' >" + m.mediaType.createElement(m, loading_message) + creditElem + captionElem + "</div>"
				if m.mediaType.isTextMedia
					return "<div class='text-media'><div class='media-wrapper'>" + mediaElem + "</div></div>"
				else
					return "<div class='media-wrapper'>" + mediaElem + "</div>"
			return
	).init()

