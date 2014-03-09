define ["jquery", "VMM", "trace", "VMM.FileExtension", "VMM.ExternalAPI"], ($,VMM, trace, fileExtension)->
	mediaTypes=[]
	unknownMediaType=undefined
	$.extend VMM.ExternalAPI,
		insertMediaType:(name,mediaType)->
			mediaType.name=name
			VMM.ExternalAPI[name]= mediaType
			mediaTypes.unshift mediaType
		addMediaType:(name,mediaType)->
			mediaType.name=name
			VMM.ExternalAPI[name]= mediaType
			mediaTypes.push mediaType
		setUnknownMediaType:(mediaType)->
			unknownMediaType=mediaType
		mediaTypeFromAsset:(asset)->
			media =()->
				type: "unknown"
				id: ""
				start: 0
				hd: false
				link: ""
				lang: VMM.Language.lang
				uniqueid: VMM.Util.unique_ID(6)
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


	VMM.ExternalAPI.addMediaType "twitter-ready",
		assetTest:(asset,media, d)->
			if d and d.match("div class='twitter'")
				id: d
				mediaType:VMM.ExternalAPI["twitter-ready"]
		thumbnail:(media, uid)->
			"<div class='thumbnail thumb-twitter'></div>"
		createElement:(media,loading_message)->
			media.id
		isTextMedia:true
	VMM.ExternalAPI.addMediaType "youtube",$.extend VMM.ExternalAPI.youtube,
		assetTest:(asset,media, d)->
			if d
				if d.match("(www.)?youtube|youtu.be")
					if d.match("v=")
						media.id = VMM.Util.getUrlVars(d)["v"]
					else if d.match("/embed/")
						media.id = d.split("embed/")[1].split(/[?&]/)[0]
					else if d.match(/v\/|v=|youtu\.be\//)
						media.id = d.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0]
					else
						trace "YOUTUBE IN URL BUT NOT A VALID VIDEO"
					$.extend media,
						start:VMM.Util.getUrlVars(d)["t"]
						hd:VMM.Util.getUrlVars(d)["hd"]
						mediaType:VMM.ExternalAPI.youtube
						type:"youtube"
		thumbnail:(media, uid)->
			"<div class='thumbnail thumb-youtube' id='" + uid + "_thumb'></div>"
		createElement:(media,loading_message)->
			mediaElem = "<div class='media-shadow'><div class='media-frame video youtube' id='" + media.uid + "'>" + loading_message + "</div></div>"
			VMM.ExternalAPI.youtube.get media
			mediaElem
	VMM.ExternalAPI.addMediaType "vimeo",$.extend VMM.ExternalAPI.vimeo,
		assetTest:(asset,media, d)->
			if d
				if d.match("(player.)?vimeo.com")
					id:d.split(/video\/|\/\/vimeo\.com\//)[1].split(/[?&]/)[0]
					mediaType:VMM.ExternalAPI.vimeo
					type:"vimeo"
		thumbnail:(media, uid)->
			"<div class='thumbnail thumb-vimeo' id='" + uid + "_thumb'></div>"
		createElement:(media,loading_message)->
			mediaElem = "<div class='media-shadow media-frame video vimeo' id='" + media.uid + "'>" + loading_message + "</div>"
			VMM.ExternalAPI.vimeo.get media
			mediaElem
	VMM.ExternalAPI.addMediaType "dailymotion",$.extend VMM.ExternalAPI.dailymotion,
		assetTest:(asset,media, d)->
			if d
				if d.match("(www.)?dailymotion.com")
					id:d.split(/video\/|\/\/dailymotion\.com\//)[1]
					mediaType:VMM.ExternalAPI.dailymotion
					type:"dailymotion"
		thumbnail:(media, uid)->
			"<div class='thumbnail thumb-video'></div>"
		createElement:(media,loading_message)->
			"<div class='media-shadow'><iframe class='media-frame video dailymotion' autostart='false' frameborder='0' width='100%' height='100%' src='http://www.dailymotion.com/embed/video/" + media.id + "'></iframe></div>"
	VMM.ExternalAPI.addMediaType "vine",$.extend VMM.ExternalAPI.vine,
		assetTest:(asset,media, d)->
			if d
				if d.match("(www.)?vine.co")
					trace "VINE"
					#https://vine.co/v/b55LOA1dgJU
					if d.match("vine.co/v/")
						trace d.split("vine.co/v/")[1]
						id:d.split("vine.co/v/")[1]
						type:"vine"
						mediaType:VMM.ExternalAPI.vine
					else
						type:"vine"
						mediaType:VMM.ExternalAPI.vine
		thumbnail:(media, uid)->
			"<div class='thumbnail thumb-vine'></div>"
		createElement:(media,loading_message)->
			mediaElem = "<div class='media-shadow media-frame video vine' id='" + media.uid + "'>" + loading_message + "</div>"
			VMM.ExternalAPI.vine.get media
			mediaElem
	VMM.ExternalAPI.addMediaType "soundcloud",$.extend VMM.ExternalAPI.soundcloud,
		assetTest:(asset,media, d)->
			if d
				if d.match("(player.)?soundcloud.com")
					id:d
					type:"soundcloud"
					mediaType:VMM.ExternalAPI.soundcloud
		thumbnail:(media, uid)->
			"<div class='thumbnail thumb-audio'></div>"
		createElement:(media,loading_message)->
			mediaElem = "<div class='media-frame media-shadow soundcloud' id='" + media.uid + "'>" + loading_message + "</div>"
			VMM.ExternalAPI.soundcloud.get media
			mediaElem
	VMM.ExternalAPI.addMediaType "twitter",$.extend VMM.ExternalAPI.twitter,
		assetTest:(asset,media, d)->
			if d
				if d.match("(www.)?twitter.com") and d.match("status")
					if d.match("status/")
						media.id = d.split("status/")[1]
					else if d.match("statuses/")
						media.id = d.split("statuses/")[1]
					else
						media.id = ""
					media.type="twitter"
					media.mediaType=VMM.ExternalAPI.twitter
					media
		thumbnail:(media, uid)->
			"<div class='thumbnail thumb-twitter'></div>"
		createElement:(media,loading_message)->
			mediaElem = "<div class='twitter' id='" + media.uid + "'>" + loading_message + "</div>"
			VMM.ExternalAPI.twitter.get media
			mediaElem
		isTextMedia:true
	VMM.ExternalAPI.addMediaType "googlemaps",$.extend VMM.ExternalAPI.googlemaps,
		assetTest:(asset,media, d)->
			if d
				if d.match("maps.google") and not d.match("staticmap")
					$.extend media,
						type:"google-map"
						id:d.split(/src=['|"][^'|"]*?['|"]/g)
						mediaType:VMM.ExternalAPI.googlemaps
		thumbnail:(media, uid)->
			"<div class='thumbnail thumb-map'></div>"
		createElement:(media,loading_message)->
			mediaElem = "<div class='media-frame media-shadow map' id='" + media.uid + "'>" + loading_message + "</div>"
			VMM.ExternalAPI.googlemaps.get media
			mediaElem
	VMM.ExternalAPI.addMediaType "googleplus",$.extend VMM.ExternalAPI.googleplus,
		assetTest:(asset,media, d)->
			if d
				if d.match("plus.google")
					media.type = "googleplus"
					media.id = d.split("/posts/")[1]
					media.mediaType=VMM.ExternalAPI.googleplus
			
					#https://plus.google.com/u/0/112374836634096795698/posts/bRJSvCb5mUU
					#https://plus.google.com/107096716333816995401/posts/J5iMpEDHWNL
					if d.split("/posts/")[0].match("u/0/")
						media.user = d.split("u/0/")[1].split("/posts")[0]
					else
						media.user = d.split("google.com/")[1].split("/posts/")[0]
		thumbnail:(media, uid)->
			"<div class='thumbnail thumb-googleplus'></div>"
		createElement:(media,loading_message)->
			mediaElem = "<div class='googleplus' id='googleplus_" + media.id + "'>" + loading_message + "</div>"
			VMM.ExternalAPI.googleplus.get media
			mediaElem
		isTextMedia:true
	VMM.ExternalAPI.addMediaType "flickr",$.extend VMM.ExternalAPI.flickr,
		assetTest:(asset,media, d)->
			if d
				if d.match("flickr.com/photos/")
					media.type = "flickr"
					media.id = VMM.ExternalAPI.flickr.getFlickrIdFromUrl(d)
					media.link = d
					media.mediaType=VMM.ExternalAPI.flickr
					if Boolean(media.id)
						media
					else
						false
		thumbnail:(media, uid)->
			"<div class='thumbnail thumb-photo' id='" + uid + "_thumb'></div>"
		createElement:(media,loading_message)->
			mediaElem = "<div class='media-image media-shadow'><a href='" + media.link + "' target='_blank'><img id='" + media.uid + "'></a></div>"
			VMM.ExternalAPI.flickr.get media
			mediaElem
	VMM.ExternalAPI.addMediaType "instagram",$.extend VMM.ExternalAPI.instagram,
		assetTest:(asset,media, d)->
			if d
				if VMM.ExternalAPI.instagram.isInstagramUrl(d)
					media.type = "instagram"
					media.link = d
					media.id = VMM.ExternalAPI.instagram.getInstagramIdFromUrl(d)
					media.mediaType=VMM.ExternalAPI.instagram
					if Boolean(media.id)
						media
					else 
						false
		thumbnail:(media, uid)->
			"<div class='thumbnail thumb-instagram' id='" + uid + "_thumb'><img src='" + VMM.ExternalAPI.instagram.get(media, true) + "'></div>"
		createElement:(media,loading_message)->
			"<div class='media-image media-shadow'><a href='" + media.link + "' target='_blank'><img src='" + VMM.ExternalAPI.instagram.get(media) + "'></a></div>"
	VMM.ExternalAPI.addMediaType "image",
		assetTest:(asset,media, d)->
			if d
				if d.match(/jpg|jpeg|png|gif/i) or d.match("staticmap") or d.match("yfrog.com") or d.match("twitpic.com")
					$.extend media,
						type: "image"
						id: d
						mediaType:VMM.ExternalAPI.image
		thumbnail:(media, uid)->
			"<div class='thumbnail thumb-photo'></div>"
		createElement:(media,loading_message)->
			media.id = media.id.replace("https://", "http://")    if media.id.match("https://")
			"<div class='media-image media-shadow'><img src='" + media.id + "' class='media-image'></div>"
	VMM.ExternalAPI.addMediaType "googledocs",$.extend VMM.ExternalAPI.googledocs,
		assetTest:(asset,media, d)->
			if d
				if fileExtension.googleDocType(d)
					$.extend media,
						type: "googledoc"
						id: d
						mediaType:VMM.ExternalAPI.googledocs
		thumbnail:(media, uid)->
			"<div class='thumbnail thumb-document'></div>"
		createElement:(media,loading_message)->
			mediaElem = "<div class='media-frame media-shadow doc' id='" + media.uid + "'>" + loading_message + "</div>"
			VMM.ExternalAPI.googledocs.get media
			mediaElem
	VMM.ExternalAPI.addMediaType "wikipedia",$.extend VMM.ExternalAPI.wikipedia,
		assetTest:(asset,media, d)->
			if d
				if d.match("(www.)?wikipedia.org")
					media.type = "wikipedia"
			
					#media.id = d.split("wiki\/")[1];
					wiki_id = d.split("wiki/")[1].split("#")[0].replace("_", " ")
					media.id = wiki_id.replace(" ", "%20")
					media.lang = d.split("//")[1].split(".wikipedia")[0]
					media.mediaType = VMM.ExternalAPI.wikipedia
					media
		thumbnail:(media, uid)->
			"<div class='thumbnail thumb-wikipedia'></div>"
		createElement:(media,loading_message)->
			mediaElem = "<div class='wikipedia' id='" + media.uid + "'>" + loading_message + "</div>"
			VMM.ExternalAPI.wikipedia.get media
		isTextMedia:true
	VMM.ExternalAPI.addMediaType "website",
		assetTest:(asset,media, d)->
			if d
				if d.indexOf("http://") is 0
					media.type = "website"
					media.id = d
					media.mediaType = VMM.ExternalAPI.website
					media
		thumbnail:(media, uid)->
			"<div class='thumbnail thumb-website' id='" + uid + "_thumb'></div>"
		createElement:(media,loading_message)->
			mediaElem = "<div class='media-shadow website' id='" + media.uid + "'>" + loading_message + "</div>"
			VMM.ExternalAPI.webthumb.get media
			mediaElem
	VMM.ExternalAPI.addMediaType "storify",
		assetTest:(asset,media, d)->
			if d
				if d.match("storify")
					media.type = "storify"
					media.id = d
					media.mediaType = VMM.ExternalAPI.storify
					media
		thumbnail:(media, uid)->
			"<div class='thumbnail thumb-storify'></div>"
		createElement:(media,loading_message)->
			"<div class='plain-text-quote'>" + media.id + "</div>"
		isTextMedia:true
	VMM.ExternalAPI.addMediaType "blockquote",
		assetTest:(asset,media, d)->
			if d
				if d.match("blockquote")
					media.type = "quote"
					media.id = d
					media.mediaType = VMM.ExternalAPI.blockquote
					media
		thumbnail:(media, uid)->
			"<div class='thumbnail thumb-quote'></div>"
		createElement:(media,loading_message)->
			"<div class='plain-text-quote'>" + media.id + "</div>"
		isTextMedia:true
	VMM.ExternalAPI.addMediaType "iframe",
		assetTest:(asset,media, d)->
			if d
				if d.match("iframe")
					media.type = "iframe"
					trace "IFRAME"
					regex = /src=['"](\S+?)['"]\s/
					group = d.match(regex)
					media.id = group[1]    if group
					media.mediaType = VMM.ExternalAPI.iframe
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
	VMM.ExternalAPI.setUnknownMediaType "unknown",
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
			"<div class='plain-text'><div class='container'>" + VMM.Util.properQuotes(media.id) + "</div></div>"
		isTextMedia:true

