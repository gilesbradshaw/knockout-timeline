define ["jquery", "trace", "VMM.FileExtension", "VMM.Util", "VMM.ExternalAPI", "VMM.Language"], ($, trace, fileExtension,util, ExternalAPI, language)->
	mediaTypes=[]
	unknownMediaType=undefined
	

	addFlags=(mediaType)->
		$.extend mediaType,
			flags:
				active: false
				array: []
				api_loaded: false
				queue: []
	$.extend ExternalAPI,
		keys:
			google: ""
			flickr: ""
			twitter: ""

		keys_master:
			vp: "Pellentesque nibh felis, eleifend id, commodo in, interdum vitae, leo"
			flickr: "RAIvxHY4hE/Elm5cieh4X5ptMyDpj7MYIxziGxi0WGCcy1s+yr7rKQ=="
			google: "jwNGnYw4hE9lmAez4ll0QD+jo6SKBJFknkopLS4FrSAuGfIwyj57AusuR0s8dAo="
			twitter: ""

		init: ->
			this

		setKeys: (d) ->
			ExternalAPI.keys = d
			return
		pushQueues: ->
			for mediaType in mediaTypes
				mediaType.pushQueue()    if mediaType.pushQueue && mediaType.flags.active
			unknownMediaType.pushQueue()    if unknownMediaType.pushQueue && unknownMediaType.flags.active

		configure:(config)->
			for mediaType in mediaTypes
				if mediaType.configure
					mediaType.configure config
			if unknownMediaType.configure
				unknownMediaType.configure config
		stopPlayers:()->
			for mediaType in mediaTypes
				if mediaType.stopPlayers
					mediaType.stopPlayers()
			if unknownMediaType.stopPlayers
				unknownMediaType.stopPlayers()
		insertMediaType:(name,mediaType)->
			mediaType.name=name
			ExternalAPI[name]= addFlags mediaType
			mediaTypes.unshift mediaType
		addMediaType:(name,mediaType)->
			mediaType.name=name
			ExternalAPI[name]= addFlags mediaType
			mediaTypes.push mediaType
		setUnknownMediaType:(mediaType)->
			unknownMediaType=addFlags mediaType
		mediaTypeFromAsset:(asset)->
			media =()->
				type: "unknown"
				id: ""
				start: 0
				hd: false
				link: ""
				lang: language.lang
				uniqueid: util.unique_ID(6)
			if asset.media
				mediaId = asset.media.replace(/^\s\s*/, "").replace(/\s\s*$/, "")
			for mediaType in mediaTypes
				#we pass a copy of the asset too and the media type has the opportunity to adapt itself to the asset
				if mediaType.assetTest and (ret= mediaType.assetTest $.extend({}, asset), media(), mediaId)!=undefined
					if ret != false
						return $.extend media(), ret
					else
						trace "No valid media id detected"
						trace d
						return ret
				
			$.extend (unknownMediaType.assetTest $.extend({}, asset), media(), mediaId),
				type:"unknown"


	ExternalAPI.addMediaType "twitter-ready", ExternalAPI["twitter-ready"]
		
	ExternalAPI.addMediaType "youtube",ExternalAPI.youtube
		
	ExternalAPI.addMediaType "vimeo",ExternalAPI.vimeo
		
	ExternalAPI.addMediaType "dailymotion",ExternalAPI.dailymotion
		
	ExternalAPI.addMediaType "vine",ExternalAPI.vine,
		
	ExternalAPI.addMediaType "soundcloud",ExternalAPI.soundcloud
		
	ExternalAPI.addMediaType "twitter", ExternalAPI.twitter
		
	ExternalAPI.addMediaType "googlemaps",ExternalAPI.googlemaps
		
	ExternalAPI.addMediaType "googleplus",ExternalAPI.googleplus
	ExternalAPI.addMediaType "flickr",ExternalAPI.flickr

	ExternalAPI.addMediaType "instagram",ExternalAPI.instagram

	ExternalAPI.addMediaType "image",ExternalAPI.image
	ExternalAPI.addMediaType "googledocs",ExternalAPI.googledocs
	ExternalAPI.addMediaType "wikipedia",ExternalAPI.wikipedia
	ExternalAPI.addMediaType "website",ExternalAPI.website
		
	ExternalAPI.addMediaType "storify",
		assetTest:(asset,media, d)->
			if d
				if d.match("storify")
					media.type = "storify"
					media.id = d
					media.mediaType = ExternalAPI.storify
					media
		thumbnail:(media, uid)->
			"<div class='thumbnail thumb-storify'></div>"
		createElement:(media,loading_message)->
			"<div class='plain-text-quote'>" + media.id + "</div>"
		isTextMedia:true
	ExternalAPI.addMediaType "blockquote",
		assetTest:(asset,media, d)->
			if d
				if d.match("blockquote")
					media.type = "quote"
					media.id = d
					media.mediaType = ExternalAPI.blockquote
					media
		thumbnail:(media, uid)->
			"<div class='thumbnail thumb-quote'></div>"
		createElement:(media,loading_message)->
			"<div class='plain-text-quote'>" + media.id + "</div>"
		isTextMedia:true
	ExternalAPI.addMediaType "iframe",
		assetTest:(asset,media, d)->
			if d
				if d.match("iframe")
					media.type = "iframe"
					trace "IFRAME"
					regex = /src=['"](\S+?)['"]\s/
					group = d.match(regex)
					media.id = group[1]    if group
					media.mediaType = ExternalAPI.iframe
					trace "iframe url: " + media.id
					if Boolean(media.id)
						media
					else
						false
		thumbnail:(media, uid)->
			"<div class='thumbnail thumb-video'></div>"
		createElement:(media,loading_message)->
			"<div class='media-shadow'><iframe class='media-frame video' autostart='false' frameborder='0' width='100%' height='100%' src='" + media.id + "'></iframe></div>"
		isTextMedia:true
	ExternalAPI.setUnknownMediaType "unknown",
		assetTest:(asset,media, d)->
			if d
				trace "unknown media"
				$.extend media,
					type:"unknown"
					id:d
					mediaType:unknownMediaType
		thumbnail:(media, uid)->
			"<div class='thumbnail thumb-plaintext'></div>"
		createElement:(media,loading_message)->
			trace "NO KNOWN MEDIA TYPE FOUND TRYING TO JUST PLACE THE HTML"
			"<div class='plain-text'><div class='container'>" + util.properQuotes(media.id) + "</div></div>"
		isTextMedia:true

