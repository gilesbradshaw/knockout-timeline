define ["jquery", "knockout", "trace", "VMM.FileExtension", "VMM.Util", "VMM.ExternalAPI", "VMM.Language"], ($, ko, trace, fileExtension,util, ExternalAPI, language)->
	mediaTypes=[]
	unknownMediaType=undefined
	

	addFlags=(mediaType)->
		$.extend mediaType,
			flags:
				active: false
				api_loaded: false
			create:mediaType.create or ->
			stop:mediaType.stop or ->
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
		
		configure:(config)->
			for mediaType in mediaTypes
				if mediaType.configure
					mediaType.configure config
			if unknownMediaType.configure
				unknownMediaType.configure config
		
		insertMediaType:(name,mediaType)->
			mediaType.name=name
			ExternalAPI[name]= addFlags mediaType
			mediaTypes.unshift mediaType
		addMediaType:(name,mediaType)->
			mediaType.name=name
			ExternalAPI[name]= addFlags mediaType
			mediaTypes.push mediaType
		setUnknownMediaType:(name, mediaType)->
			ExternalAPI[name]= addFlags mediaType
			unknownMediaType=ExternalAPI[name]
		mediaTypeFromAsset:(asset)->
			media =()->
				type: "unknown"
				id: ""
				start: 0
				hd: false
				link: ""
				lang: language.lang
				uniqueid: util.unique_ID(6)
			if ko.unwrap(asset.media)
				mediaId = ko.unwrap(asset.media).replace(/^\s\s*/, "").replace(/\s\s*$/, "")
			for mediaType in mediaTypes
				#we pass a copy of the asset too and the media type has the opportunity to adapt itself to the asset
				if mediaType.assetTest and (ret= mediaType.assetTest $.extend({}, asset), media(), mediaId)!=undefined
					if ret != false
						return $.extend media(), ret
					else
						trace "No valid media id detected"
						trace mediaId
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
		
	ExternalAPI.addMediaType "storify",ExternalAPI.storify
		
	ExternalAPI.addMediaType "blockquote",ExternalAPI.blockquote
		
	ExternalAPI.addMediaType "iframe",ExternalAPI.iframe

	ExternalAPI.setUnknownMediaType "unknown",ExternalAPI.unknown
		

