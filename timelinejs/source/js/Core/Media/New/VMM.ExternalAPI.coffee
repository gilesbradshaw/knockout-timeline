# External API
#================================================== 

#masterConfig.api.pushqueues.push(VMM.ExternalAPI.twitter.pushQueue);

#twitter_timeout	= setTimeout(VMM.ExternalAPI.twitter.errorTimeOut, masterConfig.timers.api, tweet),
#callback_timeout= setTimeout(callback, masterConfig.timers.api, tweet);

#
#				// Disabled thanks to twitter's new api
#				
#				library.getJSON(the_url, function(d) {
#					var id		= d.id_str,
#						twit	= "<blockquote><p>",
#						td		= util.linkify_with_twitter(d.text, "_blank");
#					
#					//	TWEET CONTENT	
#					twit += td;
#					twit += "</p></blockquote>";
#					
#					//	TWEET MEDIA
#					if (typeof d.entities.media != 'undefined') {
#						if (d.entities.media[0].type == "photo") {
#							//twit += "<img src=' " + d.entities.media[0].media_url + "'    alt=''>"
#						}
#					}
#					
#					//	TWEET AUTHOR
#					twit += "<div class='vcard author'>";
#					twit += "<a class='screen-name url' href='https://twitter.com/" + d.user.screen_name + "' data-screen-name='" + d.user.screen_name + "' target='_blank'>";
#					twit += "<span class='avatar'><img src=' " + d.user.profile_image_url + "'    alt=''></span>";
#					twit += "<span class='fn'>" + d.user.name + "</span>";
#					twit += "<span class='nickname'>@" + d.user.screen_name + "<span class='thumbnail-inline'></span></span>";
#					twit += "</a>";
#					twit += "</div>";
#				
#					
#				
#					library.attachElement("#"+tweet.id.toString(), twit );
#					library.attachElement("#text_thumb_"+tweet.id.toString(), d.text );
#					library.attachElement("#marker_content_" + tweet.id.toString(), d.text );
#					
#				})
#				.error(function(jqXHR, textStatus, errorThrown) {
#					trace("TWITTER error");
#					trace("TWITTER ERROR: " + textStatus + " " + jqXHR.responseText);
#					library.attachElement("#"+tweet.id, library.loadingmessage("ERROR LOADING TWEET " + tweet.mid) );
#				})
#				.success(function(d) {
#					clearTimeout(twitter_timeout);
#					clearTimeout(callback_timeout);
#					callback();
#				});
#				
#				

# CHECK RATE STATUS

#mes 	= 	"<p>Tweet " + id + " was not found.</p>";

#callback_timeout= setTimeout(callback, masterConfig.timers.api, tweet);

#	TWEET CONTENT

#	TWEET AUTHOR

#clearTimeout(callback_timeout);

# clearTimeout(callback_timeout);

#var the_url = document.location.protocol + "//api.twitter.com/1/statuses/oembed.json?id=" + id+ "&callback=?";

#
#				var t = d.replace(/(\d{1,2}[:]\d{2}[:]\d{2}) (.*)/, '$2 $1');
#				t = t.replace(/(\+\S+) (.*)/, '$2 $1');
#				var date = new Date(Date.parse(t)).toLocaleDateString();
#				var time = new Date(Date.parse(t)).toLocaleTimeString();
#				

# FIND THE TWITTER ID
#					================================================== 

# FETCH THE DATA
#					================================================== 

# FORMAT RESPONSE
#						================================================== 

# CHECK IF THATS ALL OF THEM
#						================================================== 

# FORMAT RESPONSE
#					================================================== 

#td = td.replace(/(@([\w]+))/g,"<a href='http://twitter.com/$2' target='_blank'>$1</a>");
#td = td.replace(/(#([\w]+))/g,"<a href='http://twitter.com/#search?q=%23$2' target='_blank'>$1</a>");

#twit += " <a href='https://twitter.com/" + d.user.screen_name + "/status/" + d.id_str + "' target='_blank' alt='link to original tweet' title='link to original tweet'>" + "<span class='created-at'></span>" + " </a>";
# see also below for default if this is a google type

#
#					Investigating a google map api change on the latest release that causes custom map types to stop working
#					http://stackoverflow.com/questions/13486271/google-map-markermanager-cannot-call-method-substr-of-undefined
#					soulution is to use api ver 3.9
#				

# trace(retURL);

# Make the Map
#				================================================== 

# ATTRIBUTION

# DETERMINE IF KML IS POSSIBLE 

#loadPlaces();

# GEOCODE

# POSITION MAP
#map.setCenter(results[0].geometry.location);
#map.panTo(location);

# PLACES

#search_request.location	= search_bounds;

#createMarker(results[i]);

# IF There's a problem loading the map, load a simple iFrame version instead

#location = new google.maps.LatLng(parseFloat(d.results[0].geometry.location.lat),parseFloat(d.results[0].geometry.location.lng));
#map.panTo(location);

# KML

#mediaElem	=	"<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + gplus.url + "&amp;embedded=true'></iframe>";

#a_data.url
#a_data.image.url
#a_data.actor.displayName
#a_data.provider.title
#a_data.object.content

#g_content		+=	"<h4>" + a_data.title + "</h4>";

#g_attachments	+=	"<div class='googleplus-attachemnts'>";

#g_attachments	+=	"<p>" + a_data.object.attachments[k].content + "</p>";

#mediaElem		=	"<div class='googleplus'>";

#
#				for(var i = 0; i < masterConfig.googleplus.queue.length; i++) {
#					VMM.ExternalAPI.googleplus.create(masterConfig.googleplus.queue[i]);
#				}
#				masterConfig.googleplus.queue = [];
#				

#flickr_thumb_id = "flickr_" + uid + "_thumb";

#library.attachElement(flickr_large_id, "<a href='" + flick.link + "' target='_blank'><img src='" + flickr_img_size + "'></a>");

#callback();

# TRY AGAIN?

# THUMBNAIL

# SET TO HD
# DOESN'T WORK AS OF NOW
#masterConfig.youtube.array[i].player.setPlaybackQuality("hd720");

# THUMBNAIL

# VIDEO

# VIDEO
# TODO: NEED TO ADD ASYNC SCRIPT TO TIMELINE FLOW
#.split("/")[0];

# Main Image

# Thumb

#    YOUTUBE API READY
#	Can't find a way to customize this callback and keep it in the VMM namespace
#	Youtube wants it to be this function. 
#================================================== 
define [
	"global"
	"trace"
	"VMM.LoadLib"
	"VMM.Browser"
	"VMM.Date"
	"VMM.Library"
	"VMM.Util"
	"VMM.masterConfig"
	"VMM.FileExtension"
], (global,trace, LoadLib, browser, vDate, library, util, masterConfig, fileExtension)->
	global.onYouTubePlayerAPIReady = ->
		trace "GLOBAL YOUTUBE API CALLED"
		ExternalAPI.youtube.onAPIReady()
		return

	ExternalAPI = 
		
		"twitter-ready":
			assetTest:(asset,media, d)->
				if d and d.match("div class='twitter'")
					id: d
					mediaType:ExternalAPI["twitter-ready"]
			thumbnail:(media, uid)->
				"<div class='thumbnail thumb-twitter'></div>"
			createElement:(media,loading_message)->
				media.id
			isTextMedia:true

		twitter:
			tweetArray: []
			get: (m) ->
				tweet =
					mid: m.id
					id: m.uid

				ExternalAPI.twitter.flags.queue.push tweet
				ExternalAPI.twitter.flags.active = true
				return

			create: (tweet, callback) ->
				id = tweet.mid.toString()
				error_obj = twitterid: tweet.mid
				the_url = "//api.twitter.com/1/statuses/show.json?id=" + tweet.mid + "&include_entities=true&callback=?"
				ExternalAPI.twitter.getOEmbed tweet, callback
				return

			errorTimeOut: (tweet) ->
				trace "TWITTER JSON ERROR TIMEOUT " + tweet.mid
				library.attachElement "#" + tweet.id.toString(), library.loadingmessage("Still waiting on Twitter: " + tweet.mid)
				library.getJSON "//api.twitter.com/1/account/rate_limit_status.json", (d) ->
					trace "REMAINING TWITTER API CALLS " + d.remaining_hits
					trace "TWITTER RATE LIMIT WILL RESET AT " + d.reset_time
					mes = ""
					if d.remaining_hits is 0
						mes = "<p>You've reached the maximum number of tweets you can load in an hour.</p>"
						mes += "<p>You can view tweets again starting at: <br/>" + d.reset_time + "</p>"
					else
						mes = "<p>Still waiting on Twitter. " + tweet.mid + "</p>"
					library.attachElement "#" + tweet.id.toString(), library.loadingmessage(mes)
					return

				return

			errorTimeOutOembed: (tweet) ->
				trace "TWITTER JSON ERROR TIMEOUT " + tweet.mid
				library.attachElement "#" + tweet.id.toString(), library.loadingmessage("Still waiting on Twitter: " + tweet.mid)
				return

			pushQueue: ->
				if ExternalAPI.twitter.flags.queue.length > 0
					ExternalAPI.twitter.create ExternalAPI.twitter.flags.queue[0], ExternalAPI.twitter.pushQueue
					util.removeRange ExternalAPI.twitter.flags.queue, 0
				return

			getOEmbed: (tweet, callback) ->
				the_url = "//api.twitter.com/1/statuses/oembed.json?id=" + tweet.mid + "&omit_script=true&include_entities=true&callback=?"
				twitter_timeout = setTimeout(ExternalAPI.twitter.errorTimeOutOembed, masterConfig.timers.api, tweet)
				library.getJSON(the_url, (d) ->
					twit = ""
					tuser = ""
					twit += d.html.split("</p>&mdash;")[0] + "</p></blockquote>"
					tuser = d.author_url.split("twitter.com/")[1]
					twit += "<div class='vcard author'>"
					twit += "<a class='screen-name url' href='" + d.author_url + "' target='_blank'>"
					twit += "<span class='avatar'></span>"
					twit += "<span class='fn'>" + d.author_name + "</span>"
					twit += "<span class='nickname'>@" + tuser + "<span class='thumbnail-inline'></span></span>"
					twit += "</a>"
					twit += "</div>"
					library.attachElement "#" + tweet.id.toString(), twit
					library.attachElement "#text_thumb_" + tweet.id.toString(), d.html
					library.attachElement "#marker_content_" + tweet.id.toString(), d.html
					return
				).error((jqXHR, textStatus, errorThrown) ->
					trace "TWITTER error"
					trace "TWITTER ERROR: " + textStatus + " " + jqXHR.responseText
					clearTimeout twitter_timeout
					library.attachElement "#" + tweet.id, library.loadingmessage("ERROR LOADING TWEET " + tweet.mid)
					return
				).success (d) ->
					clearTimeout twitter_timeout
					callback()
					return

				return

			getHTML: (id) ->
				the_url = "//api.twitter.com/1/statuses/oembed.json?id=" + id + "&omit_script=true&include_entities=true&callback=?"
				library.getJSON the_url, ExternalAPI.twitter.onJSONLoaded
				return

			onJSONLoaded: (d) ->
				trace "TWITTER JSON LOADED"
				id = d.id
				library.attachElement "#" + id, util.linkify_with_twitter(d.html)
				return

			parseTwitterDate: (d) ->
				date = new Date(Date.parse(d))
				date

			prettyParseTwitterDate: (d) ->
				date = new Date(Date.parse(d))
				vDate.prettyDate date, true

			getTweets: (tweets) ->
				tweetArray = []
				number_of_tweets = tweets.length
				i = 0

				while i < tweets.length
					twitter_id = ""
					if tweets[i].tweet.match("status/")
						twitter_id = tweets[i].tweet.split("status/")[1]
					else if tweets[i].tweet.match("statuses/")
						twitter_id = tweets[i].tweet.split("statuses/")[1]
					else
						twitter_id = ""
					the_url = "//api.twitter.com/1/statuses/show.json?id=" + twitter_id + "&include_entities=true&callback=?"
					library.getJSON(the_url, (d) ->
						tweet = {}
						twit = "<div class='twitter'><blockquote><p>"
						td = util.linkify_with_twitter(d.text, "_blank")
						twit += td
						twit += "</p>"
						twit += "— " + d.user.name + " (<a href='https://twitter.com/" + d.user.screen_name + "'>@" + d.user.screen_name + "</a>) <a href='https://twitter.com/" + d.user.screen_name + "/status/" + d.id + "'>" + ExternalAPI.twitter.prettyParseTwitterDate(d.created_at) + " </a></blockquote></div>"
						tweet.content = twit
						tweet.raw = d
						tweetArray.push tweet
						if tweetArray.length is number_of_tweets
							the_tweets = tweetdata: tweetArray
							library.fireEvent global, "TWEETSLOADED", the_tweets
						return
					).success(->
						trace "second success"
						return
					).error(->
						trace "error"
						return
					).complete ->
						trace "complete"
						return

					i++
				return

			getTweetSearch: (tweets, number_of_tweets) ->
				_number_of_tweets = 40
				_number_of_tweets = number_of_tweets    if number_of_tweets? and number_of_tweets isnt ""
				the_url = "//search.twitter.com/search.json?q=" + tweets + "&rpp=" + _number_of_tweets + "&include_entities=true&result_type=mixed"
				tweetArray = []
				library.getJSON the_url, (d) ->
					i = 0

					while i < d.results.length
						tweet = {}
						twit = "<div class='twitter'><blockquote><p>"
						td = util.linkify_with_twitter(d.results[i].text, "_blank")
						twit += td
						twit += "</p>"
						twit += "— " + d.results[i].from_user_name + " (<a href='https://twitter.com/" + d.results[i].from_user + "'>@" + d.results[i].from_user + "</a>) <a href='https://twitter.com/" + d.results[i].from_user + "/status/" + d.id + "'>" + ExternalAPI.twitter.prettyParseTwitterDate(d.results[i].created_at) + " </a></blockquote></div>"
						tweet.content = twit
						tweet.raw = d.results[i]
						tweetArray.push tweet
						i++
					the_tweets = tweetdata: tweetArray
					library.fireEvent global, "TWEETSLOADED", the_tweets
					return

				return

			prettyHTML: (id, secondary) ->
				id = id.toString()
				error_obj = twitterid: id
				the_url = "//api.twitter.com/1/statuses/show.json?id=" + id + "&include_entities=true&callback=?"
				twitter_timeout = setTimeout(ExternalAPI.twitter.errorTimeOut, masterConfig.timers.api, id)
				library.getJSON(the_url, ExternalAPI.twitter.formatJSON).error((jqXHR, textStatus, errorThrown) ->
					trace "TWITTER error"
					trace "TWITTER ERROR: " + textStatus + " " + jqXHR.responseText
					library.attachElement "#twitter_" + id, "<p>ERROR LOADING TWEET " + id + "</p>"
					return
				).success (d) ->
					clearTimeout twitter_timeout
					ExternalAPI.twitter.secondaryMedia d    if secondary
					return

				return

			formatJSON: (d) ->
				id = d.id_str
				twit = "<blockquote><p>"
				td = util.linkify_with_twitter(d.text, "_blank")
				twit += td
				twit += "</p></blockquote>"
				twit += "<div class='vcard author'>"
				twit += "<a class='screen-name url' href='https://twitter.com/" + d.user.screen_name + "' data-screen-name='" + d.user.screen_name + "' target='_blank'>"
				twit += "<span class='avatar'><img src=' " + d.user.profile_image_url + "'    alt=''></span>"
				twit += "<span class='fn'>" + d.user.name + "</span>"
				twit += "<span class='nickname'>@" + d.user.screen_name + "<span class='thumbnail-inline'></span></span>"
				twit += "</a>"
				twit += "</div>"
				twit += "<img src=' " + d.entities.media[0].media_url + "'    alt=''>"    if d.entities.media[0].type is "photo"    unless typeof d.entities.media is "undefined"
				library.attachElement "#twitter_" + id.toString(), twit
				library.attachElement "#text_thumb_" + id.toString(), d.text
				return
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
						media.mediaType=ExternalAPI.twitter
						media
			thumbnail:(media, uid)->
				"<div class='thumbnail thumb-twitter'></div>"
			createElement:(media,loading_message)->
				ExternalAPI.twitter.get media
				mediaElem = "<div class='twitter' id='" + media.uid + "'>" + loading_message + "</div>"
			isTextMedia:true
		googlemaps:
			assetTest:(asset,media, d)->
				if d
					if d.match("maps.google") and not d.match("staticmap")
						$.extend media,
							type:"google-map"
							id:d.split(/src=['|"][^'|"]*?['|"]/g)
							mediaType:ExternalAPI.googlemaps
			thumbnail:(media, uid)->
				"<div class='thumbnail thumb-map'></div>"
			createElement:(media,loading_message)->
				
				ExternalAPI.googlemaps.get media
				mediaElem = "<div class='media-frame media-shadow map' id='" + media.uid + "'>" + loading_message + "</div>"
			configure:(config)->
				ExternalAPI.googlemaps.setMapType config.maptype

			maptype: "TERRAIN"
			setMapType: (d) ->
				ExternalAPI.googlemaps.maptype = d    unless d is ""
				return

			get: (m) ->
				timer = undefined
				api_key = undefined
				map_url = undefined
				m.vars = util.getUrlVars(m.id)
				unless ExternalAPI.keys.google is ""
					api_key = ExternalAPI.keys.google
				else
					api_key = Aes.Ctr.decrypt(ExternalAPI.keys_master.google, ExternalAPI.keys_master.vp, 256)
				map_url = "//maps.googleapis.com/maps/api/js?key=" + api_key + "&v=3.9&libraries=places&sensor=false&callback=ExternalAPI.googlemaps.onMapAPIReady"
				if ExternalAPI.googlemaps.flags.active
					ExternalAPI.googlemaps.flags.queue.push m
				else
					ExternalAPI.googlemaps.flags.queue.push m
					if ExternalAPI.googlemaps.flags.api_loaded
						dontcrashjs2coffee = 0
					else
						LoadLib.js map_url, ->
							trace "Google Maps API Library Loaded"
							return

				return

			create: (m) ->
				ExternalAPI.googlemaps.createAPIMap m
				return

			createiFrameMap: (m) ->
				embed_url = m.id + "&output=embed"
				mc = ""
				unique_map_id = m.uid.toString() + "_gmap"
				mc += "<div class='google-map' id='" + unique_map_id + "' style='width=100%;height=100%;'>"
				mc += "<iframe width='100%' height='100%' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='" + embed_url + "'></iframe>"
				mc += "</div>"
				library.attachElement "#" + m.uid, mc
				return

			createAPIMap: (m) ->
				mapProvider = (name) ->
					if name of ExternalAPI.googlemaps.map_providers
						map_attribution = ExternalAPI.googlemaps.map_attribution[ExternalAPI.googlemaps.map_providers[name].attribution]
						ExternalAPI.googlemaps.map_providers[name]
					else
						if ExternalAPI.googlemaps.defaultType(name)
							trace "GOOGLE MAP DEFAULT TYPE"
							google.maps.MapTypeId[name.toUpperCase()]
						else
							trace "Not a maptype: " + name
					return
				geocodePlace = ->
					geocoder = new google.maps.Geocoder()
					address = util.getUrlVars(m.id)["q"]
					marker = undefined
					if address.match("loc:")
						address_latlon = address.split(":")[1].split("+")
						location = new google.maps.LatLng(parseFloat(address_latlon[0]), parseFloat(address_latlon[1]))
						has_location = true
					geocoder.geocode
						address: address
					, (results, status) ->
						if status is google.maps.GeocoderStatus.OK
							marker = new google.maps.Marker(
								map: map
								position: results[0].geometry.location
							)
							unless typeof results[0].geometry.viewport is "undefined"
								map.fitBounds results[0].geometry.viewport
							else unless typeof results[0].geometry.bounds is "undefined"
								map.fitBounds results[0].geometry.bounds
							else
								map.setCenter results[0].geometry.location
							map.panTo location    if has_location
							map.setZoom zoom    if has_zoom
						else
							trace "Geocode for " + address + " was not successful for the following reason: " + status
							trace "TRYING PLACES SEARCH"
							map.panTo location    if has_location
							map.setZoom zoom    if has_zoom
							loadPlaces()
						return

					return
				loadPlaces = ->
					placeResults = (results, status) ->
						if status is google.maps.places.PlacesServiceStatus.OK
							i = 0

							while i < results.length
								i++
							if has_location
								map.panTo location
							else
								if results.length >= 1
									map.panTo results[0].geometry.location
									map.setZoom zoom    if has_zoom
						else
							trace "Place search for " + search_request.query + " was not successful for the following reason: " + status
							trace "YOU MAY NEED A GOOGLE MAPS API KEY IN ORDER TO USE THIS FEATURE OF TIMELINEJS"
							trace "FIND OUT HOW TO GET YOUR KEY HERE: https://developers.google.com/places/documentation/#Authentication"
							if has_location
								map.panTo location
								map.setZoom zoom    if has_zoom
							else
								trace "USING SIMPLE IFRAME MAP EMBED"
								m.id = m.url[0].replace("https", "http")    if m.id[0].match("https")
								ExternalAPI.googlemaps.createiFrameMap m
						return
					createMarker = (place) ->
						marker = undefined
						placeLoc = undefined
						placeLoc = place.geometry.location
						marker = new google.maps.Marker(
							map: map
							position: place.geometry.location
						)
						google.maps.event.addListener marker, "click", ->
							infowindow.setContent place.name
							infowindow.open map, this
							return

						return
					place = undefined
					search_request = undefined
					infowindow = undefined
					search_bounds = undefined
					bounds_sw = undefined
					bounds_ne = undefined
					place_search = new google.maps.places.PlacesService(map)
					infowindow = new google.maps.InfoWindow()
					search_request =
						query: ""
						types: [
							"country"
							"neighborhood"
							"political"
							"locality"
							"geocode"
						]

					search_request.query = util.getUrlVars(m.id)["q"]    if type.of(util.getUrlVars(m.id)["q"]) is "string"
					if has_location
						search_request.location = location
						search_request.radius = "15000"
					else
						bounds_sw = new google.maps.LatLng(-89.999999, -179.999999)
						bounds_ne = new google.maps.LatLng(89.999999, 179.999999)
						search_bounds = new google.maps.LatLngBounds(bounds_sw, bounds_ne)
					place_search.textSearch search_request, placeResults
					return
				loadPlacesAlt = ->
					api_key = undefined
					places_url = undefined
					has_key = false
					trace "LOADING PLACES API FOR GOOGLE MAPS"
					unless ExternalAPI.keys.google is ""
						api_key = ExternalAPI.keys.google
						has_key = true
					else
						trace "YOU NEED A GOOGLE MAPS API KEY IN ORDER TO USE THIS FEATURE OF TIMELINEJS"
						trace "FIND OUT HOW TO GET YOUR KEY HERE: https://developers.google.com/places/documentation/#Authentication"
					places_url = "https://maps.googleapis.com/maps/api/place/textsearch/json?key=" + api_key + "&sensor=false&language=" + m.lang + "&"
					places_url += "query=" + util.getUrlVars(m.id)["q"]    if type.of(util.getUrlVars(m.id)["q"]) is "string"
					places_url += "&location=" + location    if has_location
					if has_key
						library.getJSON(places_url, (d) ->
							trace "PLACES JSON"
							places_location = ""
							places_bounds = ""
							places_bounds_ne = ""
							places_bounds_sw = ""
							trace d
							if d.status is "OVER_QUERY_LIMIT"
								trace "OVER_QUERY_LIMIT"
								if has_location
									map.panTo location
									map.setZoom zoom    if has_zoom
								else
									trace "DOING TRADITIONAL MAP IFRAME EMBED UNTIL QUERY LIMIT RESTORED"
									api_limit = true
									ExternalAPI.googlemaps.createiFrameMap m
							else
								if d.results.length >= 1
									places_bounds_ne = new google.maps.LatLng(parseFloat(d.results[0].geometry.viewport.northeast.lat), parseFloat(d.results[0].geometry.viewport.northeast.lng))
									places_bounds_sw = new google.maps.LatLng(parseFloat(d.results[0].geometry.viewport.southwest.lat), parseFloat(d.results[0].geometry.viewport.southwest.lng))
									places_bounds = new google.maps.LatLngBounds(places_bounds_sw, places_bounds_ne)
									map.fitBounds places_bounds
								else
									trace "NO RESULTS"
								map.panTo location    if has_location
								map.setZoom zoom    if has_zoom
							return
						).error((jqXHR, textStatus, errorThrown) ->
							trace "PLACES JSON ERROR"
							trace "PLACES JSON ERROR: " + textStatus + " " + jqXHR.responseText
							return
						).success (d) ->
							trace "PLACES JSON SUCCESS"
							return

					else
						if has_location
							map.panTo location
							map.setZoom zoom    if has_zoom
						else
							trace "DOING TRADITIONAL MAP IFRAME EMBED BECAUSE NO GOOGLE MAP API KEY WAS PROVIDED"
							ExternalAPI.googlemaps.createiFrameMap m
					return
				loadKML = ->
					kml_url = undefined
					kml_layer = undefined
					infowindow = undefined
					text = undefined
					kml_url = m.id + "&output=kml"
					kml_url = kml_url.replace("&output=embed", "")
					kml_layer = new google.maps.KmlLayer(kml_url,
						preserveViewport: true
					)
					infowindow = new google.maps.InfoWindow()
					kml_layer.setMap map
					google.maps.event.addListenerOnce kml_layer, "defaultviewport_changed", ->
						if has_location
							map.panTo location
						else
							map.fitBounds kml_layer.getDefaultViewport()
						map.setZoom zoom    if has_zoom
						return

					google.maps.event.addListener kml_layer, "click", (kmlEvent) ->
						showInfoWindow = (c) ->
							infowindow.setContent c
							infowindow.open map
							return
						text = kmlEvent.featureData.description
						showInfoWindow text
						return

					return
				map_attribution = ""
				layer = undefined
				map = undefined
				map_options = undefined
				unique_map_id = m.uid.toString() + "_gmap"
				map_attribution_html = ""
				location = new google.maps.LatLng(41.875696, -87.624207)
				latlong = undefined
				zoom = 11
				has_location = false
				has_zoom = false
				api_limit = false
				map_bounds = undefined
				google.maps.VeriteMapType = (name) ->
					if ExternalAPI.googlemaps.defaultType(name)
						google.maps.MapTypeId[name.toUpperCase()]
					else
						provider = mapProvider(name)
						google.maps.ImageMapType.call this,
							getTileUrl: (coord, zoom) ->
								index = (zoom + coord.x + coord.y) % ExternalAPI.googlemaps.map_subdomains.length
								retURL = provider.url.replace("{S}", ExternalAPI.googlemaps.map_subdomains[index]).replace("{Z}", zoom).replace("{X}", coord.x).replace("{Y}", coord.y).replace("{z}", zoom).replace("{x}", coord.x).replace("{y}", coord.y)
								retURL

							tileSize: new google.maps.Size(256, 256)
							name: name
							minZoom: provider.minZoom
							maxZoom: provider.maxZoom


				google.maps.VeriteMapType:: = new google.maps.ImageMapType("_")
				unless ExternalAPI.googlemaps.maptype is ""
					if ExternalAPI.googlemaps.defaultType(ExternalAPI.googlemaps.maptype)
						layer = google.maps.MapTypeId[ExternalAPI.googlemaps.maptype.toUpperCase()]
					else
						layer = ExternalAPI.googlemaps.maptype
				else
					layer = google.maps.MapTypeId["TERRAIN"]
				if type.of(util.getUrlVars(m.id)["ll"]) is "string"
					has_location = true
					latlong = util.getUrlVars(m.id)["ll"].split(",")
					location = new google.maps.LatLng(parseFloat(latlong[0]), parseFloat(latlong[1]))
				else if type.of(util.getUrlVars(m.id)["sll"]) is "string"
					latlong = util.getUrlVars(m.id)["sll"].split(",")
					location = new google.maps.LatLng(parseFloat(latlong[0]), parseFloat(latlong[1]))
				if type.of(util.getUrlVars(m.id)["z"]) is "string"
					has_zoom = true
					zoom = parseFloat(util.getUrlVars(m.id)["z"])
				map_options =
					zoom: zoom
					draggable: false
					disableDefaultUI: true
					mapTypeControl: false
					zoomControl: true
					zoomControlOptions:
						style: google.maps.ZoomControlStyle.SMALL
						position: google.maps.ControlPosition.TOP_RIGHT

					center: location
					mapTypeId: layer
					mapTypeControlOptions:
						mapTypeIds: [layer]

				library.attachElement "#" + m.uid, "<div class='google-map' id='" + unique_map_id + "' style='width=100%;height=100%;'></div>"
				map = new google.maps.Map(document.getElementById(unique_map_id), map_options)
				if ExternalAPI.googlemaps.defaultType(ExternalAPI.googlemaps.maptype)
					dontcrashjs2coffee = 0
				else
					map.mapTypes.set layer, new google.maps.VeriteMapType(layer)
					map_attribution_html = "<div class='map-attribution'><div class='attribution-text'>" + map_attribution + "</div></div>"
					library.appendElement "#" + unique_map_id, map_attribution_html
				if type.of(util.getUrlVars(m.id)["msid"]) is "string"
					loadKML()
				else
					geocodePlace()    if type.of(util.getUrlVars(m.id)["q"]) is "string"
				return

			pushQueue: ->
				i = 0

				while i < ExternalAPI.googlemaps.flags.queue.length
					ExternalAPI.googlemaps.create ExternalAPI.googlemaps.flags.queue[i]
					i++
				ExternalAPI.googlemaps.flags.queue = []
				return

			onMapAPIReady: ->
				ExternalAPI.googlemaps.flags.map_active = true
				ExternalAPI.googlemaps.flags.places_active = true
				ExternalAPI.googlemaps.onAPIReady()
				return

			onPlacesAPIReady: ->
				ExternalAPI.googlemaps.flags.places_active = true
				ExternalAPI.googlemaps.onAPIReady()
				return

			onAPIReady: ->
				unless ExternalAPI.googlemaps.flags.active
					if ExternalAPI.googlemaps.flags.map_active and ExternalAPI.googlemaps.flags.places_active
						ExternalAPI.googlemaps.flags.active = true
						ExternalAPI.googlemaps.pushQueue()
				return

			defaultType: (name) ->
				if name.toLowerCase() is "satellite" or name.toLowerCase() is "hybrid" or name.toLowerCase() is "terrain" or name.toLowerCase() is "roadmap"
					true
				else
					false

			map_subdomains: [
				""
				"a."
				"b."
				"c."
				"d."
			]
			map_attribution:
				stamen: "Map tiles by <a href='http://stamen.com'>Stamen Design</a>, under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a href='http://openstreetmap.org'>OpenStreetMap</a>, under <a href='http://creativecommons.org/licenses/by-sa/3.0'>CC BY SA</a>."
				apple: "Map data &copy; 2012    Apple, Imagery &copy; 2012 Apple"

			map_providers:
				toner:
					url: "//{S}tile.stamen.com/toner/{Z}/{X}/{Y}.png"
					minZoom: 0
					maxZoom: 20
					attribution: "stamen"

				"toner-lines":
					url: "//{S}tile.stamen.com/toner-lines/{Z}/{X}/{Y}.png"
					minZoom: 0
					maxZoom: 20
					attribution: "stamen"

				"toner-labels":
					url: "//{S}tile.stamen.com/toner-labels/{Z}/{X}/{Y}.png"
					minZoom: 0
					maxZoom: 20
					attribution: "stamen"

				sterrain:
					url: "//{S}tile.stamen.com/terrain/{Z}/{X}/{Y}.jpg"
					minZoom: 4
					maxZoom: 20
					attribution: "stamen"

				apple:
					url: "//gsp2.apple.com/tile?api=1&style=slideshow&layers=default&lang=en_US&z={z}&x={x}&y={y}&v=9"
					minZoom: 4
					maxZoom: 14
					attribution: "apple"

				watercolor:
					url: "//{S}tile.stamen.com/watercolor/{Z}/{X}/{Y}.jpg"
					minZoom: 3
					maxZoom: 16
					attribution: "stamen"

		googleplus:
			assetTest:(asset,media, d)->
				if d
					if d.match("plus.google")
						media.type = "googleplus"
						media.id = d.split("/posts/")[1]
						media.mediaType=ExternalAPI.googleplus
			
						#https://plus.google.com/u/0/112374836634096795698/posts/bRJSvCb5mUU
						#https://plus.google.com/107096716333816995401/posts/J5iMpEDHWNL
						if d.split("/posts/")[0].match("u/0/")
							media.user = d.split("u/0/")[1].split("/posts")[0]
						else
							media.user = d.split("google.com/")[1].split("/posts/")[0]
			thumbnail:(media, uid)->
				"<div class='thumbnail thumb-googleplus'></div>"
			createElement:(media,loading_message)->
				ExternalAPI.googleplus.get media
				mediaElem = "<div class='googleplus' id='googleplus_" + media.id + "'>" + loading_message + "</div>"
			isTextMedia:true

			get: (m) ->
				api_key = undefined
				gplus =
					user: m.user
					activity: m.id
					id: m.uid

				ExternalAPI.googleplus.flags.queue.push gplus
				ExternalAPI.googleplus.flags.active = true
				return

			create: (gplus, callback) ->
				mediaElem = ""
				api_key = ""
				g_activity = ""
				g_content = ""
				g_attachments = ""
				gperson_api_url = undefined
				gactivity_api_url = undefined
				googleplus_timeout = setTimeout(ExternalAPI.googleplus.errorTimeOut, masterConfig.timers.api, gplus)
				callback_timeout = setTimeout(callback, masterConfig.timers.api, gplus)

				unless masterConfig.Timeline.api_keys.google is ""
					api_key = masterConfig.Timeline.api_keys.google
				else
					api_key = Aes.Ctr.decrypt(masterConfig.api_keys_master.google, masterConfig.vp, 256)
				gperson_api_url = "https://www.googleapis.com/plus/v1/people/" + gplus.user + "/activities/public?alt=json&maxResults=100&fields=items(id,url)&key=" + api_key
				mediaElem = "GOOGLE PLUS API CALL"
				library.getJSON(gperson_api_url, (p_data) ->
					i = 0

					while i < p_data.items.length
						trace "loop"
						if p_data.items[i].url.split("posts/")[1] is gplus.activity
							trace "FOUND IT!!"
							g_activity = p_data.items[i].id
							gactivity_api_url = "https://www.googleapis.com/plus/v1/activities/" + g_activity + "?alt=json&key=" + api_key
							library.getJSON gactivity_api_url, (a_data) ->
								trace a_data
								unless typeof a_data.annotation is "undefined"
									g_content += "<div class='googleplus-annotation'>'" + a_data.annotation + "</div>"
									g_content += a_data.object.content
								else
									g_content += a_data.object.content
								unless typeof a_data.object.attachments is "undefined"
									k = 0

									while k < a_data.object.attachments.length
										if a_data.object.attachments[k].objectType is "photo"
											g_attachments = "<a href='" + a_data.object.url + "' target='_blank'>" + "<img src='" + a_data.object.attachments[k].image.url + "' class='article-thumb'></a>" + g_attachments
										else if a_data.object.attachments[k].objectType is "video"
											g_attachments = "<img src='" + a_data.object.attachments[k].image.url + "' class='article-thumb'>" + g_attachments
											g_attachments += "<div>"
											g_attachments += "<a href='" + a_data.object.attachments[k].url + "' target='_blank'>"
											g_attachments += "<h5>" + a_data.object.attachments[k].displayName + "</h5>"
											g_attachments += "</a>"
											g_attachments += "</div>"
										else if a_data.object.attachments[k].objectType is "article"
											g_attachments += "<div>"
											g_attachments += "<a href='" + a_data.object.attachments[k].url + "' target='_blank'>"
											g_attachments += "<h5>" + a_data.object.attachments[k].displayName + "</h5>"
											g_attachments += "<p>" + a_data.object.attachments[k].content + "</p>"
											g_attachments += "</a>"
											g_attachments += "</div>"
										trace a_data.object.attachments[k]
										k++
									g_attachments = "<div class='googleplus-attachments'>" + g_attachments + "</div>"
								mediaElem = "<div class='googleplus-content'>" + g_content + g_attachments + "</div>"
								mediaElem += "<div class='vcard author'><a class='screen-name url' href='" + a_data.url + "' target='_blank'>"
								mediaElem += "<span class='avatar'><img src='" + a_data.actor.image.url + "' style='max-width: 32px; max-height: 32px;'></span>"
								mediaElem += "<span class='fn'>" + a_data.actor.displayName + "</span>"
								mediaElem += "<span class='nickname'><span class='thumbnail-inline'></span></span>"
								mediaElem += "</a></div>"
								library.attachElement "#googleplus_" + gplus.activity, mediaElem
								return

							break
						i++
					return
				).error((jqXHR, textStatus, errorThrown) ->
					error_obj = library.parseJSON(jqXHR.responseText)
					trace error_obj.error.message
					library.attachElement "#googleplus_" + gplus.activity, library.loadingmessage("<p>ERROR LOADING GOOGLE+ </p><p>" + error_obj.error.message + "</p>")
					return
				).success (d) ->
					clearTimeout googleplus_timeout
					clearTimeout callback_timeout
					callback()
					return

				return

			pushQueue: ->
				if ExternalAPI.googleplus.flags.queue.length > 0
					ExternalAPI.googleplus.create ExternalAPI.googleplus.flags.queue[0], ExternalAPI.googleplus.pushQueue
					util.removeRange ExternalAPI.googleplus.flags.queue, 0
				return

			errorTimeOut: (gplus) ->
				trace "GOOGLE+ JSON ERROR TIMEOUT " + gplus.activity
				library.attachElement "#googleplus_" + gplus.activity, library.loadingmessage("<p>Still waiting on GOOGLE+ </p><p>" + gplus.activity + "</p>")
				return

		googledocs:
			assetTest:(asset,media, d)->
				if d
					if fileExtension.googleDocType(d)
						$.extend media,
							type: "googledoc"
							id: d
							mediaType:ExternalAPI.googledocs
			thumbnail:(media, uid)->
				"<div class='thumbnail thumb-document'></div>"
			createElement:(media,loading_message)->
				ExternalAPI.googledocs.get media
				mediaElem = "<div class='media-frame media-shadow doc' id='" + media.uid + "'>" + loading_message + "</div>"
			get: (m) ->
				ExternalAPI.googledocs.flags.queue.push m
				ExternalAPI.googledocs.flags.active = true
				return

			create: (m) ->
				mediaElem = ""
				if m.id.match(/docs.google.com/i)
					mediaElem = "<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + m.id + "&amp;embedded=true'></iframe>"
				else
					mediaElem = "<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + "//docs.google.com/viewer?url=" + m.id + "&amp;embedded=true'></iframe>"
				library.attachElement "#" + m.uid, mediaElem
				return

			pushQueue: ->
				i = 0

				while i < ExternalAPI.googledocs.flags.queue.length
					ExternalAPI.googledocs.create ExternalAPI.googledocs.flags.queue[i]
					i++
				ExternalAPI.googledocs.flags.queue = []
				return

		flickr:
			assetTest:(asset,media, d)->
				if d
					if d.match("flickr.com/photos/")
						media.type = "flickr"
						media.id = ExternalAPI.flickr.getFlickrIdFromUrl(d)
						media.link = d
						media.mediaType=ExternalAPI.flickr
						if Boolean(media.id)
							media
						else
							false
			thumbnail:(media, uid)->
				"<div class='thumbnail thumb-photo' id='" + uid + "_thumb'></div>"
			createElement:(media,loading_message)->
				ExternalAPI.flickr.get media
				mediaElem = "<div class='media-image media-shadow'><a href='" + media.link + "' target='_blank'><img id='" + media.uid + "'></a></div>"
			get: (m) ->
				ExternalAPI.flickr.flags.queue.push m
				ExternalAPI.flickr.flags.active = true
				return

			create: (m, callback) ->
				api_key = undefined
				callback_timeout = setTimeout(callback, masterConfig.timers.api, m)
				if typeof masterConfig.Timeline isnt "undefined" and masterConfig.Timeline.api_keys.flickr isnt ""
					api_key = masterConfig.Timeline.api_keys.flickr
				else
					api_key = Aes.Ctr.decrypt(masterConfig.api_keys_master.flickr, masterConfig.vp, 256)
				the_url = "//api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + api_key + "&photo_id=" + m.id + "&format=json&jsoncallback=?"
				library.getJSON(the_url, (d) ->
					flickr_id = ExternalAPI.flickr.getFlickrIdFromUrl(d.sizes.size[0].url)
					flickr_large_id = "#" + m.uid
					flickr_thumb_id = "#" + m.uid + "_thumb"
					flickr_img_size = undefined
					flickr_img_thumb = undefined
					flickr_size_found = false
					flickr_best_size = "Large"
					flickr_best_size = ExternalAPI.flickr.sizes(masterConfig.sizes.api.height)
					i = 0

					while i < d.sizes.size.length
						if d.sizes.size[i].label is flickr_best_size
							flickr_size_found = true
							flickr_img_size = d.sizes.size[i].source
						i++
					flickr_img_size = d.sizes.size[d.sizes.size.length - 2].source    unless flickr_size_found
					flickr_img_thumb = d.sizes.size[0].source
					library.attr flickr_large_id, "src", flickr_img_size
					library.attachElement flickr_thumb_id, "<img src='" + flickr_img_thumb + "'>"
					return
				).error((jqXHR, textStatus, errorThrown) ->
					trace "FLICKR error"
					trace "FLICKR ERROR: " + textStatus + " " + jqXHR.responseText
					return
				).success (d) ->
					clearTimeout callback_timeout
					callback()
					return

				return

			pushQueue: ->
				if ExternalAPI.flickr.flags.queue.length > 0
					ExternalAPI.flickr.create ExternalAPI.flickr.flags.queue[0], ExternalAPI.flickr.pushQueue
					util.removeRange ExternalAPI.flickr.flags.queue, 0
				return

			sizes: (s) ->
				_size = ""
				if s <= 75
					_size = "Thumbnail"
				else if s <= 180
					_size = "Small"
				else if s <= 240
					_size = "Small 320"
				else if s <= 375
					_size = "Medium"
				else if s <= 480
					_size = "Medium 640"
				else if s <= 600
					_size = "Large"
				else
					_size = "Large"
				_size

			getFlickrIdFromUrl: (url) ->
				idx = url.indexOf("flickr.com/photos/")
				return null    if idx is -1
				pos = idx + "flickr.com/photos/".length
				photo_info = url.substr(pos)
				return null    if photo_info.indexOf("/") is -1
				photo_info = photo_info.substr(1)    if photo_info.indexOf("/") is 0
				photo_info.split("/")[1]

		instagram:
			assetTest:(asset,media, d)->
				if d
					if ExternalAPI.instagram.isInstagramUrl(d)
						media.type = "instagram"
						media.link = d
						media.id = ExternalAPI.instagram.getInstagramIdFromUrl(d)
						media.mediaType=ExternalAPI.instagram
						if Boolean(media.id)
							media
						else 
							false
			thumbnail:(media, uid)->
				"<div class='thumbnail thumb-instagram' id='" + uid + "_thumb'><img src='" + ExternalAPI.instagram.get(media, true) + "'></div>"
			createElement:(media,loading_message)->
				"<div class='media-image media-shadow'><a href='" + media.link + "' target='_blank'><img src='" + ExternalAPI.instagram.get(media) + "'></a></div>"
			get: (m, thumb) ->
				if thumb
					"//instagr.am/p/" + m.id + "/media/?size=t"
				else
					"//instagr.am/p/" + m.id + "/media/?size=" + ExternalAPI.instagram.sizes(masterConfig.sizes.api.height)

			sizes: (s) ->
				_size = ""
				if s <= 150
					_size = "t"
				else if s <= 306
					_size = "m"
				else
					_size = "l"
				_size

			isInstagramUrl: (url) ->
				url.match("instagr.am/p/") or url.match("instagram.com/p/")

			getInstagramIdFromUrl: (url) ->
				try
					return url.split("/p/")[1].split("/")[0]
				catch e
					trace "Invalid Instagram url: " + url
					return null
				return

		soundcloud:
			get: (m) ->
				ExternalAPI.soundcloud.flags.queue.push m
				ExternalAPI.soundcloud.flags.active = true
				return

			create: (m, callback) ->
				the_url = "//soundcloud.com/oembed?url=" + m.id + "&format=js&callback=?"
				library.getJSON the_url, (d) ->
					library.attachElement "#" + m.uid, d.html
					callback()
					return

				return

			pushQueue: ->
				if ExternalAPI.soundcloud.flags.queue.length > 0
					ExternalAPI.soundcloud.create ExternalAPI.soundcloud.flags.queue[0], ExternalAPI.soundcloud.pushQueue
					util.removeRange ExternalAPI.soundcloud.flags.queue, 0
				return
			assetTest:(asset,media, d)->
				if d
					if d.match("(player.)?soundcloud.com")
						id:d
						type:"soundcloud"
						mediaType:ExternalAPI.soundcloud
			thumbnail:(media, uid)->
				"<div class='thumbnail thumb-audio'></div>"
			createElement:(media,loading_message)->
				ExternalAPI.soundcloud.get media
				mediaElem = "<div class='media-frame media-shadow soundcloud' id='" + media.uid + "'>" + loading_message + "</div>"

		wikipedia:
			assetTest:(asset,media, d)->
				if d
					if d.match("(www.)?wikipedia.org")
						media.type = "wikipedia"
			
						#media.id = d.split("wiki\/")[1];
						wiki_id = d.split("wiki/")[1].split("#")[0].replace("_", " ")
						media.id = wiki_id.replace(" ", "%20")
						media.lang = d.split("//")[1].split(".wikipedia")[0]
						media.mediaType = ExternalAPI.wikipedia
						media
			thumbnail:(media, uid)->
				"<div class='thumbnail thumb-wikipedia'></div>"
			createElement:(media,loading_message)->	
				ExternalAPI.wikipedia.get media
				mediaElem = "<div class='wikipedia' id='" + media.uid + "'>" + loading_message + "</div>"
			isTextMedia:true

			get: (m) ->
				ExternalAPI.wikipedia.flags.queue.push m
				ExternalAPI.wikipedia.flags.active = true
				return

			create: (m, callback) ->
				the_url = "//" + m.lang + ".wikipedia.org/w/api.php?action=query&prop=extracts&redirects=&titles=" + m.id + "&exintro=1&format=json&callback=?"
				callback_timeout = setTimeout(callback, masterConfig.timers.api, m)
				if browser.browser is "Explorer" and parseInt(browser.version, 10) >= 7 and window.XDomainRequest
					temp_text = "<h4><a href='http://" + masterConfig.language.api.wikipedia + ".wikipedia.org/wiki/" + m.id + "' target='_blank'>" + m.url + "</a></h4>"
					temp_text += "<span class='wiki-source'>" + masterConfig.language.messages.wikipedia + "</span>"
					temp_text += "<p>Wikipedia entry unable to load using Internet Explorer 8 or below.</p>"
					library.attachElement "#" + m.uid, temp_text
				library.getJSON(the_url, (d) ->
					if d.query
						wiki_extract = undefined
						wiki_title = undefined
						_wiki = ""
						wiki_text = ""
						wiki_number_of_paragraphs = 1
						wiki_text_array = []
						wiki_extract = util.getObjectAttributeByIndex(d.query.pages, 0).extract
						wiki_title = util.getObjectAttributeByIndex(d.query.pages, 0).title
						if wiki_extract.match("<p>")
							wiki_text_array = wiki_extract.split("<p>")
						else
							wiki_text_array.push wiki_extract
						i = 0

						while i < wiki_text_array.length
							wiki_text += "<p>" + wiki_text_array[i + 1]    if i + 1 <= wiki_number_of_paragraphs and i + 1 < wiki_text_array.length
							i++
						_wiki = "<h4><a href='http://" + masterConfig.language.api.wikipedia + ".wikipedia.org/wiki/" + wiki_title + "' target='_blank'>" + wiki_title + "</a></h4>"
						_wiki += "<span class='wiki-source'>" + masterConfig.language.messages.wikipedia + "</span>"
						_wiki += util.linkify_wikipedia(wiki_text)
						if wiki_extract.match("REDIRECT")
							don = undefined
							tcrashjs2coffee = 0
						else
							library.attachElement "#" + m.uid, _wiki
					return
				).error((jqXHR, textStatus, errorThrown) ->
					trace "WIKIPEDIA error"
					trace "WIKIPEDIA ERROR: " + textStatus + " " + jqXHR.responseText
					trace errorThrown
					library.attachElement "#" + m.uid, library.loadingmessage("<p>Wikipedia is not responding</p>")
					clearTimeout callback_timeout
					ExternalAPI.wikipedia.flags.tries or=0
					if ExternalAPI.wikipedia.flags.tries < 4
						trace "WIKIPEDIA ATTEMPT " + ExternalAPI.wikipedia.flags.tries
						trace m
						ExternalAPI.wikipedia.flags.tries++
						ExternalAPI.wikipedia.create m, callback
					else
						callback()
					return
				).success (d) ->
					ExternalAPI.wikipedia.flags.tries = 0
					clearTimeout callback_timeout
					callback()
					return

				return

			pushQueue: ->
				if ExternalAPI.wikipedia.flags.queue.length > 0
					trace "WIKIPEDIA PUSH QUE " + ExternalAPI.wikipedia.flags.queue.length
					ExternalAPI.wikipedia.create ExternalAPI.wikipedia.flags.queue[0], ExternalAPI.wikipedia.pushQueue
					util.removeRange ExternalAPI.wikipedia.flags.queue, 0
				return

		youtube:
			get: (m) ->
				the_url = "//gdata.youtube.com/feeds/api/videos/" + m.id + "?v=2&alt=jsonc&callback=?"
				ExternalAPI.youtube.flags.queue.push m
				unless ExternalAPI.youtube.flags.active
					unless ExternalAPI.youtube.flags.api_loaded
						LoadLib.js "//www.youtube.com/player_api", ->
							trace "YouTube API Library Loaded"
							return

				library.getJSON the_url, (d) ->
					ExternalAPI.youtube.createThumb d, m
					return

				return

			create: (m) ->
				unless typeof (m.start) is "undefined"
					vidstart = m.start.toString()
					vid_start_minutes = 0
					vid_start_seconds = 0
					if vidstart.match("m")
						vid_start_minutes = parseInt(vidstart.split("m")[0], 10)
						vid_start_seconds = parseInt(vidstart.split("m")[1].split("s")[0], 10)
						m.start = (vid_start_minutes * 60) + vid_start_seconds
					else
						m.start = 0
				else
					m.start = 0
				p =
					active: false
					player: {}
					name: m.uid
					playing: false
					hd: false

				p.hd = true    unless typeof (m.hd) is "undefined"
				p.player[m.id] = new YT.Player(m.uid,
					height: "390"
					width: "640"
					playerVars:
						enablejsapi: 1
						color: "white"
						showinfo: 0
						theme: "light"
						start: m.start
						rel: 0

					videoId: m.id
					events:
						onReady: ExternalAPI.youtube.onPlayerReady
						onStateChange: ExternalAPI.youtube.onStateChange
				)
				ExternalAPI.youtube.flags.array.push p
				return

			createThumb: (d, m) ->
				trace "CREATE THUMB"
				trace d
				trace m
				unless typeof d.data is "undefined"
					thumb_id = "#" + m.uid + "_thumb"
					library.attachElement thumb_id, "<img src='" + d.data.thumbnail.sqDefault + "'>"
				return

			pushQueue: ->
				i = 0

				while i < ExternalAPI.youtube.flags.queue.length
					ExternalAPI.youtube.create ExternalAPI.youtube.flags.queue[i]
					i++
				ExternalAPI.youtube.flags.queue = []
				return

			onAPIReady: ->
				ExternalAPI.youtube.flags.active = true
				ExternalAPI.youtube.pushQueue()
				return

			stopPlayers: ->
				i = 0

				while i < ExternalAPI.youtube.flags.array.length
					if ExternalAPI.youtube.flags.array[i].playing
						ExternalAPI.youtube.flags.array[i].player[Object.keys(ExternalAPI.youtube.flags.array[i].player)[0]].stopVideo()
					i++
				return

			onStateChange: (e) ->
				i = 0

				while i < ExternalAPI.youtube.flags.array.length
					if ExternalAPI.youtube.flags.array[i].player[Object.keys(ExternalAPI.youtube.flags.array[i].player)[0]] is e.target
						if e.data is YT.PlayerState.PLAYING
							ExternalAPI.youtube.flags.array[i].playing = true
							trace ExternalAPI.youtube.flags.array[i].hd
							dontcrashjs2coffee = 0    if ExternalAPI.youtube.flags.array[i].hd
					i++
				return

			onPlayerReady: (e) ->
			assetTest:(asset,media, d)->
				if d
					if d.match("(www.)?youtube|youtu.be")
						if d.match("v=")
							media.id = util.getUrlVars(d)["v"]
						else if d.match("/embed/")
							media.id = d.split("embed/")[1].split(/[?&]/)[0]
						else if d.match(/v\/|v=|youtu\.be\//)
							media.id = d.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0]
						else
							trace "YOUTUBE IN URL BUT NOT A VALID VIDEO"
						$.extend media,
							start:util.getUrlVars(d)["t"]
							hd:util.getUrlVars(d)["hd"]
							mediaType:ExternalAPI.youtube
							type:"youtube"
			thumbnail:(media, uid)->
				"<div class='thumbnail thumb-youtube' id='" + uid + "_thumb'></div>"
			createElement:(media,loading_message)->
				ExternalAPI.youtube.get media
				mediaElem = "<div class='media-shadow'><div class='media-frame video youtube' id='" + media.uid + "'>" + loading_message + "</div></div>"

		vimeo:
			get: (m) ->
				ExternalAPI.vimeo.flags.queue.push m
				ExternalAPI.vimeo.flags.active = true
				return

			create: (m, callback) ->
				trace "VIMEO CREATE"
				thumb_url = "//vimeo.com/api/v2/video/" + m.id + ".json"
				video_url = "//player.vimeo.com/video/" + m.id + "?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff"
				library.getJSON thumb_url, (d) ->
					ExternalAPI.vimeo.createThumb d, m
					callback()
					return

				library.attachElement "#" + m.uid, "<iframe autostart='false' frameborder='0' width='100%' height='100%' src='" + video_url + "'></iframe>"
				return

			createThumb: (d, m) ->
				trace "VIMEO CREATE THUMB"
				thumb_id = "#" + m.uid + "_thumb"
				library.attachElement thumb_id, "<img src='" + d[0].thumbnail_small + "'>"
				return

			pushQueue: ->
				if ExternalAPI.vimeo.flags.queue.length > 0
					ExternalAPI.vimeo.create ExternalAPI.vimeo.flags.queue[0], ExternalAPI.vimeo.pushQueue
					util.removeRange ExternalAPI.vimeo.flags.queue, 0
				return
			assetTest:(asset,media, d)->
				if d
					if d.match("(player.)?vimeo.com")
						id:d.split(/video\/|\/\/vimeo\.com\//)[1].split(/[?&]/)[0]
						mediaType:ExternalAPI.vimeo
						type:"vimeo"
			thumbnail:(media, uid)->
				"<div class='thumbnail thumb-vimeo' id='" + uid + "_thumb'></div>"
			createElement:(media,loading_message)->
				ExternalAPI.vimeo.get media
				mediaElem = "<div class='media-shadow media-frame video vimeo' id='" + media.uid + "'>" + loading_message + "</div>"

		vine:
			get: (m) ->
				ExternalAPI.vine.flags.queue.push m
				ExternalAPI.vine.flags.active = true
				return

			create: (m, callback) ->
				trace "VINE CREATE"
				video_url = "https://vine.co/v/" + m.id + "/embed/simple"
				library.attachElement "#" + m.uid, "<iframe frameborder='0' width='100%' height='100%' src='" + video_url + "'></iframe><script async src='http://platform.vine.co/static/scripts/embed.js' charset='utf-8'></script>"
				return

			pushQueue: ->
				if ExternalAPI.vine.flags.queue.length > 0
					ExternalAPI.vine.create ExternalAPI.vine.flags.queue[0], ExternalAPI.vine.pushQueue
					util.removeRange ExternalAPI.vine.flags.queue, 0
				return
			assetTest:(asset,media, d)->
				if d
					if d.match("(www.)?vine.co")
						trace "VINE"
						#https://vine.co/v/b55LOA1dgJU
						if d.match("vine.co/v/")
							trace d.split("vine.co/v/")[1]
							id:d.split("vine.co/v/")[1]
							type:"vine"
							mediaType:ExternalAPI.vine
						else
							type:"vine"
							mediaType:ExternalAPI.vine
			thumbnail:(media, uid)->
				"<div class='thumbnail thumb-vine'></div>"
			createElement:(media,loading_message)->
				ExternalAPI.vine.get media
				mediaElem = "<div class='media-shadow media-frame video vine' id='" + media.uid + "'>" + loading_message + "</div>"
		dailymotion:
			assetTest:(asset,media, d)->
				if d
					if d.match("(www.)?dailymotion.com")
						id:d.split(/video\/|\/\/dailymotion\.com\//)[1]
						mediaType:ExternalAPI.dailymotion
						type:"dailymotion"
			thumbnail:(media, uid)->
				"<div class='thumbnail thumb-video'></div>"
			createElement:(media,loading_message)->
				"<div class='media-shadow'><iframe class='media-frame video dailymotion' autostart='false' frameborder='0' width='100%' height='100%' src='http://www.dailymotion.com/embed/video/" + media.id + "'></iframe></div>"
		image:
			assetTest:(asset,media, d)->
				if d
					if d.match(/jpg|jpeg|png|gif/i) or d.match("staticmap") or d.match("yfrog.com") or d.match("twitpic.com")
						$.extend media,
							type: "image"
							id: d
							mediaType:ExternalAPI.image
			thumbnail:(media, uid)->
				"<div class='thumbnail thumb-photo'></div>"
			createElement:(media,loading_message)->
				media.id = media.id.replace("https://", "http://")    if media.id.match("https://")
				"<div class='media-image media-shadow'><img src='" + media.id + "' class='media-image'></div>"
		storify:
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
		blockquote:
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
		iframe:
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
		unknown:
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
		website:
			assetTest:(asset,media, d)->
				if d
					if d.indexOf("http://") is 0
						media.type = "website"
						media.id = d
						media.mediaType = ExternalAPI.website
						media
			thumbnail:(media, uid)->
				"<div class='thumbnail thumb-website' id='" + uid + "_thumb'></div>"
			createElement:(media,loading_message)->
				ExternalAPI.website.get media
				mediaElem = "<div class='media-shadow website' id='" + media.uid + "'>" + loading_message + "</div>"
			get: (m, thumb) ->
				ExternalAPI.website.flags.queue.push m
				ExternalAPI.website.flags.active = true
				return

			sizes: (s) ->
				_size = ""
				if s <= 150
					_size = "t"
				else if s <= 306
					_size = "m"
				else
					_size = "l"
				_size

			create: (m) ->
				trace "WEB THUMB CREATE"
				thumb_url = "//api.pagepeeker.com/v2/thumbs.php?"
				url = m.id.replace("http://", "")
				library.attachElement "#" + m.uid, "<a href='" + m.id + "' target='_blank'><img src='" + thumb_url + "size=x&url=" + url + "'></a>"
				library.attachElement "#" + m.uid + "_thumb", "<img src='" + thumb_url + "size=t&url=" + url + "'>"
				return

			pushQueue: ->
				i = 0

				while i < ExternalAPI.website.flags.queue.length
					ExternalAPI.website.create ExternalAPI.website.flags.queue[i]
					i++
				ExternalAPI.website.flags.queue = []
				return