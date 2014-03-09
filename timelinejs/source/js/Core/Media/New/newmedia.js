function onYouTubePlayerAPIReady() {
	trace("GLOBAL YOUTUBE API CALLED");
	VMM.ExternalAPI.youtube.onAPIReady();
};

(function () {
	

	if (typeof VMM !== "undefined" && typeof VMM.ExternalAPI === "undefined") {
		VMM.ExternalAPI = {
			keys: {
				google: "",
				flickr: "",
				twitter: ""
			},
			keys_master: {
				vp: "Pellentesque nibh felis, eleifend id, commodo in, interdum vitae, leo",
				flickr: "RAIvxHY4hE/Elm5cieh4X5ptMyDpj7MYIxziGxi0WGCcy1s+yr7rKQ==",
				google: "jwNGnYw4hE9lmAez4ll0QD+jo6SKBJFknkopLS4FrSAuGfIwyj57AusuR0s8dAo=",
				twitter: ""
			},
			init: function () {
				return this;
			},
			setKeys: function (d) {
				VMM.ExternalAPI.keys = d;
			},
			pushQues: function () {
				if (VMM.master_config.googlemaps.active) {
					VMM.ExternalAPI.googlemaps.pushQue();
				}
				if (VMM.master_config.youtube.active) {
					VMM.ExternalAPI.youtube.pushQue();
				}
				if (VMM.master_config.soundcloud.active) {
					VMM.ExternalAPI.soundcloud.pushQue();
				}
				if (VMM.master_config.googledocs.active) {
					VMM.ExternalAPI.googledocs.pushQue();
				}
				if (VMM.master_config.googleplus.active) {
					VMM.ExternalAPI.googleplus.pushQue();
				}
				if (VMM.master_config.wikipedia.active) {
					VMM.ExternalAPI.wikipedia.pushQue();
				}
				if (VMM.master_config.vimeo.active) {
					VMM.ExternalAPI.vimeo.pushQue();
				}
				if (VMM.master_config.vine.active) {
					VMM.ExternalAPI.vine.pushQue();
				}
				if (VMM.master_config.twitter.active) {
					VMM.ExternalAPI.twitter.pushQue();
				}
				if (VMM.master_config.flickr.active) {
					VMM.ExternalAPI.flickr.pushQue();
				}
				if (VMM.master_config.webthumb.active) {
					VMM.ExternalAPI.webthumb.pushQue();
				}
			},
			twitter: {
				tweetArray: [],
				get: function (m) {
					var tweet;

					tweet = {
						mid: m.id,
						id: m.uid
					};
					VMM.master_config.twitter.que.push(tweet);
					VMM.master_config.twitter.active = true;
				},
				create: function (tweet, callback) {
					var error_obj, id, the_url;

					id = tweet.mid.toString();
					error_obj = {
						twitterid: tweet.mid
					};
					the_url = "//api.twitter.com/1/statuses/show.json?id=" + tweet.mid + "&include_entities=true&callback=?";
					VMM.ExternalAPI.twitter.getOEmbed(tweet, callback);
				},
				errorTimeOut: function (tweet) {
					trace("TWITTER JSON ERROR TIMEOUT " + tweet.mid);
					VMM.attachElement("#" + tweet.id.toString(), VMM.MediaElement.loadingmessage("Still waiting on Twitter: " + tweet.mid));
					VMM.getJSON("//api.twitter.com/1/account/rate_limit_status.json", function (d) {
						var mes;

						trace("REMAINING TWITTER API CALLS " + d.remaining_hits);
						trace("TWITTER RATE LIMIT WILL RESET AT " + d.reset_time);
						mes = "";
						if (d.remaining_hits === 0) {
							mes = "<p>You've reached the maximum number of tweets you can load in an hour.</p>";
							mes += "<p>You can view tweets again starting at: <br/>" + d.reset_time + "</p>";
						} else {
							mes = "<p>Still waiting on Twitter. " + tweet.mid + "</p>";
						}
						VMM.attachElement("#" + tweet.id.toString(), VMM.MediaElement.loadingmessage(mes));
					});
				},
				errorTimeOutOembed: function (tweet) {
					trace("TWITTER JSON ERROR TIMEOUT " + tweet.mid);
					VMM.attachElement("#" + tweet.id.toString(), VMM.MediaElement.loadingmessage("Still waiting on Twitter: " + tweet.mid));
				},
				pushQue: function () {
					if (VMM.master_config.twitter.que.length > 0) {
						VMM.ExternalAPI.twitter.create(VMM.master_config.twitter.que[0], VMM.ExternalAPI.twitter.pushQue);
						VMM.Util.removeRange(VMM.master_config.twitter.que, 0);
					}
				},
				getOEmbed: function (tweet, callback) {
					var the_url, twitter_timeout;

					the_url = "//api.twitter.com/1/statuses/oembed.json?id=" + tweet.mid + "&omit_script=true&include_entities=true&callback=?";
					twitter_timeout = setTimeout(VMM.ExternalAPI.twitter.errorTimeOutOembed, VMM.master_config.timers.api, tweet);
					VMM.getJSON(the_url, function (d) {
						var tuser, twit;

						twit = "";
						tuser = "";
						twit += d.html.split("</p>&mdash;")[0] + "</p></blockquote>";
						tuser = d.author_url.split("twitter.com/")[1];
						twit += "<div class='vcard author'>";
						twit += "<a class='screen-name url' href='" + d.author_url + "' target='_blank'>";
						twit += "<span class='avatar'></span>";
						twit += "<span class='fn'>" + d.author_name + "</span>";
						twit += "<span class='nickname'>@" + tuser + "<span class='thumbnail-inline'></span></span>";
						twit += "</a>";
						twit += "</div>";
						VMM.attachElement("#" + tweet.id.toString(), twit);
						VMM.attachElement("#text_thumb_" + tweet.id.toString(), d.html);
						VMM.attachElement("#marker_content_" + tweet.id.toString(), d.html);
					}).error(function (jqXHR, textStatus, errorThrown) {
						trace("TWITTER error");
						trace("TWITTER ERROR: " + textStatus + " " + jqXHR.responseText);
						clearTimeout(twitter_timeout);
						VMM.attachElement("#" + tweet.id, VMM.MediaElement.loadingmessage("ERROR LOADING TWEET " + tweet.mid));
					}).success(function (d) {
						clearTimeout(twitter_timeout);
						callback();
					});
				},
				getHTML: function (id) {
					var the_url;

					the_url = "//api.twitter.com/1/statuses/oembed.json?id=" + id + "&omit_script=true&include_entities=true&callback=?";
					VMM.getJSON(the_url, VMM.ExternalAPI.twitter.onJSONLoaded);
				},
				onJSONLoaded: function (d) {
					var id;

					trace("TWITTER JSON LOADED");
					id = d.id;
					VMM.attachElement("#" + id, VMM.Util.linkify_with_twitter(d.html));
				},
				parseTwitterDate: function (d) {
					var date;

					date = new Date(Date.parse(d));
					return date;
				},
				prettyParseTwitterDate: function (d) {
					var date;

					date = new Date(Date.parse(d));
					return VMM.Date.prettyDate(date, true);
				},
				getTweets: function (tweets) {
					var i, number_of_tweets, the_url, tweetArray, twitter_id;

					tweetArray = [];
					number_of_tweets = tweets.length;
					i = 0;
					while (i < tweets.length) {
						twitter_id = "";
						if (tweets[i].tweet.match("status/")) {
							twitter_id = tweets[i].tweet.split("status/")[1];
						} else if (tweets[i].tweet.match("statuses/")) {
							twitter_id = tweets[i].tweet.split("statuses/")[1];
						} else {
							twitter_id = "";
						}
						the_url = "//api.twitter.com/1/statuses/show.json?id=" + twitter_id + "&include_entities=true&callback=?";
						VMM.getJSON(the_url, function (d) {
							var td, the_tweets, tweet, twit;

							tweet = {};
							twit = "<div class='twitter'><blockquote><p>";
							td = VMM.Util.linkify_with_twitter(d.text, "_blank");
							twit += td;
							twit += "</p>";
							twit += "— " + d.user.name + " (<a href='https://twitter.com/" + d.user.screen_name + "'>@" + d.user.screen_name + "</a>) <a href='https://twitter.com/" + d.user.screen_name + "/status/" + d.id + "'>" + VMM.ExternalAPI.twitter.prettyParseTwitterDate(d.created_at) + " </a></blockquote></div>";
							tweet.content = twit;
							tweet.raw = d;
							tweetArray.push(tweet);
							if (tweetArray.length === number_of_tweets) {
								the_tweets = {
									tweetdata: tweetArray
								};
								VMM.fireEvent(global, "TWEETSLOADED", the_tweets);
							}
						}).success(function () {
							trace("second success");
						}).error(function () {
							trace("error");
						}).complete(function () {
							trace("complete");
						});
						i++;
					}
				},
				getTweetSearch: function (tweets, number_of_tweets) {
					var the_url, tweetArray, _number_of_tweets;

					_number_of_tweets = 40;
					if ((number_of_tweets != null) && number_of_tweets !== "") {
						_number_of_tweets = number_of_tweets;
					}
					the_url = "//search.twitter.com/search.json?q=" + tweets + "&rpp=" + _number_of_tweets + "&include_entities=true&result_type=mixed";
					tweetArray = [];
					VMM.getJSON(the_url, function (d) {
						var i, td, the_tweets, tweet, twit;

						i = 0;
						while (i < d.results.length) {
							tweet = {};
							twit = "<div class='twitter'><blockquote><p>";
							td = VMM.Util.linkify_with_twitter(d.results[i].text, "_blank");
							twit += td;
							twit += "</p>";
							twit += "— " + d.results[i].from_user_name + " (<a href='https://twitter.com/" + d.results[i].from_user + "'>@" + d.results[i].from_user + "</a>) <a href='https://twitter.com/" + d.results[i].from_user + "/status/" + d.id + "'>" + VMM.ExternalAPI.twitter.prettyParseTwitterDate(d.results[i].created_at) + " </a></blockquote></div>";
							tweet.content = twit;
							tweet.raw = d.results[i];
							tweetArray.push(tweet);
							i++;
						}
						the_tweets = {
							tweetdata: tweetArray
						};
						VMM.fireEvent(global, "TWEETSLOADED", the_tweets);
					});
				},
				prettyHTML: function (id, secondary) {
					var error_obj, the_url, twitter_timeout;

					id = id.toString();
					error_obj = {
						twitterid: id
					};
					the_url = "//api.twitter.com/1/statuses/show.json?id=" + id + "&include_entities=true&callback=?";
					twitter_timeout = setTimeout(VMM.ExternalAPI.twitter.errorTimeOut, VMM.master_config.timers.api, id);
					VMM.getJSON(the_url, VMM.ExternalAPI.twitter.formatJSON).error(function (jqXHR, textStatus, errorThrown) {
						trace("TWITTER error");
						trace("TWITTER ERROR: " + textStatus + " " + jqXHR.responseText);
						VMM.attachElement("#twitter_" + id, "<p>ERROR LOADING TWEET " + id + "</p>");
					}).success(function (d) {
						clearTimeout(twitter_timeout);
						if (secondary) {
							VMM.ExternalAPI.twitter.secondaryMedia(d);
						}
					});
				},
				formatJSON: function (d) {
					var id, td, twit;

					id = d.id_str;
					twit = "<blockquote><p>";
					td = VMM.Util.linkify_with_twitter(d.text, "_blank");
					twit += td;
					twit += "</p></blockquote>";
					twit += "<div class='vcard author'>";
					twit += "<a class='screen-name url' href='https://twitter.com/" + d.user.screen_name + "' data-screen-name='" + d.user.screen_name + "' target='_blank'>";
					twit += "<span class='avatar'><img src=' " + d.user.profile_image_url + "'    alt=''></span>";
					twit += "<span class='fn'>" + d.user.name + "</span>";
					twit += "<span class='nickname'>@" + d.user.screen_name + "<span class='thumbnail-inline'></span></span>";
					twit += "</a>";
					twit += "</div>";
					if (typeof d.entities.media !== "undefined" ? d.entities.media[0].type === "photo" : void 0) {
						twit += "<img src=' " + d.entities.media[0].media_url + "'    alt=''>";
					}
					VMM.attachElement("#twitter_" + id.toString(), twit);
					VMM.attachElement("#text_thumb_" + id.toString(), d.text);
				}
			},
			googlemaps: {
				maptype: "TERRAIN",
				setMapType: function (d) {
					if (d !== "") {
						VMM.ExternalAPI.googlemaps.maptype = d;
					}
				},
				get: function (m) {
					var api_key, dontcrashjs2coffee, map_url, timer;

					timer = void 0;
					api_key = void 0;
					map_url = void 0;
					m.vars = VMM.Util.getUrlVars(m.id);
					if (VMM.ExternalAPI.keys.google !== "") {
						api_key = VMM.ExternalAPI.keys.google;
					} else {
						api_key = Aes.Ctr.decrypt(VMM.ExternalAPI.keys_master.google, VMM.ExternalAPI.keys_master.vp, 256);
					}
					map_url = "//maps.googleapis.com/maps/api/js?key=" + api_key + "&v=3.9&libraries=places&sensor=false&callback=VMM.ExternalAPI.googlemaps.onMapAPIReady";
					if (VMM.master_config.googlemaps.active) {
						VMM.master_config.googlemaps.que.push(m);
					} else {
						VMM.master_config.googlemaps.que.push(m);
						if (VMM.master_config.googlemaps.api_loaded) {
							dontcrashjs2coffee = 0;
						} else {
							LoadLib.js(map_url, function () {
								trace("Google Maps API Library Loaded");
							});
						}
					}
				},
				create: function (m) {
					VMM.ExternalAPI.googlemaps.createAPIMap(m);
				},
				createiFrameMap: function (m) {
					var embed_url, mc, unique_map_id;

					embed_url = m.id + "&output=embed";
					mc = "";
					unique_map_id = m.uid.toString() + "_gmap";
					mc += "<div class='google-map' id='" + unique_map_id + "' style='width=100%;height=100%;'>";
					mc += "<iframe width='100%' height='100%' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='" + embed_url + "'></iframe>";
					mc += "</div>";
					VMM.attachElement("#" + m.uid, mc);
				},
				createAPIMap: function (m) {
					var api_limit, dontcrashjs2coffee, geocodePlace, has_location, has_zoom, latlong, layer, loadKML, loadPlaces, loadPlacesAlt, location, map, mapProvider, map_attribution, map_attribution_html, map_bounds, map_options, unique_map_id, zoom;

					mapProvider = function (name) {
						var map_attribution;

						if (name in VMM.ExternalAPI.googlemaps.map_providers) {
							map_attribution = VMM.ExternalAPI.googlemaps.map_attribution[VMM.ExternalAPI.googlemaps.map_providers[name].attribution];
							VMM.ExternalAPI.googlemaps.map_providers[name];
						} else {
							if (VMM.ExternalAPI.googlemaps.defaultType(name)) {
								trace("GOOGLE MAP DEFAULT TYPE");
								google.maps.MapTypeId[name.toUpperCase()];
							} else {
								trace("Not a maptype: " + name);
							}
						}
					};
					geocodePlace = function () {
						var address, address_latlon, geocoder, has_location, location, marker;

						geocoder = new google.maps.Geocoder();
						address = VMM.Util.getUrlVars(m.id)["q"];
						marker = void 0;
						if (address.match("loc:")) {
							address_latlon = address.split(":")[1].split("+");
							location = new google.maps.LatLng(parseFloat(address_latlon[0]), parseFloat(address_latlon[1]));
							has_location = true;
						}
						geocoder.geocode({
							address: address
						}, function (results, status) {
							if (status === google.maps.GeocoderStatus.OK) {
								marker = new google.maps.Marker({
									map: map,
									position: results[0].geometry.location
								});
								if (typeof results[0].geometry.viewport !== "undefined") {
									map.fitBounds(results[0].geometry.viewport);
								} else if (typeof results[0].geometry.bounds !== "undefined") {
									map.fitBounds(results[0].geometry.bounds);
								} else {
									map.setCenter(results[0].geometry.location);
								}
								if (has_location) {
									map.panTo(location);
								}
								if (has_zoom) {
									map.setZoom(zoom);
								}
							} else {
								trace("Geocode for " + address + " was not successful for the following reason: " + status);
								trace("TRYING PLACES SEARCH");
								if (has_location) {
									map.panTo(location);
								}
								if (has_zoom) {
									map.setZoom(zoom);
								}
								loadPlaces();
							}
						});
					};
					loadPlaces = function () {
						var bounds_ne, bounds_sw, createMarker, infowindow, place, placeResults, place_search, search_bounds, search_request;

						placeResults = function (results, status) {
							var i;

							if (status === google.maps.places.PlacesServiceStatus.OK) {
								i = 0;
								while (i < results.length) {
									i++;
								}
								if (has_location) {
									map.panTo(location);
								} else {
									if (results.length >= 1) {
										map.panTo(results[0].geometry.location);
										if (has_zoom) {
											map.setZoom(zoom);
										}
									}
								}
							} else {
								trace("Place search for " + search_request.query + " was not successful for the following reason: " + status);
								trace("YOU MAY NEED A GOOGLE MAPS API KEY IN ORDER TO USE THIS FEATURE OF TIMELINEJS");
								trace("FIND OUT HOW TO GET YOUR KEY HERE: https://developers.google.com/places/documentation/#Authentication");
								if (has_location) {
									map.panTo(location);
									if (has_zoom) {
										map.setZoom(zoom);
									}
								} else {
									trace("USING SIMPLE IFRAME MAP EMBED");
									if (m.id[0].match("https")) {
										m.id = m.url[0].replace("https", "http");
									}
									VMM.ExternalAPI.googlemaps.createiFrameMap(m);
								}
							}
						};
						createMarker = function (place) {
							var marker, placeLoc;

							marker = void 0;
							placeLoc = void 0;
							placeLoc = place.geometry.location;
							marker = new google.maps.Marker({
								map: map,
								position: place.geometry.location
							});
							google.maps.event.addListener(marker, "click", function () {
								infowindow.setContent(place.name);
								infowindow.open(map, this);
							});
						};
						place = void 0;
						search_request = void 0;
						infowindow = void 0;
						search_bounds = void 0;
						bounds_sw = void 0;
						bounds_ne = void 0;
						place_search = new google.maps.places.PlacesService(map);
						infowindow = new google.maps.InfoWindow();
						search_request = {
							query: "",
							types: ["country", "neighborhood", "political", "locality", "geocode"]
						};
						if (type.of(VMM.Util.getUrlVars(m.id)["q"]) === "string") {
							search_request.query = VMM.Util.getUrlVars(m.id)["q"];
						}
						if (has_location) {
							search_request.location = location;
							search_request.radius = "15000";
						} else {
							bounds_sw = new google.maps.LatLng(-89.999999, -179.999999);
							bounds_ne = new google.maps.LatLng(89.999999, 179.999999);
							search_bounds = new google.maps.LatLngBounds(bounds_sw, bounds_ne);
						}
						place_search.textSearch(search_request, placeResults);
					};
					loadPlacesAlt = function () {
						var api_key, has_key, places_url;

						api_key = void 0;
						places_url = void 0;
						has_key = false;
						trace("LOADING PLACES API FOR GOOGLE MAPS");
						if (VMM.ExternalAPI.keys.google !== "") {
							api_key = VMM.ExternalAPI.keys.google;
							has_key = true;
						} else {
							trace("YOU NEED A GOOGLE MAPS API KEY IN ORDER TO USE THIS FEATURE OF TIMELINEJS");
							trace("FIND OUT HOW TO GET YOUR KEY HERE: https://developers.google.com/places/documentation/#Authentication");
						}
						places_url = "https://maps.googleapis.com/maps/api/place/textsearch/json?key=" + api_key + "&sensor=false&language=" + m.lang + "&";
						if (type.of(VMM.Util.getUrlVars(m.id)["q"]) === "string") {
							places_url += "query=" + VMM.Util.getUrlVars(m.id)["q"];
						}
						if (has_location) {
							places_url += "&location=" + location;
						}
						if (has_key) {
							VMM.getJSON(places_url, function (d) {
								var api_limit, places_bounds, places_bounds_ne, places_bounds_sw, places_location;

								trace("PLACES JSON");
								places_location = "";
								places_bounds = "";
								places_bounds_ne = "";
								places_bounds_sw = "";
								trace(d);
								if (d.status === "OVER_QUERY_LIMIT") {
									trace("OVER_QUERY_LIMIT");
									if (has_location) {
										map.panTo(location);
										if (has_zoom) {
											map.setZoom(zoom);
										}
									} else {
										trace("DOING TRADITIONAL MAP IFRAME EMBED UNTIL QUERY LIMIT RESTORED");
										api_limit = true;
										VMM.ExternalAPI.googlemaps.createiFrameMap(m);
									}
								} else {
									if (d.results.length >= 1) {
										places_bounds_ne = new google.maps.LatLng(parseFloat(d.results[0].geometry.viewport.northeast.lat), parseFloat(d.results[0].geometry.viewport.northeast.lng));
										places_bounds_sw = new google.maps.LatLng(parseFloat(d.results[0].geometry.viewport.southwest.lat), parseFloat(d.results[0].geometry.viewport.southwest.lng));
										places_bounds = new google.maps.LatLngBounds(places_bounds_sw, places_bounds_ne);
										map.fitBounds(places_bounds);
									} else {
										trace("NO RESULTS");
									}
									if (has_location) {
										map.panTo(location);
									}
									if (has_zoom) {
										map.setZoom(zoom);
									}
								}
							}).error(function (jqXHR, textStatus, errorThrown) {
								trace("PLACES JSON ERROR");
								trace("PLACES JSON ERROR: " + textStatus + " " + jqXHR.responseText);
							}).success(function (d) {
								trace("PLACES JSON SUCCESS");
							});
						} else {
							if (has_location) {
								map.panTo(location);
								if (has_zoom) {
									map.setZoom(zoom);
								}
							} else {
								trace("DOING TRADITIONAL MAP IFRAME EMBED BECAUSE NO GOOGLE MAP API KEY WAS PROVIDED");
								VMM.ExternalAPI.googlemaps.createiFrameMap(m);
							}
						}
					};
					loadKML = function () {
						var infowindow, kml_layer, kml_url, text;

						kml_url = void 0;
						kml_layer = void 0;
						infowindow = void 0;
						text = void 0;
						kml_url = m.id + "&output=kml";
						kml_url = kml_url.replace("&output=embed", "");
						kml_layer = new google.maps.KmlLayer(kml_url, {
							preserveViewport: true
						});
						infowindow = new google.maps.InfoWindow();
						kml_layer.setMap(map);
						google.maps.event.addListenerOnce(kml_layer, "defaultviewport_changed", function () {
							if (has_location) {
								map.panTo(location);
							} else {
								map.fitBounds(kml_layer.getDefaultViewport());
							}
							if (has_zoom) {
								map.setZoom(zoom);
							}
						});
						google.maps.event.addListener(kml_layer, "click", function (kmlEvent) {
							var showInfoWindow;

							showInfoWindow = function (c) {
								infowindow.setContent(c);
								infowindow.open(map);
							};
							text = kmlEvent.featureData.description;
							showInfoWindow(text);
						});
					};
					map_attribution = "";
					layer = void 0;
					map = void 0;
					map_options = void 0;
					unique_map_id = m.uid.toString() + "_gmap";
					map_attribution_html = "";
					location = new google.maps.LatLng(41.875696, -87.624207);
					latlong = void 0;
					zoom = 11;
					has_location = false;
					has_zoom = false;
					api_limit = false;
					map_bounds = void 0;
					google.maps.VeriteMapType = function (name) {
						var provider;

						if (VMM.ExternalAPI.googlemaps.defaultType(name)) {
							return google.maps.MapTypeId[name.toUpperCase()];
						} else {
							provider = mapProvider(name);
							return google.maps.ImageMapType.call(this, {
								getTileUrl: function (coord, zoom) {
									var index, retURL;

									index = (zoom + coord.x + coord.y) % VMM.ExternalAPI.googlemaps.map_subdomains.length;
									retURL = provider.url.replace("{S}", VMM.ExternalAPI.googlemaps.map_subdomains[index]).replace("{Z}", zoom).replace("{X}", coord.x).replace("{Y}", coord.y).replace("{z}", zoom).replace("{x}", coord.x).replace("{y}", coord.y);
									return retURL;
								},
								tileSize: new google.maps.Size(256, 256),
								name: name,
								minZoom: provider.minZoom,
								maxZoom: provider.maxZoom
							});
						}
					};
					google.maps.VeriteMapType.prototype = new google.maps.ImageMapType("_");
					if (VMM.ExternalAPI.googlemaps.maptype !== "") {
						if (VMM.ExternalAPI.googlemaps.defaultType(VMM.ExternalAPI.googlemaps.maptype)) {
							layer = google.maps.MapTypeId[VMM.ExternalAPI.googlemaps.maptype.toUpperCase()];
						} else {
							layer = VMM.ExternalAPI.googlemaps.maptype;
						}
					} else {
						layer = google.maps.MapTypeId["TERRAIN"];
					}
					if (type.of(VMM.Util.getUrlVars(m.id)["ll"]) === "string") {
						has_location = true;
						latlong = VMM.Util.getUrlVars(m.id)["ll"].split(",");
						location = new google.maps.LatLng(parseFloat(latlong[0]), parseFloat(latlong[1]));
					} else if (type.of(VMM.Util.getUrlVars(m.id)["sll"]) === "string") {
						latlong = VMM.Util.getUrlVars(m.id)["sll"].split(",");
						location = new google.maps.LatLng(parseFloat(latlong[0]), parseFloat(latlong[1]));
					}
					if (type.of(VMM.Util.getUrlVars(m.id)["z"]) === "string") {
						has_zoom = true;
						zoom = parseFloat(VMM.Util.getUrlVars(m.id)["z"]);
					}
					map_options = {
						zoom: zoom,
						draggable: false,
						disableDefaultUI: true,
						mapTypeControl: false,
						zoomControl: true,
						zoomControlOptions: {
							style: google.maps.ZoomControlStyle.SMALL,
							position: google.maps.ControlPosition.TOP_RIGHT
						},
						center: location,
						mapTypeId: layer,
						mapTypeControlOptions: {
							mapTypeIds: [layer]
						}
					};
					VMM.attachElement("#" + m.uid, "<div class='google-map' id='" + unique_map_id + "' style='width=100%;height=100%;'></div>");
					map = new google.maps.Map(document.getElementById(unique_map_id), map_options);
					if (VMM.ExternalAPI.googlemaps.defaultType(VMM.ExternalAPI.googlemaps.maptype)) {
						dontcrashjs2coffee = 0;
					} else {
						map.mapTypes.set(layer, new google.maps.VeriteMapType(layer));
						map_attribution_html = "<div class='map-attribution'><div class='attribution-text'>" + map_attribution + "</div></div>";
						VMM.appendElement("#" + unique_map_id, map_attribution_html);
					}
					if (type.of(VMM.Util.getUrlVars(m.id)["msid"]) === "string") {
						loadKML();
					} else {
						if (type.of(VMM.Util.getUrlVars(m.id)["q"]) === "string") {
							geocodePlace();
						}
					}
				},
				pushQue: function () {
					var i;

					i = 0;
					while (i < VMM.master_config.googlemaps.que.length) {
						VMM.ExternalAPI.googlemaps.create(VMM.master_config.googlemaps.que[i]);
						i++;
					}
					VMM.master_config.googlemaps.que = [];
				},
				onMapAPIReady: function () {
					VMM.master_config.googlemaps.map_active = true;
					VMM.master_config.googlemaps.places_active = true;
					VMM.ExternalAPI.googlemaps.onAPIReady();
				},
				onPlacesAPIReady: function () {
					VMM.master_config.googlemaps.places_active = true;
					VMM.ExternalAPI.googlemaps.onAPIReady();
				},
				onAPIReady: function () {
					if (!VMM.master_config.googlemaps.active) {
						if (VMM.master_config.googlemaps.map_active && VMM.master_config.googlemaps.places_active) {
							VMM.master_config.googlemaps.active = true;
							VMM.ExternalAPI.googlemaps.pushQue();
						}
					}
				},
				defaultType: function (name) {
					if (name.toLowerCase() === "satellite" || name.toLowerCase() === "hybrid" || name.toLowerCase() === "terrain" || name.toLowerCase() === "roadmap") {
						return true;
					} else {
						return false;
					}
				},
				map_subdomains: ["", "a.", "b.", "c.", "d."],
				map_attribution: {
					stamen: "Map tiles by <a href='http://stamen.com'>Stamen Design</a>, under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a href='http://openstreetmap.org'>OpenStreetMap</a>, under <a href='http://creativecommons.org/licenses/by-sa/3.0'>CC BY SA</a>.",
					apple: "Map data &copy; 2012    Apple, Imagery &copy; 2012 Apple"
				},
				map_providers: {
					toner: {
						url: "//{S}tile.stamen.com/toner/{Z}/{X}/{Y}.png",
						minZoom: 0,
						maxZoom: 20,
						attribution: "stamen"
					},
					"toner-lines": {
						url: "//{S}tile.stamen.com/toner-lines/{Z}/{X}/{Y}.png",
						minZoom: 0,
						maxZoom: 20,
						attribution: "stamen"
					},
					"toner-labels": {
						url: "//{S}tile.stamen.com/toner-labels/{Z}/{X}/{Y}.png",
						minZoom: 0,
						maxZoom: 20,
						attribution: "stamen"
					},
					sterrain: {
						url: "//{S}tile.stamen.com/terrain/{Z}/{X}/{Y}.jpg",
						minZoom: 4,
						maxZoom: 20,
						attribution: "stamen"
					},
					apple: {
						url: "//gsp2.apple.com/tile?api=1&style=slideshow&layers=default&lang=en_US&z={z}&x={x}&y={y}&v=9",
						minZoom: 4,
						maxZoom: 14,
						attribution: "apple"
					},
					watercolor: {
						url: "//{S}tile.stamen.com/watercolor/{Z}/{X}/{Y}.jpg",
						minZoom: 3,
						maxZoom: 16,
						attribution: "stamen"
					}
				}
			},
			googleplus: {
				get: function (m) {
					var api_key, gplus;

					api_key = void 0;
					gplus = {
						user: m.user,
						activity: m.id,
						id: m.uid
					};
					VMM.master_config.googleplus.que.push(gplus);
					VMM.master_config.googleplus.active = true;
				},
				create: function (gplus, callback) {
					var api_key, callback_timeout, g_activity, g_attachments, g_content, gactivity_api_url, googleplus_timeout, gperson_api_url, mediaElem;

					mediaElem = "";
					api_key = "";
					g_activity = "";
					g_content = "";
					g_attachments = "";
					gperson_api_url = void 0;
					gactivity_api_url = void 0;
					googleplus_timeout = setTimeout(VMM.ExternalAPI.googleplus.errorTimeOut, VMM.master_config.timers.api, gplus);
					callback_timeout = setTimeout(callback, VMM.master_config.timers.api, gplus);
					if (VMM.master_config.Timeline.api_keys.google !== "") {
						api_key = VMM.master_config.Timeline.api_keys.google;
					} else {
						api_key = Aes.Ctr.decrypt(VMM.master_config.api_keys_master.google, VMM.master_config.vp, 256);
					}
					gperson_api_url = "https://www.googleapis.com/plus/v1/people/" + gplus.user + "/activities/public?alt=json&maxResults=100&fields=items(id,url)&key=" + api_key;
					mediaElem = "GOOGLE PLUS API CALL";
					VMM.getJSON(gperson_api_url, function (p_data) {
						var i;

						i = 0;
						while (i < p_data.items.length) {
							trace("loop");
							if (p_data.items[i].url.split("posts/")[1] === gplus.activity) {
								trace("FOUND IT!!");
								g_activity = p_data.items[i].id;
								gactivity_api_url = "https://www.googleapis.com/plus/v1/activities/" + g_activity + "?alt=json&key=" + api_key;
								VMM.getJSON(gactivity_api_url, function (a_data) {
									var k;

									trace(a_data);
									if (typeof a_data.annotation !== "undefined") {
										g_content += "<div class='googleplus-annotation'>'" + a_data.annotation + "</div>";
										g_content += a_data.object.content;
									} else {
										g_content += a_data.object.content;
									}
									if (typeof a_data.object.attachments !== "undefined") {
										k = 0;
										while (k < a_data.object.attachments.length) {
											if (a_data.object.attachments[k].objectType === "photo") {
												g_attachments = "<a href='" + a_data.object.url + "' target='_blank'>" + "<img src='" + a_data.object.attachments[k].image.url + "' class='article-thumb'></a>" + g_attachments;
											} else if (a_data.object.attachments[k].objectType === "video") {
												g_attachments = "<img src='" + a_data.object.attachments[k].image.url + "' class='article-thumb'>" + g_attachments;
												g_attachments += "<div>";
												g_attachments += "<a href='" + a_data.object.attachments[k].url + "' target='_blank'>";
												g_attachments += "<h5>" + a_data.object.attachments[k].displayName + "</h5>";
												g_attachments += "</a>";
												g_attachments += "</div>";
											} else if (a_data.object.attachments[k].objectType === "article") {
												g_attachments += "<div>";
												g_attachments += "<a href='" + a_data.object.attachments[k].url + "' target='_blank'>";
												g_attachments += "<h5>" + a_data.object.attachments[k].displayName + "</h5>";
												g_attachments += "<p>" + a_data.object.attachments[k].content + "</p>";
												g_attachments += "</a>";
												g_attachments += "</div>";
											}
											trace(a_data.object.attachments[k]);
											k++;
										}
										g_attachments = "<div class='googleplus-attachments'>" + g_attachments + "</div>";
									}
									mediaElem = "<div class='googleplus-content'>" + g_content + g_attachments + "</div>";
									mediaElem += "<div class='vcard author'><a class='screen-name url' href='" + a_data.url + "' target='_blank'>";
									mediaElem += "<span class='avatar'><img src='" + a_data.actor.image.url + "' style='max-width: 32px; max-height: 32px;'></span>";
									mediaElem += "<span class='fn'>" + a_data.actor.displayName + "</span>";
									mediaElem += "<span class='nickname'><span class='thumbnail-inline'></span></span>";
									mediaElem += "</a></div>";
									VMM.attachElement("#googleplus_" + gplus.activity, mediaElem);
								});
								break;
							}
							i++;
						}
					}).error(function (jqXHR, textStatus, errorThrown) {
						var error_obj;

						error_obj = VMM.parseJSON(jqXHR.responseText);
						trace(error_obj.error.message);
						VMM.attachElement("#googleplus_" + gplus.activity, VMM.MediaElement.loadingmessage("<p>ERROR LOADING GOOGLE+ </p><p>" + error_obj.error.message + "</p>"));
					}).success(function (d) {
						clearTimeout(googleplus_timeout);
						clearTimeout(callback_timeout);
						callback();
					});
				},
				pushQue: function () {
					if (VMM.master_config.googleplus.que.length > 0) {
						VMM.ExternalAPI.googleplus.create(VMM.master_config.googleplus.que[0], VMM.ExternalAPI.googleplus.pushQue);
						VMM.Util.removeRange(VMM.master_config.googleplus.que, 0);
					}
				},
				errorTimeOut: function (gplus) {
					trace("GOOGLE+ JSON ERROR TIMEOUT " + gplus.activity);
					VMM.attachElement("#googleplus_" + gplus.activity, VMM.MediaElement.loadingmessage("<p>Still waiting on GOOGLE+ </p><p>" + gplus.activity + "</p>"));
				}
			},
			googledocs: {
				get: function (m) {
					VMM.master_config.googledocs.que.push(m);
					VMM.master_config.googledocs.active = true;
				},
				create: function (m) {
					var mediaElem;

					mediaElem = "";
					if (m.id.match(/docs.google.com/i)) {
						mediaElem = "<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + m.id + "&amp;embedded=true'></iframe>";
					} else {
						mediaElem = "<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + "//docs.google.com/viewer?url=" + m.id + "&amp;embedded=true'></iframe>";
					}
					VMM.attachElement("#" + m.uid, mediaElem);
				},
				pushQue: function () {
					var i;

					i = 0;
					while (i < VMM.master_config.googledocs.que.length) {
						VMM.ExternalAPI.googledocs.create(VMM.master_config.googledocs.que[i]);
						i++;
					}
					VMM.master_config.googledocs.que = [];
				}
			},
			flickr: {
				get: function (m) {
					VMM.master_config.flickr.que.push(m);
					VMM.master_config.flickr.active = true;
				},
				create: function (m, callback) {
					var api_key, callback_timeout, the_url;

					api_key = void 0;
					callback_timeout = setTimeout(callback, VMM.master_config.timers.api, m);
					if (typeof VMM.master_config.Timeline !== "undefined" && VMM.master_config.Timeline.api_keys.flickr !== "") {
						api_key = VMM.master_config.Timeline.api_keys.flickr;
					} else {
						api_key = Aes.Ctr.decrypt(VMM.master_config.api_keys_master.flickr, VMM.master_config.vp, 256);
					}
					the_url = "//api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + api_key + "&photo_id=" + m.id + "&format=json&jsoncallback=?";
					VMM.getJSON(the_url, function (d) {
						var flickr_best_size, flickr_id, flickr_img_size, flickr_img_thumb, flickr_large_id, flickr_size_found, flickr_thumb_id, i;

						flickr_id = VMM.ExternalAPI.flickr.getFlickrIdFromUrl(d.sizes.size[0].url);
						flickr_large_id = "#" + m.uid;
						flickr_thumb_id = "#" + m.uid + "_thumb";
						flickr_img_size = void 0;
						flickr_img_thumb = void 0;
						flickr_size_found = false;
						flickr_best_size = "Large";
						flickr_best_size = VMM.ExternalAPI.flickr.sizes(VMM.master_config.sizes.api.height);
						i = 0;
						while (i < d.sizes.size.length) {
							if (d.sizes.size[i].label === flickr_best_size) {
								flickr_size_found = true;
								flickr_img_size = d.sizes.size[i].source;
							}
							i++;
						}
						if (!flickr_size_found) {
							flickr_img_size = d.sizes.size[d.sizes.size.length - 2].source;
						}
						flickr_img_thumb = d.sizes.size[0].source;
						VMM.Lib.attr(flickr_large_id, "src", flickr_img_size);
						VMM.attachElement(flickr_thumb_id, "<img src='" + flickr_img_thumb + "'>");
					}).error(function (jqXHR, textStatus, errorThrown) {
						trace("FLICKR error");
						trace("FLICKR ERROR: " + textStatus + " " + jqXHR.responseText);
					}).success(function (d) {
						clearTimeout(callback_timeout);
						callback();
					});
				},
				pushQue: function () {
					if (VMM.master_config.flickr.que.length > 0) {
						VMM.ExternalAPI.flickr.create(VMM.master_config.flickr.que[0], VMM.ExternalAPI.flickr.pushQue);
						VMM.Util.removeRange(VMM.master_config.flickr.que, 0);
					}
				},
				sizes: function (s) {
					var _size;

					_size = "";
					if (s <= 75) {
						_size = "Thumbnail";
					} else if (s <= 180) {
						_size = "Small";
					} else if (s <= 240) {
						_size = "Small 320";
					} else if (s <= 375) {
						_size = "Medium";
					} else if (s <= 480) {
						_size = "Medium 640";
					} else if (s <= 600) {
						_size = "Large";
					} else {
						_size = "Large";
					}
					return _size;
				},
				getFlickrIdFromUrl: function (url) {
					var idx, photo_info, pos;

					idx = url.indexOf("flickr.com/photos/");
					if (idx === -1) {
						return null;
					}
					pos = idx + "flickr.com/photos/".length;
					photo_info = url.substr(pos);
					if (photo_info.indexOf("/") === -1) {
						return null;
					}
					if (photo_info.indexOf("/") === 0) {
						photo_info = photo_info.substr(1);
					}
					return photo_info.split("/")[1];
				}
			},
			instagram: {
				get: function (m, thumb) {
					if (thumb) {
						return "//instagr.am/p/" + m.id + "/media/?size=t";
					} else {
						return "//instagr.am/p/" + m.id + "/media/?size=" + VMM.ExternalAPI.instagram.sizes(VMM.master_config.sizes.api.height);
					}
				},
				sizes: function (s) {
					var _size;

					_size = "";
					if (s <= 150) {
						_size = "t";
					} else if (s <= 306) {
						_size = "m";
					} else {
						_size = "l";
					}
					return _size;
				},
				isInstagramUrl: function (url) {
					return url.match("instagr.am/p/") || url.match("instagram.com/p/");
				},
				getInstagramIdFromUrl: function (url) {
					var e;

					try {
						return url.split("/p/")[1].split("/")[0];
					} catch (_error) {
						e = _error;
						trace("Invalid Instagram url: " + url);
						return null;
					}
				}
			},
			soundcloud: {
				get: function (m) {
					VMM.master_config.soundcloud.que.push(m);
					VMM.master_config.soundcloud.active = true;
				},
				create: function (m, callback) {
					var the_url;

					the_url = "//soundcloud.com/oembed?url=" + m.id + "&format=js&callback=?";
					VMM.getJSON(the_url, function (d) {
						VMM.attachElement("#" + m.uid, d.html);
						callback();
					});
				},
				pushQue: function () {
					if (VMM.master_config.soundcloud.que.length > 0) {
						VMM.ExternalAPI.soundcloud.create(VMM.master_config.soundcloud.que[0], VMM.ExternalAPI.soundcloud.pushQue);
						VMM.Util.removeRange(VMM.master_config.soundcloud.que, 0);
					}
				}
			},
			wikipedia: {
				get: function (m) {
					VMM.master_config.wikipedia.que.push(m);
					VMM.master_config.wikipedia.active = true;
				},
				create: function (m, callback) {
					var callback_timeout, temp_text, the_url;

					the_url = "//" + m.lang + ".wikipedia.org/w/api.php?action=query&prop=extracts&redirects=&titles=" + m.id + "&exintro=1&format=json&callback=?";
					callback_timeout = setTimeout(callback, VMM.master_config.timers.api, m);
					if (VMM.Browser.browser === "Explorer" && parseInt(VMM.Browser.version, 10) >= 7 && window.XDomainRequest) {
						temp_text = "<h4><a href='http://" + VMM.master_config.language.api.wikipedia + ".wikipedia.org/wiki/" + m.id + "' target='_blank'>" + m.url + "</a></h4>";
						temp_text += "<span class='wiki-source'>" + VMM.master_config.language.messages.wikipedia + "</span>";
						temp_text += "<p>Wikipedia entry unable to load using Internet Explorer 8 or below.</p>";
						VMM.attachElement("#" + m.uid, temp_text);
					}
					VMM.getJSON(the_url, function (d) {
						var don, i, tcrashjs2coffee, wiki_extract, wiki_number_of_paragraphs, wiki_text, wiki_text_array, wiki_title, _wiki;

						if (d.query) {
							wiki_extract = void 0;
							wiki_title = void 0;
							_wiki = "";
							wiki_text = "";
							wiki_number_of_paragraphs = 1;
							wiki_text_array = [];
							wiki_extract = VMM.Util.getObjectAttributeByIndex(d.query.pages, 0).extract;
							wiki_title = VMM.Util.getObjectAttributeByIndex(d.query.pages, 0).title;
							if (wiki_extract.match("<p>")) {
								wiki_text_array = wiki_extract.split("<p>");
							} else {
								wiki_text_array.push(wiki_extract);
							}
							i = 0;
							while (i < wiki_text_array.length) {
								if (i + 1 <= wiki_number_of_paragraphs && i + 1 < wiki_text_array.length) {
									wiki_text += "<p>" + wiki_text_array[i + 1];
								}
								i++;
							}
							_wiki = "<h4><a href='http://" + VMM.master_config.language.api.wikipedia + ".wikipedia.org/wiki/" + wiki_title + "' target='_blank'>" + wiki_title + "</a></h4>";
							_wiki += "<span class='wiki-source'>" + VMM.master_config.language.messages.wikipedia + "</span>";
							_wiki += VMM.Util.linkify_wikipedia(wiki_text);
							if (wiki_extract.match("REDIRECT")) {
								don = void 0;
								tcrashjs2coffee = 0;
							} else {
								VMM.attachElement("#" + m.uid, _wiki);
							}
						}
					}).error(function (jqXHR, textStatus, errorThrown) {
						trace("WIKIPEDIA error");
						trace("WIKIPEDIA ERROR: " + textStatus + " " + jqXHR.responseText);
						trace(errorThrown);
						VMM.attachElement("#" + m.uid, VMM.MediaElement.loadingmessage("<p>Wikipedia is not responding</p>"));
						clearTimeout(callback_timeout);
						if (VMM.master_config.wikipedia.tries < 4) {
							trace("WIKIPEDIA ATTEMPT " + VMM.master_config.wikipedia.tries);
							trace(m);
							VMM.master_config.wikipedia.tries++;
							VMM.ExternalAPI.wikipedia.create(m, callback);
						} else {
							callback();
						}
					}).success(function (d) {
						VMM.master_config.wikipedia.tries = 0;
						clearTimeout(callback_timeout);
						callback();
					});
				},
				pushQue: function () {
					if (VMM.master_config.wikipedia.que.length > 0) {
						trace("WIKIPEDIA PUSH QUE " + VMM.master_config.wikipedia.que.length);
						VMM.ExternalAPI.wikipedia.create(VMM.master_config.wikipedia.que[0], VMM.ExternalAPI.wikipedia.pushQue);
						VMM.Util.removeRange(VMM.master_config.wikipedia.que, 0);
					}
				}
			},
			youtube: {
				get: function (m) {
					var the_url;

					the_url = "//gdata.youtube.com/feeds/api/videos/" + m.id + "?v=2&alt=jsonc&callback=?";
					VMM.master_config.youtube.que.push(m);
					if (!VMM.master_config.youtube.active) {
						if (!VMM.master_config.youtube.api_loaded) {
							LoadLib.js("//www.youtube.com/player_api", function () {
								trace("YouTube API Library Loaded");
							});
						}
					}
					VMM.getJSON(the_url, function (d) {
						VMM.ExternalAPI.youtube.createThumb(d, m);
					});
				},
				create: function (m) {
					var p, vid_start_minutes, vid_start_seconds, vidstart;

					if (typeof m.start !== "undefined") {
						vidstart = m.start.toString();
						vid_start_minutes = 0;
						vid_start_seconds = 0;
						if (vidstart.match("m")) {
							vid_start_minutes = parseInt(vidstart.split("m")[0], 10);
							vid_start_seconds = parseInt(vidstart.split("m")[1].split("s")[0], 10);
							m.start = (vid_start_minutes * 60) + vid_start_seconds;
						} else {
							m.start = 0;
						}
					} else {
						m.start = 0;
					}
					p = {
						active: false,
						player: {},
						name: m.uid,
						playing: false,
						hd: false
					};
					if (typeof m.hd !== "undefined") {
						p.hd = true;
					}
					p.player[m.id] = new YT.Player(m.uid, {
						height: "390",
						width: "640",
						playerVars: {
							enablejsapi: 1,
							color: "white",
							showinfo: 0,
							theme: "light",
							start: m.start,
							rel: 0
						},
						videoId: m.id,
						events: {
							onReady: VMM.ExternalAPI.youtube.onPlayerReady,
							onStateChange: VMM.ExternalAPI.youtube.onStateChange
						}
					});
					VMM.master_config.youtube.array.push(p);
				},
				createThumb: function (d, m) {
					var thumb_id;

					trace("CREATE THUMB");
					trace(d);
					trace(m);
					if (typeof d.data !== "undefined") {
						thumb_id = "#" + m.uid + "_thumb";
						VMM.attachElement(thumb_id, "<img src='" + d.data.thumbnail.sqDefault + "'>");
					}
				},
				pushQue: function () {
					var i;

					i = 0;
					while (i < VMM.master_config.youtube.que.length) {
						VMM.ExternalAPI.youtube.create(VMM.master_config.youtube.que[i]);
						i++;
					}
					VMM.master_config.youtube.que = [];
				},
				onAPIReady: function () {
					VMM.master_config.youtube.active = true;
					VMM.ExternalAPI.youtube.pushQue();
				},
				stopPlayers: function () {
					var i, the_name;

					i = 0;
					while (i < VMM.master_config.youtube.array.length) {
						if (VMM.master_config.youtube.array[i].playing) {
							the_name = VMM.master_config.youtube.array[i].name;
							VMM.master_config.youtube.array[i].player[the_name].stopVideo();
						}
						i++;
					}
				},
				onStateChange: function (e) {
					var dontcrashjs2coffee, i, the_name;

					i = 0;
					while (i < VMM.master_config.youtube.array.length) {
						the_name = VMM.master_config.youtube.array[i].name;
						if (VMM.master_config.youtube.array[i].player[the_name] === e.target) {
							if (e.data === YT.PlayerState.PLAYING) {
								VMM.master_config.youtube.array[i].playing = true;
								trace(VMM.master_config.youtube.array[i].hd);
								if (VMM.master_config.youtube.array[i].hd) {
									dontcrashjs2coffee = 0;
								}
							}
						}
						i++;
					}
				},
				onPlayerReady: function (e) { }
			},
			vimeo: {
				get: function (m) {
					VMM.master_config.vimeo.que.push(m);
					VMM.master_config.vimeo.active = true;
				},
				create: function (m, callback) {
					var thumb_url, video_url;

					trace("VIMEO CREATE");
					thumb_url = "//vimeo.com/api/v2/video/" + m.id + ".json";
					video_url = "//player.vimeo.com/video/" + m.id + "?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff";
					VMM.getJSON(thumb_url, function (d) {
						VMM.ExternalAPI.vimeo.createThumb(d, m);
						callback();
					});
					VMM.attachElement("#" + m.uid, "<iframe autostart='false' frameborder='0' width='100%' height='100%' src='" + video_url + "'></iframe>");
				},
				createThumb: function (d, m) {
					var thumb_id;

					trace("VIMEO CREATE THUMB");
					thumb_id = "#" + m.uid + "_thumb";
					VMM.attachElement(thumb_id, "<img src='" + d[0].thumbnail_small + "'>");
				},
				pushQue: function () {
					if (VMM.master_config.vimeo.que.length > 0) {
						VMM.ExternalAPI.vimeo.create(VMM.master_config.vimeo.que[0], VMM.ExternalAPI.vimeo.pushQue);
						VMM.Util.removeRange(VMM.master_config.vimeo.que, 0);
					}
				}
			},
			vine: {
				get: function (m) {
					VMM.master_config.vine.que.push(m);
					VMM.master_config.vine.active = true;
				},
				create: function (m, callback) {
					var video_url;

					trace("VINE CREATE");
					video_url = "https://vine.co/v/" + m.id + "/embed/simple";
					VMM.attachElement("#" + m.uid, "<iframe frameborder='0' width='100%' height='100%' src='" + video_url + "'></iframe><script async src='http://platform.vine.co/static/scripts/embed.js' charset='utf-8'></script>");
				},
				pushQue: function () {
					if (VMM.master_config.vine.que.length > 0) {
						VMM.ExternalAPI.vine.create(VMM.master_config.vine.que[0], VMM.ExternalAPI.vine.pushQue);
						VMM.Util.removeRange(VMM.master_config.vine.que, 0);
					}
				}
			},
			webthumb: {
				get: function (m, thumb) {
					VMM.master_config.webthumb.que.push(m);
					VMM.master_config.webthumb.active = true;
				},
				sizes: function (s) {
					var _size;

					_size = "";
					if (s <= 150) {
						_size = "t";
					} else if (s <= 306) {
						_size = "m";
					} else {
						_size = "l";
					}
					return _size;
				},
				create: function (m) {
					var thumb_url, url;

					trace("WEB THUMB CREATE");
					thumb_url = "//api.pagepeeker.com/v2/thumbs.php?";
					url = m.id.replace("http://", "");
					VMM.attachElement("#" + m.uid, "<a href='" + m.id + "' target='_blank'><img src='" + thumb_url + "size=x&url=" + url + "'></a>");
					VMM.attachElement("#" + m.uid + "_thumb", "<img src='" + thumb_url + "size=t&url=" + url + "'>");
				},
				pushQue: function () {
					var i;

					i = 0;
					while (i < VMM.master_config.webthumb.que.length) {
						VMM.ExternalAPI.webthumb.create(VMM.master_config.webthumb.que[i]);
						i++;
					}
					VMM.master_config.webthumb.que = [];
				}
			}
		}.init();
	}

}).call(this);

(function () {
	var mediaTypes, unknownMediaType;

	mediaTypes = [];

	unknownMediaType = void 0;

	$.extend(VMM.ExternalAPI, {
		insertMediaType: function (name, mediaType) {
			mediaType.name = name;
			VMM.ExternalAPI[name] = mediaType;
			return mediaTypes.unshift(mediaType);
		},
		addMediaType: function (name, mediaType) {
			mediaType.name = name;
			VMM.ExternalAPI[name] = mediaType;
			return mediaTypes.push(mediaType);
		},
		setUnknownMediaType: function (mediaType) {
			return unknownMediaType = mediaType;
		},
		mediaTypeFromAsset: function (asset) {
			var media, mediaId, mediaType, ret, _i, _len;

			media = function () {
				return {
					type: "unknown",
					id: "",
					start: 0,
					hd: false,
					link: "",
					lang: VMM.Language.lang,
					uniqueid: VMM.Util.unique_ID(6)
				};
			};
			if (asset.media) {
				mediaId = asset.media.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
			}
			for (_i = 0, _len = mediaTypes.length; _i < _len; _i++) {
				mediaType = mediaTypes[_i];
				if (mediaType.assetTest && (ret = mediaType.assetTest($.extend({}, asset), media(), mediaId)) !== void 0) {
					if (ret !== false) {
						return $.extend(media(), ret);
					} else {
						trace("No valid media id detected");
						trace(d);
						return ret;
					}
				}
			}
			return $.extend(unknownMediaType.assetTest($.extend({}, asset), media(), mediaId), {
				type: "unknown"
			});
		}
	});

	VMM.ExternalAPI.addMediaType("twitter-ready", {
		assetTest: function (asset, media, d) {
			if (d && d.match("div class='twitter'")) {
				return {
					id: d
				};
			}
		},
		thumbnail: function (media, uid) {
			return "<div class='thumbnail thumb-twitter'></div>";
		},
		createElement: function (media, loading_message) {
			return media.id;
		},
		isTextMedia: true
	});

	VMM.ExternalAPI.addMediaType("youtube", $.extend(VMM.ExternalAPI.youtube, {
		assetTest: function (asset, media, d) {
			if (d) {
				if (d.match("(www.)?youtube|youtu.be")) {
					if (d.match("v=")) {
						media.id = VMM.Util.getUrlVars(d)["v"];
					} else if (d.match("/embed/")) {
						media.id = d.split("embed/")[1].split(/[?&]/)[0];
					} else if (d.match(/v\/|v=|youtu\.be\//)) {
						media.id = d.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
					} else {
						trace("YOUTUBE IN URL BUT NOT A VALID VIDEO");
					}
					return $.extend(media, {
						start: VMM.Util.getUrlVars(d)["t"],
						hd: VMM.Util.getUrlVars(d)["hd"],
						mediaType: VMM.ExternalAPI.youtube,
						type: "youtube"
					});
				}
			}
		},
		thumbnail: function (media, uid) {
			return "<div class='thumbnail thumb-youtube' id='" + uid + "_thumb'></div>";
		},
		createElement: function (media, loading_message) {
			var mediaElem;

			mediaElem = "<div class='media-shadow'><div class='media-frame video youtube' id='" + media.uid + "'>" + loading_message + "</div></div>";
			VMM.ExternalAPI.youtube.get(media);
			return mediaElem;
		}
	}));

	VMM.ExternalAPI.addMediaType("vimeo", $.extend(VMM.ExternalAPI.vimeo, {
		assetTest: function (asset, media, d) {
			if (d) {
				if (d.match("(player.)?vimeo.com")) {
					return {
						id: d.split(/video\/|\/\/vimeo\.com\//)[1].split(/[?&]/)[0],
						mediaType: VMM.ExternalAPI.vimeo,
						type: "vimeo"
					};
				}
			}
		},
		thumbnail: function (media, uid) {
			return "<div class='thumbnail thumb-vimeo' id='" + uid + "_thumb'></div>";
		},
		createElement: function (media, loading_message) {
			var mediaElem;

			mediaElem = "<div class='media-shadow media-frame video vimeo' id='" + media.uid + "'>" + loading_message + "</div>";
			VMM.ExternalAPI.vimeo.get(media);
			return mediaElem;
		}
	}));

	VMM.ExternalAPI.addMediaType("dailymotion", $.extend(VMM.ExternalAPI.dailymotion, {
		assetTest: function (asset, media, d) {
			if (d) {
				if (d.match("(www.)?dailymotion.com")) {
					return {
						id: d.split(/video\/|\/\/dailymotion\.com\//)[1],
						mediaType: VMM.ExternalAPI.dailymotion,
						type: "dailymotion"
					};
				}
			}
		},
		thumbnail: function (media, uid) {
			return "<div class='thumbnail thumb-video'></div>";
		},
		createElement: function (media, loading_message) {
			return "<div class='media-shadow'><iframe class='media-frame video dailymotion' autostart='false' frameborder='0' width='100%' height='100%' src='http://www.dailymotion.com/embed/video/" + media.id + "'></iframe></div>";
		}
	}));

	VMM.ExternalAPI.addMediaType("vine", $.extend(VMM.ExternalAPI.vine, {
		assetTest: function (asset, media, d) {
			if (d) {
				if (d.match("(www.)?vine.co")) {
					trace("VINE");
					if (d.match("vine.co/v/")) {
						trace(d.split("vine.co/v/")[1]);
						return {
							id: d.split("vine.co/v/")[1],
							type: "vine"
						};
					} else {
						return {
							type: "vine"
						};
					}
				}
			}
		},
		thumbnail: function (media, uid) {
			return "<div class='thumbnail thumb-vine'></div>";
		},
		createElement: function (media, loading_message) {
			var mediaElem;

			mediaElem = "<div class='media-shadow media-frame video vine' id='" + media.uid + "'>" + loading_message + "</div>";
			VMM.ExternalAPI.vine.get(media);
			return mediaElem;
		}
	}));

	VMM.ExternalAPI.addMediaType("soundcloud", $.extend(VMM.ExternalAPI.soundcloud, {
		assetTest: function (asset, media, d) {
			if (d) {
				if (d.match("(player.)?soundcloud.com")) {
					return {
						id: d,
						type: "soundcloud"
					};
				}
			}
		},
		thumbnail: function (media, uid) {
			return "<div class='thumbnail thumb-audio'></div>";
		},
		createElement: function (media, loading_message) {
			var mediaElem;

			mediaElem = "<div class='media-frame media-shadow soundcloud' id='" + media.uid + "'>" + loading_message + "</div>";
			VMM.ExternalAPI.soundcloud.get(media);
			return mediaElem;
		}
	}));

	VMM.ExternalAPI.addMediaType("twitter", $.extend(VMM.ExternalAPI.twitter, {
		assetTest: function (asset, media, d) {
			if (d) {
				if (d.match("(www.)?twitter.com") && d.match("status")) {
					if (d.match("status/")) {
						media.id = d.split("status/")[1];
					} else if (d.match("statuses/")) {
						media.id = d.split("statuses/")[1];
					} else {
						media.id = "";
					}
					media.type = "twitter";
					return media;
				}
			}
		},
		thumbnail: function (media, uid) {
			return "<div class='thumbnail thumb-twitter'></div>";
		},
		createElement: function (media, loading_message) {
			var mediaElem;

			mediaElem = "<div class='twitter' id='" + media.uid + "'>" + loading_message + "</div>";
			VMM.ExternalAPI.twitter.get(media);
			return mediaElem;
		},
		isTextMedia: true
	}));

	VMM.ExternalAPI.addMediaType("googlemaps", $.extend(VMM.ExternalAPI.googlemaps, {
		assetTest: function (asset, media, d) {
			if (d) {
				if (d.match("maps.google") && !d.match("staticmap")) {
					return $.extend(media, {
						type: "google-map",
						id: d.split(/src=['|"][^'|"]*?['|"]/g)
					});
				}
			}
		},
		thumbnail: function (media, uid) {
			return "<div class='thumbnail thumb-map'></div>";
		},
		createElement: function (media, loading_message) {
			var mediaElem;

			mediaElem = "<div class='media-frame media-shadow map' id='" + media.uid + "'>" + loading_message + "</div>";
			VMM.ExternalAPI.googlemaps.get(media);
			return mediaElem;
		}
	}));

	VMM.ExternalAPI.addMediaType("googleplus", $.extend(VMM.ExternalAPI.googleplus, {
		assetTest: function (asset, media, d) {
			if (d) {
				if (d.match("plus.google")) {
					media.type = "googleplus";
					media.id = d.split("/posts/")[1];
					if (d.split("/posts/")[0].match("u/0/")) {
						return media.user = d.split("u/0/")[1].split("/posts")[0];
					} else {
						return media.user = d.split("google.com/")[1].split("/posts/")[0];
					}
				}
			}
		},
		thumbnail: function (media, uid) {
			return "<div class='thumbnail thumb-googleplus'></div>";
		},
		createElement: function (media, loading_message) {
			var mediaElem;

			mediaElem = "<div class='googleplus' id='googleplus_" + media.id + "'>" + loading_message + "</div>";
			VMM.ExternalAPI.googleplus.get(media);
			return mediaElem;
		},
		isTextMedia: true
	}));

	VMM.ExternalAPI.addMediaType("flickr", $.extend(VMM.ExternalAPI.flickr, {
		assetTest: function (asset, media, d) {
			if (d) {
				if (d.match("flickr.com/photos/")) {
					media.type = "flickr";
					media.id = VMM.ExternalAPI.flickr.getFlickrIdFromUrl(d);
					media.link = d;
					if (Boolean(media.id)) {
						return media;
					} else {
						return false;
					}
				}
			}
		},
		thumbnail: function (media, uid) {
			return "<div class='thumbnail thumb-photo' id='" + uid + "_thumb'></div>";
		},
		createElement: function (media, loading_message) {
			var mediaElem;

			mediaElem = "<div class='media-image media-shadow'><a href='" + media.link + "' target='_blank'><img id='" + media.uid + "'></a></div>";
			VMM.ExternalAPI.flickr.get(media);
			return mediaElem;
		}
	}));

	VMM.ExternalAPI.addMediaType("instagram", $.extend(VMM.ExternalAPI.instagram, {
		assetTest: function (asset, media, d) {
			if (d) {
				if (VMM.ExternalAPI.instagram.isInstagramUrl(d)) {
					media.type = "instagram";
					media.link = d;
					media.id = VMM.ExternalAPI.instagram.getInstagramIdFromUrl(d);
					if (Boolean(media.id)) {
						return media;
					} else {
						return false;
					}
				}
			}
		},
		thumbnail: function (media, uid) {
			return "<div class='thumbnail thumb-instagram' id='" + uid + "_thumb'><img src='" + VMM.ExternalAPI.instagram.get(media, true) + "'></div>";
		},
		createElement: function (media, loading_message) {
			return "<div class='media-image media-shadow'><a href='" + media.link + "' target='_blank'><img src='" + VMM.ExternalAPI.instagram.get(media) + "'></a></div>";
		}
	}));

	VMM.ExternalAPI.addMediaType("image", {
		assetTest: function (asset, media, d) {
			if (d) {
				if (d.match(/jpg|jpeg|png|gif/i) || d.match("staticmap") || d.match("yfrog.com") || d.match("twitpic.com")) {
					return $.extend(media, {
						type: "image",
						id: d
					});
				}
			}
		},
		thumbnail: function (media, uid) {
			return "<div class='thumbnail thumb-photo'></div>";
		},
		createElement: function (media, loading_message) {
			if (media.id.match("https://")) {
				media.id = media.id.replace("https://", "http://");
			}
			return "<div class='media-image media-shadow'><img src='" + media.id + "' class='media-image'></div>";
		}
	});

	VMM.ExternalAPI.addMediaType("googledocs", $.extend(VMM.ExternalAPI.googledocs, {
		assetTest: function (asset, media, d) {
			if (d) {
				if (VMM.FileExtention.googleDocType(d)) {
					return $.extend(media, {
						type: "googledoc",
						id: d
					});
				}
			}
		},
		thumbnail: function (media, uid) {
			return "<div class='thumbnail thumb-document'></div>";
		},
		createElement: function (media, loading_message) {
			var mediaElem;

			mediaElem = "<div class='media-frame media-shadow doc' id='" + media.uid + "'>" + loading_message + "</div>";
			VMM.ExternalAPI.googledocs.get(media);
			return mediaElem;
		}
	}));

	VMM.ExternalAPI.addMediaType("wikipedia", $.extend(VMM.ExternalAPI.wikipedia, {
		assetTest: function (asset, media, d) {
			var wiki_id;

			if (d) {
				if (d.match("(www.)?wikipedia.org")) {
					media.type = "wikipedia";
					wiki_id = d.split("wiki/")[1].split("#")[0].replace("_", " ");
					media.id = wiki_id.replace(" ", "%20");
					media.lang = d.split("//")[1].split(".wikipedia")[0];
					return media;
				}
			}
		},
		thumbnail: function (media, uid) {
			return "<div class='thumbnail thumb-wikipedia'></div>";
		},
		createElement: function (media, loading_message) {
			var mediaElem;

			mediaElem = "<div class='wikipedia' id='" + media.uid + "'>" + loading_message + "</div>";
			return VMM.ExternalAPI.wikipedia.get(media);
		},
		isTextMedia: true
	}));

	VMM.ExternalAPI.addMediaType("website", {
		assetTest: function (asset, media, d) {
			if (d) {
				if (d.indexOf("http://") === 0) {
					media.type = "website";
					media.id = d;
					media.mediaType = VMM.ExternalAPI.website;
					return media;
				}
			}
		},
		thumbnail: function (media, uid) {
			return "<div class='thumbnail thumb-website' id='" + uid + "_thumb'></div>";
		},
		createElement: function (media, loading_message) {
			var mediaElem;

			mediaElem = "<div class='media-shadow website' id='" + media.uid + "'>" + loading_message + "</div>";
			VMM.ExternalAPI.webthumb.get(media);
			return mediaElem;
		}
	});

	VMM.ExternalAPI.addMediaType("storify", {
		assetTest: function (asset, media, d) {
			if (d) {
				if (d.match("storify")) {
					media.type = "storify";
					media.id = d;
					return media;
				}
			}
		},
		thumbnail: function (media, uid) {
			return "<div class='thumbnail thumb-storify'></div>";
		},
		createElement: function (media, loading_message) {
			return "<div class='plain-text-quote'>" + media.id + "</div>";
		},
		isTextMedia: true
	});

	VMM.ExternalAPI.addMediaType("blockquote", {
		assetTest: function (asset, media, d) {
			if (d) {
				if (d.match("blockquote")) {
					media.type = "quote";
					media.id = d;
					return media;
				}
			}
		},
		thumbnail: function (media, uid) {
			return "<div class='thumbnail thumb-quote'></div>";
		},
		createElement: function (media, loading_message) {
			return "<div class='plain-text-quote'>" + media.id + "</div>";
		},
		isTextMedia: true
	});

	VMM.ExternalAPI.addMediaType("iframe", {
		assetTest: function (asset, media, d) {
			var group, regex;

			if (d) {
				if (d.match("iframe")) {
					media.type = "iframe";
					trace("IFRAME");
					regex = /src=['"](\S+?)['"]\s/;
					group = d.match(regex);
					if (group) {
						media.id = group[1];
					}
					trace("iframe url: " + media.id);
					if (Boolean(media.id)) {
						return media;
					} else {
						return false;
					}
				}
			}
		},
		thumbnail: function (media, uid) {
			return "<div class='thumbnail thumb-video'></div>";
		},
		createElement: function (media, loading_message) {
			return "<div class='media-shadow'><iframe class='media-frame video' autostart='false' frameborder='0' width='100%' height='100%' src='" + media.id + "'></iframe></div>";
		},
		isTextMedia: true
	});

	VMM.ExternalAPI.setUnknownMediaType("unknown", {
		assetTest: function (asset, media, d) {
			if (d) {
				trace("unknown media");
				return $.extend(media, {
					type: "unknown",
					id: d,
					mediaType: unknownMediaType
				});
			}
		},
		thumbnail: function (media, uid) {
			return "<div class='thumbnail thumb-plaintext'></div>";
		},
		createElement: function (media, loading_message) {
			trace("NO KNOWN MEDIA TYPE FOUND TRYING TO JUST PLACE THE HTML");
			return "<div class='plain-text'><div class='container'>" + VMM.Util.properQuotes(media.id) + "</div></div>";
		},
		isTextMedia: true
	});

}).call(this);



(function () {
	if (typeof VMM !== "undefined" && typeof VMM.MediaElement === "undefined") {
		VMM.MediaElement = {
			init: function () {
				return this;
			},
			loadingmessage: function (m) {
				return "<div class='vco-loading'><div class='vco-loading-container'><div class='vco-loading-icon'></div>" + "<div class='vco-message'><p>" + m + "</p></div></div></div>";
			},
			thumbnail: function (data, w, h, uid) {
				var m, _uid;

				_uid = "";
				if ((uid != null) && uid !== "") {
					_uid = uid;
				}
				if ((data.media != null) && data.media !== "") {
					m = VMM.ExternalAPI.mediaTypeFromAsset(data);
					if ((data.thumbnail != null) && data.thumbnail !== "") {
						trace("CUSTOM THUMB");
						return "<div class='thumbnail thumb-custom' id='" + uid + "_custom_thumb'><img src='" + data.thumbnail + "'></div>";
					} else {
						return m.mediaType.thumbnail(m, uid);
					}
				}
			},
			create: function (data, uid) {
				var captionElem, creditElem, loading_message, m, mediaElem, _id, _valid;

				_valid = false;
				loading_message = VMM.MediaElement.loadingmessage(VMM.master_config.language.messages.loading + "...");
				if ((data.media != null) && data.media !== "") {
					mediaElem = "";
					captionElem = "";
					creditElem = "";
					_id = "";
					m = void 0;
					m = VMM.ExternalAPI.mediaTypeFromAsset(data);
					m.uid = uid;
					_valid = true;
					if ((data.credit != null) && data.credit !== "") {
						creditElem = "<div class='credit'>" + VMM.Util.linkify_with_twitter(data.credit, "_blank") + "</div>";
					}
					if ((data.caption != null) && data.caption !== "") {
						captionElem = "<div class='caption'>" + VMM.Util.linkify_with_twitter(data.caption, "_blank") + "</div>";
					}
					mediaElem = "<div class='media-container' >" + m.mediaType.create(m, loading_message) + creditElem + captionElem + "</div>";
					if (m.mediaType.isTextMedia) {
						return "<div class='text-media'><div class='media-wrapper'>" + mediaElem + "</div></div>";
					} else {
						return "<div class='media-wrapper'>" + mediaElem + "</div>";
					}
				}
			}
		}.init();
	}

	if (typeof VMM !== "undefined" && typeof VMM.MediaElement === "undefined") {
		VMM.MediaElement = {
			init: function () {
				return this;
			},
			loadingmessage: function (m) {
				return "<div class='vco-loading'><div class='vco-loading-container'><div class='vco-loading-icon'></div>" + "<div class='vco-message'><p>" + m + "</p></div></div></div>";
			},
			thumbnail: function (data, w, h, uid) {
				var m, mediaElem, _h, _uid, _valid, _w;

				_w = 16;
				_h = 24;
				_uid = "";
				if ((w != null) && w !== "") {
					_w = w;
				}
				if ((h != null) && h !== "") {
					_h = h;
				}
				if ((uid != null) && uid !== "") {
					_uid = uid;
				}
				if ((data.media != null) && data.media !== "") {
					_valid = true;
					mediaElem = "";
					m = VMM.MediaType(data.media);
					if ((data.thumbnail != null) && data.thumbnail !== "") {
						trace("CUSTOM THUMB");
						mediaElem = "<div class='thumbnail thumb-custom' id='" + uid + "_custom_thumb'><img src='" + data.thumbnail + "'></div>";
						return mediaElem;
					} else if (m.type === "image") {
						mediaElem = "<div class='thumbnail thumb-photo'></div>";
						return mediaElem;
					} else if (m.type === "flickr") {
						mediaElem = "<div class='thumbnail thumb-photo' id='" + uid + "_thumb'></div>";
						return mediaElem;
					} else if (m.type === "instagram") {
						mediaElem = "<div class='thumbnail thumb-instagram' id='" + uid + "_thumb'><img src='" + VMM.ExternalAPI.instagram.get(m, true) + "'></div>";
						return mediaElem;
					} else if (m.type === "youtube") {
						mediaElem = "<div class='thumbnail thumb-youtube' id='" + uid + "_thumb'></div>";
						return mediaElem;
					} else if (m.type === "googledoc") {
						mediaElem = "<div class='thumbnail thumb-document'></div>";
						return mediaElem;
					} else if (m.type === "vimeo") {
						mediaElem = "<div class='thumbnail thumb-vimeo' id='" + uid + "_thumb'></div>";
						return mediaElem;
					} else if (m.type === "vine") {
						mediaElem = "<div class='thumbnail thumb-vine'></div>";
						return mediaElem;
					} else if (m.type === "dailymotion") {
						mediaElem = "<div class='thumbnail thumb-video'></div>";
						return mediaElem;
					} else if (m.type === "twitter") {
						mediaElem = "<div class='thumbnail thumb-twitter'></div>";
						return mediaElem;
					} else if (m.type === "twitter-ready") {
						mediaElem = "<div class='thumbnail thumb-twitter'></div>";
						return mediaElem;
					} else if (m.type === "soundcloud") {
						mediaElem = "<div class='thumbnail thumb-audio'></div>";
						return mediaElem;
					} else if (m.type === "google-map") {
						mediaElem = "<div class='thumbnail thumb-map'></div>";
						return mediaElem;
					} else if (m.type === "googleplus") {
						mediaElem = "<div class='thumbnail thumb-googleplus'></div>";
						return mediaElem;
					} else if (m.type === "wikipedia") {
						mediaElem = "<div class='thumbnail thumb-wikipedia'></div>";
						return mediaElem;
					} else if (m.type === "storify") {
						mediaElem = "<div class='thumbnail thumb-storify'></div>";
						return mediaElem;
					} else if (m.type === "quote") {
						mediaElem = "<div class='thumbnail thumb-quote'></div>";
						return mediaElem;
					} else if (m.type === "iframe") {
						mediaElem = "<div class='thumbnail thumb-video'></div>";
						return mediaElem;
					} else if (m.type === "unknown") {
						if (m.id.match("blockquote")) {
							mediaElem = "<div class='thumbnail thumb-quote'></div>";
						} else {
							mediaElem = "<div class='thumbnail thumb-plaintext'></div>";
						}
						return mediaElem;
					} else if (m.type === "website") {
						mediaElem = "<div class='thumbnail thumb-website' id='" + uid + "_thumb'></div>";
						return mediaElem;
					} else {
						mediaElem = "<div class='thumbnail thumb-plaintext'></div>";
						return mediaElem;
					}
				}
			},
			create: function (data, uid) {
				var captionElem, creditElem, isTextMedia, loading_messege, m, mediaElem, _id, _valid;

				_valid = false;
				loading_messege = VMM.MediaElement.loadingmessage(VMM.master_config.language.messages.loading + "...");
				if ((data.media != null) && data.media !== "") {
					mediaElem = "";
					captionElem = "";
					creditElem = "";
					_id = "";
					isTextMedia = false;
					m = void 0;
					m = VMM.MediaType(data.media);
					m.uid = uid;
					_valid = true;
					if ((data.credit != null) && data.credit !== "") {
						creditElem = "<div class='credit'>" + VMM.Util.linkify_with_twitter(data.credit, "_blank") + "</div>";
					}
					if ((data.caption != null) && data.caption !== "") {
						captionElem = "<div class='caption'>" + VMM.Util.linkify_with_twitter(data.caption, "_blank") + "</div>";
					}
					if (m.type === "image") {
						if (m.id.match("https://")) {
							m.id = m.id.replace("https://", "http://");
						}
						mediaElem = "<div class='media-image media-shadow'><img src='" + m.id + "' class='media-image'></div>";
					} else if (m.type === "flickr") {
						mediaElem = "<div class='media-image media-shadow'><a href='" + m.link + "' target='_blank'><img id='" + uid + "'></a></div>";
						VMM.ExternalAPI.flickr.get(m);
					} else if (m.type === "instagram") {
						mediaElem = "<div class='media-image media-shadow'><a href='" + m.link + "' target='_blank'><img src='" + VMM.ExternalAPI.instagram.get(m) + "'></a></div>";
					} else if (m.type === "googledoc") {
						mediaElem = "<div class='media-frame media-shadow doc' id='" + m.uid + "'>" + loading_messege + "</div>";
						VMM.ExternalAPI.googledocs.get(m);
					} else if (m.type === "youtube") {
						mediaElem = "<div class='media-shadow'><div class='media-frame video youtube' id='" + m.uid + "'>" + loading_messege + "</div></div>";
						VMM.ExternalAPI.youtube.get(m);
					} else if (m.type === "vimeo") {
						mediaElem = "<div class='media-shadow media-frame video vimeo' id='" + m.uid + "'>" + loading_messege + "</div>";
						VMM.ExternalAPI.vimeo.get(m);
					} else if (m.type === "dailymotion") {
						mediaElem = "<div class='media-shadow'><iframe class='media-frame video dailymotion' autostart='false' frameborder='0' width='100%' height='100%' src='http://www.dailymotion.com/embed/video/" + m.id + "'></iframe></div>";
					} else if (m.type === "vine") {
						mediaElem = "<div class='media-shadow media-frame video vine' id='" + m.uid + "'>" + loading_messege + "</div>";
						VMM.ExternalAPI.vine.get(m);
					} else if (m.type === "twitter") {
						mediaElem = "<div class='twitter' id='" + m.uid + "'>" + loading_messege + "</div>";
						isTextMedia = true;
						VMM.ExternalAPI.twitter.get(m);
					} else if (m.type === "twitter-ready") {
						isTextMedia = true;
						mediaElem = m.id;
					} else if (m.type === "soundcloud") {
						mediaElem = "<div class='media-frame media-shadow soundcloud' id='" + m.uid + "'>" + loading_messege + "</div>";
						VMM.ExternalAPI.soundcloud.get(m);
					} else if (m.type === "google-map") {
						mediaElem = "<div class='media-frame media-shadow map' id='" + m.uid + "'>" + loading_messege + "</div>";
						VMM.ExternalAPI.googlemaps.get(m);
					} else if (m.type === "googleplus") {
						_id = "googleplus_" + m.id;
						mediaElem = "<div class='googleplus' id='" + _id + "'>" + loading_messege + "</div>";
						isTextMedia = true;
						VMM.ExternalAPI.googleplus.get(m);
					} else if (m.type === "wikipedia") {
						mediaElem = "<div class='wikipedia' id='" + m.uid + "'>" + loading_messege + "</div>";
						isTextMedia = true;
						VMM.ExternalAPI.wikipedia.get(m);
					} else if (m.type === "storify") {
						isTextMedia = true;
						mediaElem = "<div class='plain-text-quote'>" + m.id + "</div>";
					} else if (m.type === "iframe") {
						isTextMedia = true;
						mediaElem = "<div class='media-shadow'><iframe class='media-frame video' autostart='false' frameborder='0' width='100%' height='100%' src='" + m.id + "'></iframe></div>";
					} else if (m.type === "quote") {
						isTextMedia = true;
						mediaElem = "<div class='plain-text-quote'>" + m.id + "</div>";
					} else if (m.type === "unknown") {
						trace("NO KNOWN MEDIA TYPE FOUND TRYING TO JUST PLACE THE HTML");
						isTextMedia = true;
						mediaElem = "<div class='plain-text'><div class='container'>" + VMM.Util.properQuotes(m.id) + "</div></div>";
					} else if (m.type === "website") {
						mediaElem = "<div class='media-shadow website' id='" + m.uid + "'>" + loading_messege + "</div>";
						VMM.ExternalAPI.webthumb.get(m);
					} else {
						trace("NO KNOWN MEDIA TYPE FOUND");
						trace(m.type);
					}
					mediaElem = "<div class='media-container' >" + mediaElem + creditElem + captionElem + "</div>";
					if (isTextMedia) {
						return "<div class='text-media'><div class='media-wrapper'>" + mediaElem + "</div></div>";
					} else {
						return "<div class='media-wrapper'>" + mediaElem + "</div>";
					}
				}
			}
		}.init();
	}

}).call(this);


(function () {
	if (typeof VMM !== "undefined" && typeof VMM.TextElement === "undefined") {
		VMM.TextElement = {
			init: function () {
				return this;
			},
			create: function (data) {
				return data;
			}
		}.init();
	}

}).call(this);
