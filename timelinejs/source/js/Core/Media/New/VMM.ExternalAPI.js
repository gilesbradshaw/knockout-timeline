(function() {
  define(["global", "trace", "VMM.LoadLib", "VMM.Browser", "VMM.Date", "VMM.Library", "VMM.Util", "VMM.masterConfig"], function(global, trace, LoadLib, browser, vDate, library, util, masterConfig) {
    var ExternalAPI;

    global.onYouTubePlayerAPIReady = function() {
      trace("GLOBAL YOUTUBE API CALLED");
      ExternalAPI.youtube.onAPIReady();
    };
    return ExternalAPI = {
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
      init: function() {
        return this;
      },
      setKeys: function(d) {
        ExternalAPI.keys = d;
      },
      pushQues: function() {
        if (masterConfig.googlemaps.active) {
          ExternalAPI.googlemaps.pushQue();
        }
        if (masterConfig.youtube.active) {
          ExternalAPI.youtube.pushQue();
        }
        if (masterConfig.soundcloud.active) {
          ExternalAPI.soundcloud.pushQue();
        }
        if (masterConfig.googledocs.active) {
          ExternalAPI.googledocs.pushQue();
        }
        if (masterConfig.googleplus.active) {
          ExternalAPI.googleplus.pushQue();
        }
        if (masterConfig.wikipedia.active) {
          ExternalAPI.wikipedia.pushQue();
        }
        if (masterConfig.vimeo.active) {
          ExternalAPI.vimeo.pushQue();
        }
        if (masterConfig.vine.active) {
          ExternalAPI.vine.pushQue();
        }
        if (masterConfig.twitter.active) {
          ExternalAPI.twitter.pushQue();
        }
        if (masterConfig.flickr.active) {
          ExternalAPI.flickr.pushQue();
        }
        if (masterConfig.webthumb.active) {
          ExternalAPI.webthumb.pushQue();
        }
      },
      twitter: {
        tweetArray: [],
        get: function(m) {
          var tweet;

          tweet = {
            mid: m.id,
            id: m.uid
          };
          masterConfig.twitter.que.push(tweet);
          masterConfig.twitter.active = true;
        },
        create: function(tweet, callback) {
          var error_obj, id, the_url;

          id = tweet.mid.toString();
          error_obj = {
            twitterid: tweet.mid
          };
          the_url = "//api.twitter.com/1/statuses/show.json?id=" + tweet.mid + "&include_entities=true&callback=?";
          ExternalAPI.twitter.getOEmbed(tweet, callback);
        },
        errorTimeOut: function(tweet) {
          trace("TWITTER JSON ERROR TIMEOUT " + tweet.mid);
          library.attachElement("#" + tweet.id.toString(), library.loadingmessage("Still waiting on Twitter: " + tweet.mid));
          library.getJSON("//api.twitter.com/1/account/rate_limit_status.json", function(d) {
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
            library.attachElement("#" + tweet.id.toString(), library.loadingmessage(mes));
          });
        },
        errorTimeOutOembed: function(tweet) {
          trace("TWITTER JSON ERROR TIMEOUT " + tweet.mid);
          library.attachElement("#" + tweet.id.toString(), library.loadingmessage("Still waiting on Twitter: " + tweet.mid));
        },
        pushQue: function() {
          if (masterConfig.twitter.que.length > 0) {
            ExternalAPI.twitter.create(masterConfig.twitter.que[0], ExternalAPI.twitter.pushQue);
            util.removeRange(masterConfig.twitter.que, 0);
          }
        },
        getOEmbed: function(tweet, callback) {
          var the_url, twitter_timeout;

          the_url = "//api.twitter.com/1/statuses/oembed.json?id=" + tweet.mid + "&omit_script=true&include_entities=true&callback=?";
          twitter_timeout = setTimeout(ExternalAPI.twitter.errorTimeOutOembed, masterConfig.timers.api, tweet);
          library.getJSON(the_url, function(d) {
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
            library.attachElement("#" + tweet.id.toString(), twit);
            library.attachElement("#text_thumb_" + tweet.id.toString(), d.html);
            library.attachElement("#marker_content_" + tweet.id.toString(), d.html);
          }).error(function(jqXHR, textStatus, errorThrown) {
            trace("TWITTER error");
            trace("TWITTER ERROR: " + textStatus + " " + jqXHR.responseText);
            clearTimeout(twitter_timeout);
            library.attachElement("#" + tweet.id, library.loadingmessage("ERROR LOADING TWEET " + tweet.mid));
          }).success(function(d) {
            clearTimeout(twitter_timeout);
            callback();
          });
        },
        getHTML: function(id) {
          var the_url;

          the_url = "//api.twitter.com/1/statuses/oembed.json?id=" + id + "&omit_script=true&include_entities=true&callback=?";
          library.getJSON(the_url, ExternalAPI.twitter.onJSONLoaded);
        },
        onJSONLoaded: function(d) {
          var id;

          trace("TWITTER JSON LOADED");
          id = d.id;
          library.attachElement("#" + id, util.linkify_with_twitter(d.html));
        },
        parseTwitterDate: function(d) {
          var date;

          date = new Date(Date.parse(d));
          return date;
        },
        prettyParseTwitterDate: function(d) {
          var date;

          date = new Date(Date.parse(d));
          return vDate.prettyDate(date, true);
        },
        getTweets: function(tweets) {
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
            library.getJSON(the_url, function(d) {
              var td, the_tweets, tweet, twit;

              tweet = {};
              twit = "<div class='twitter'><blockquote><p>";
              td = util.linkify_with_twitter(d.text, "_blank");
              twit += td;
              twit += "</p>";
              twit += "— " + d.user.name + " (<a href='https://twitter.com/" + d.user.screen_name + "'>@" + d.user.screen_name + "</a>) <a href='https://twitter.com/" + d.user.screen_name + "/status/" + d.id + "'>" + ExternalAPI.twitter.prettyParseTwitterDate(d.created_at) + " </a></blockquote></div>";
              tweet.content = twit;
              tweet.raw = d;
              tweetArray.push(tweet);
              if (tweetArray.length === number_of_tweets) {
                the_tweets = {
                  tweetdata: tweetArray
                };
                library.fireEvent(global, "TWEETSLOADED", the_tweets);
              }
            }).success(function() {
              trace("second success");
            }).error(function() {
              trace("error");
            }).complete(function() {
              trace("complete");
            });
            i++;
          }
        },
        getTweetSearch: function(tweets, number_of_tweets) {
          var the_url, tweetArray, _number_of_tweets;

          _number_of_tweets = 40;
          if ((number_of_tweets != null) && number_of_tweets !== "") {
            _number_of_tweets = number_of_tweets;
          }
          the_url = "//search.twitter.com/search.json?q=" + tweets + "&rpp=" + _number_of_tweets + "&include_entities=true&result_type=mixed";
          tweetArray = [];
          library.getJSON(the_url, function(d) {
            var i, td, the_tweets, tweet, twit;

            i = 0;
            while (i < d.results.length) {
              tweet = {};
              twit = "<div class='twitter'><blockquote><p>";
              td = util.linkify_with_twitter(d.results[i].text, "_blank");
              twit += td;
              twit += "</p>";
              twit += "— " + d.results[i].from_user_name + " (<a href='https://twitter.com/" + d.results[i].from_user + "'>@" + d.results[i].from_user + "</a>) <a href='https://twitter.com/" + d.results[i].from_user + "/status/" + d.id + "'>" + ExternalAPI.twitter.prettyParseTwitterDate(d.results[i].created_at) + " </a></blockquote></div>";
              tweet.content = twit;
              tweet.raw = d.results[i];
              tweetArray.push(tweet);
              i++;
            }
            the_tweets = {
              tweetdata: tweetArray
            };
            library.fireEvent(global, "TWEETSLOADED", the_tweets);
          });
        },
        prettyHTML: function(id, secondary) {
          var error_obj, the_url, twitter_timeout;

          id = id.toString();
          error_obj = {
            twitterid: id
          };
          the_url = "//api.twitter.com/1/statuses/show.json?id=" + id + "&include_entities=true&callback=?";
          twitter_timeout = setTimeout(ExternalAPI.twitter.errorTimeOut, masterConfig.timers.api, id);
          library.getJSON(the_url, ExternalAPI.twitter.formatJSON).error(function(jqXHR, textStatus, errorThrown) {
            trace("TWITTER error");
            trace("TWITTER ERROR: " + textStatus + " " + jqXHR.responseText);
            library.attachElement("#twitter_" + id, "<p>ERROR LOADING TWEET " + id + "</p>");
          }).success(function(d) {
            clearTimeout(twitter_timeout);
            if (secondary) {
              ExternalAPI.twitter.secondaryMedia(d);
            }
          });
        },
        formatJSON: function(d) {
          var id, td, twit;

          id = d.id_str;
          twit = "<blockquote><p>";
          td = util.linkify_with_twitter(d.text, "_blank");
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
          library.attachElement("#twitter_" + id.toString(), twit);
          library.attachElement("#text_thumb_" + id.toString(), d.text);
        }
      },
      googlemaps: {
        maptype: "TERRAIN",
        setMapType: function(d) {
          if (d !== "") {
            ExternalAPI.googlemaps.maptype = d;
          }
        },
        get: function(m) {
          var api_key, dontcrashjs2coffee, map_url, timer;

          timer = void 0;
          api_key = void 0;
          map_url = void 0;
          m.vars = util.getUrlVars(m.id);
          if (ExternalAPI.keys.google !== "") {
            api_key = ExternalAPI.keys.google;
          } else {
            api_key = Aes.Ctr.decrypt(ExternalAPI.keys_master.google, ExternalAPI.keys_master.vp, 256);
          }
          map_url = "//maps.googleapis.com/maps/api/js?key=" + api_key + "&v=3.9&libraries=places&sensor=false&callback=ExternalAPI.googlemaps.onMapAPIReady";
          if (masterConfig.googlemaps.active) {
            masterConfig.googlemaps.que.push(m);
          } else {
            masterConfig.googlemaps.que.push(m);
            if (masterConfig.googlemaps.api_loaded) {
              dontcrashjs2coffee = 0;
            } else {
              LoadLib.js(map_url, function() {
                trace("Google Maps API Library Loaded");
              });
            }
          }
        },
        create: function(m) {
          ExternalAPI.googlemaps.createAPIMap(m);
        },
        createiFrameMap: function(m) {
          var embed_url, mc, unique_map_id;

          embed_url = m.id + "&output=embed";
          mc = "";
          unique_map_id = m.uid.toString() + "_gmap";
          mc += "<div class='google-map' id='" + unique_map_id + "' style='width=100%;height=100%;'>";
          mc += "<iframe width='100%' height='100%' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='" + embed_url + "'></iframe>";
          mc += "</div>";
          library.attachElement("#" + m.uid, mc);
        },
        createAPIMap: function(m) {
          var api_limit, dontcrashjs2coffee, geocodePlace, has_location, has_zoom, latlong, layer, loadKML, loadPlaces, loadPlacesAlt, location, map, mapProvider, map_attribution, map_attribution_html, map_bounds, map_options, unique_map_id, zoom;

          mapProvider = function(name) {
            var map_attribution;

            if (name in ExternalAPI.googlemaps.map_providers) {
              map_attribution = ExternalAPI.googlemaps.map_attribution[ExternalAPI.googlemaps.map_providers[name].attribution];
              ExternalAPI.googlemaps.map_providers[name];
            } else {
              if (ExternalAPI.googlemaps.defaultType(name)) {
                trace("GOOGLE MAP DEFAULT TYPE");
                google.maps.MapTypeId[name.toUpperCase()];
              } else {
                trace("Not a maptype: " + name);
              }
            }
          };
          geocodePlace = function() {
            var address, address_latlon, geocoder, has_location, location, marker;

            geocoder = new google.maps.Geocoder();
            address = util.getUrlVars(m.id)["q"];
            marker = void 0;
            if (address.match("loc:")) {
              address_latlon = address.split(":")[1].split("+");
              location = new google.maps.LatLng(parseFloat(address_latlon[0]), parseFloat(address_latlon[1]));
              has_location = true;
            }
            geocoder.geocode({
              address: address
            }, function(results, status) {
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
          loadPlaces = function() {
            var bounds_ne, bounds_sw, createMarker, infowindow, place, placeResults, place_search, search_bounds, search_request;

            placeResults = function(results, status) {
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
                  ExternalAPI.googlemaps.createiFrameMap(m);
                }
              }
            };
            createMarker = function(place) {
              var marker, placeLoc;

              marker = void 0;
              placeLoc = void 0;
              placeLoc = place.geometry.location;
              marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
              });
              google.maps.event.addListener(marker, "click", function() {
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
            if (type.of(util.getUrlVars(m.id)["q"]) === "string") {
              search_request.query = util.getUrlVars(m.id)["q"];
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
          loadPlacesAlt = function() {
            var api_key, has_key, places_url;

            api_key = void 0;
            places_url = void 0;
            has_key = false;
            trace("LOADING PLACES API FOR GOOGLE MAPS");
            if (ExternalAPI.keys.google !== "") {
              api_key = ExternalAPI.keys.google;
              has_key = true;
            } else {
              trace("YOU NEED A GOOGLE MAPS API KEY IN ORDER TO USE THIS FEATURE OF TIMELINEJS");
              trace("FIND OUT HOW TO GET YOUR KEY HERE: https://developers.google.com/places/documentation/#Authentication");
            }
            places_url = "https://maps.googleapis.com/maps/api/place/textsearch/json?key=" + api_key + "&sensor=false&language=" + m.lang + "&";
            if (type.of(util.getUrlVars(m.id)["q"]) === "string") {
              places_url += "query=" + util.getUrlVars(m.id)["q"];
            }
            if (has_location) {
              places_url += "&location=" + location;
            }
            if (has_key) {
              library.getJSON(places_url, function(d) {
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
                    ExternalAPI.googlemaps.createiFrameMap(m);
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
              }).error(function(jqXHR, textStatus, errorThrown) {
                trace("PLACES JSON ERROR");
                trace("PLACES JSON ERROR: " + textStatus + " " + jqXHR.responseText);
              }).success(function(d) {
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
                ExternalAPI.googlemaps.createiFrameMap(m);
              }
            }
          };
          loadKML = function() {
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
            google.maps.event.addListenerOnce(kml_layer, "defaultviewport_changed", function() {
              if (has_location) {
                map.panTo(location);
              } else {
                map.fitBounds(kml_layer.getDefaultViewport());
              }
              if (has_zoom) {
                map.setZoom(zoom);
              }
            });
            google.maps.event.addListener(kml_layer, "click", function(kmlEvent) {
              var showInfoWindow;

              showInfoWindow = function(c) {
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
          google.maps.VeriteMapType = function(name) {
            var provider;

            if (ExternalAPI.googlemaps.defaultType(name)) {
              return google.maps.MapTypeId[name.toUpperCase()];
            } else {
              provider = mapProvider(name);
              return google.maps.ImageMapType.call(this, {
                getTileUrl: function(coord, zoom) {
                  var index, retURL;

                  index = (zoom + coord.x + coord.y) % ExternalAPI.googlemaps.map_subdomains.length;
                  retURL = provider.url.replace("{S}", ExternalAPI.googlemaps.map_subdomains[index]).replace("{Z}", zoom).replace("{X}", coord.x).replace("{Y}", coord.y).replace("{z}", zoom).replace("{x}", coord.x).replace("{y}", coord.y);
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
          if (ExternalAPI.googlemaps.maptype !== "") {
            if (ExternalAPI.googlemaps.defaultType(ExternalAPI.googlemaps.maptype)) {
              layer = google.maps.MapTypeId[ExternalAPI.googlemaps.maptype.toUpperCase()];
            } else {
              layer = ExternalAPI.googlemaps.maptype;
            }
          } else {
            layer = google.maps.MapTypeId["TERRAIN"];
          }
          if (type.of(util.getUrlVars(m.id)["ll"]) === "string") {
            has_location = true;
            latlong = util.getUrlVars(m.id)["ll"].split(",");
            location = new google.maps.LatLng(parseFloat(latlong[0]), parseFloat(latlong[1]));
          } else if (type.of(util.getUrlVars(m.id)["sll"]) === "string") {
            latlong = util.getUrlVars(m.id)["sll"].split(",");
            location = new google.maps.LatLng(parseFloat(latlong[0]), parseFloat(latlong[1]));
          }
          if (type.of(util.getUrlVars(m.id)["z"]) === "string") {
            has_zoom = true;
            zoom = parseFloat(util.getUrlVars(m.id)["z"]);
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
          library.attachElement("#" + m.uid, "<div class='google-map' id='" + unique_map_id + "' style='width=100%;height=100%;'></div>");
          map = new google.maps.Map(document.getElementById(unique_map_id), map_options);
          if (ExternalAPI.googlemaps.defaultType(ExternalAPI.googlemaps.maptype)) {
            dontcrashjs2coffee = 0;
          } else {
            map.mapTypes.set(layer, new google.maps.VeriteMapType(layer));
            map_attribution_html = "<div class='map-attribution'><div class='attribution-text'>" + map_attribution + "</div></div>";
            library.appendElement("#" + unique_map_id, map_attribution_html);
          }
          if (type.of(util.getUrlVars(m.id)["msid"]) === "string") {
            loadKML();
          } else {
            if (type.of(util.getUrlVars(m.id)["q"]) === "string") {
              geocodePlace();
            }
          }
        },
        pushQue: function() {
          var i;

          i = 0;
          while (i < masterConfig.googlemaps.que.length) {
            ExternalAPI.googlemaps.create(masterConfig.googlemaps.que[i]);
            i++;
          }
          masterConfig.googlemaps.que = [];
        },
        onMapAPIReady: function() {
          masterConfig.googlemaps.map_active = true;
          masterConfig.googlemaps.places_active = true;
          ExternalAPI.googlemaps.onAPIReady();
        },
        onPlacesAPIReady: function() {
          masterConfig.googlemaps.places_active = true;
          ExternalAPI.googlemaps.onAPIReady();
        },
        onAPIReady: function() {
          if (!masterConfig.googlemaps.active) {
            if (masterConfig.googlemaps.map_active && masterConfig.googlemaps.places_active) {
              masterConfig.googlemaps.active = true;
              ExternalAPI.googlemaps.pushQue();
            }
          }
        },
        defaultType: function(name) {
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
        get: function(m) {
          var api_key, gplus;

          api_key = void 0;
          gplus = {
            user: m.user,
            activity: m.id,
            id: m.uid
          };
          masterConfig.googleplus.que.push(gplus);
          masterConfig.googleplus.active = true;
        },
        create: function(gplus, callback) {
          var api_key, callback_timeout, g_activity, g_attachments, g_content, gactivity_api_url, googleplus_timeout, gperson_api_url, mediaElem;

          mediaElem = "";
          api_key = "";
          g_activity = "";
          g_content = "";
          g_attachments = "";
          gperson_api_url = void 0;
          gactivity_api_url = void 0;
          googleplus_timeout = setTimeout(ExternalAPI.googleplus.errorTimeOut, masterConfig.timers.api, gplus);
          callback_timeout = setTimeout(callback, masterConfig.timers.api, gplus);
          if (masterConfig.Timeline.api_keys.google !== "") {
            api_key = masterConfig.Timeline.api_keys.google;
          } else {
            api_key = Aes.Ctr.decrypt(masterConfig.api_keys_master.google, masterConfig.vp, 256);
          }
          gperson_api_url = "https://www.googleapis.com/plus/v1/people/" + gplus.user + "/activities/public?alt=json&maxResults=100&fields=items(id,url)&key=" + api_key;
          mediaElem = "GOOGLE PLUS API CALL";
          library.getJSON(gperson_api_url, function(p_data) {
            var i;

            i = 0;
            while (i < p_data.items.length) {
              trace("loop");
              if (p_data.items[i].url.split("posts/")[1] === gplus.activity) {
                trace("FOUND IT!!");
                g_activity = p_data.items[i].id;
                gactivity_api_url = "https://www.googleapis.com/plus/v1/activities/" + g_activity + "?alt=json&key=" + api_key;
                library.getJSON(gactivity_api_url, function(a_data) {
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
                  library.attachElement("#googleplus_" + gplus.activity, mediaElem);
                });
                break;
              }
              i++;
            }
          }).error(function(jqXHR, textStatus, errorThrown) {
            var error_obj;

            error_obj = library.parseJSON(jqXHR.responseText);
            trace(error_obj.error.message);
            library.attachElement("#googleplus_" + gplus.activity, library.loadingmessage("<p>ERROR LOADING GOOGLE+ </p><p>" + error_obj.error.message + "</p>"));
          }).success(function(d) {
            clearTimeout(googleplus_timeout);
            clearTimeout(callback_timeout);
            callback();
          });
        },
        pushQue: function() {
          if (masterConfig.googleplus.que.length > 0) {
            ExternalAPI.googleplus.create(masterConfig.googleplus.que[0], ExternalAPI.googleplus.pushQue);
            util.removeRange(masterConfig.googleplus.que, 0);
          }
        },
        errorTimeOut: function(gplus) {
          trace("GOOGLE+ JSON ERROR TIMEOUT " + gplus.activity);
          library.attachElement("#googleplus_" + gplus.activity, library.loadingmessage("<p>Still waiting on GOOGLE+ </p><p>" + gplus.activity + "</p>"));
        }
      },
      googledocs: {
        get: function(m) {
          masterConfig.googledocs.que.push(m);
          masterConfig.googledocs.active = true;
        },
        create: function(m) {
          var mediaElem;

          mediaElem = "";
          if (m.id.match(/docs.google.com/i)) {
            mediaElem = "<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + m.id + "&amp;embedded=true'></iframe>";
          } else {
            mediaElem = "<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + "//docs.google.com/viewer?url=" + m.id + "&amp;embedded=true'></iframe>";
          }
          library.attachElement("#" + m.uid, mediaElem);
        },
        pushQue: function() {
          var i;

          i = 0;
          while (i < masterConfig.googledocs.que.length) {
            ExternalAPI.googledocs.create(masterConfig.googledocs.que[i]);
            i++;
          }
          masterConfig.googledocs.que = [];
        }
      },
      flickr: {
        get: function(m) {
          masterConfig.flickr.que.push(m);
          masterConfig.flickr.active = true;
        },
        create: function(m, callback) {
          var api_key, callback_timeout, the_url;

          api_key = void 0;
          callback_timeout = setTimeout(callback, masterConfig.timers.api, m);
          if (typeof masterConfig.Timeline !== "undefined" && masterConfig.Timeline.api_keys.flickr !== "") {
            api_key = masterConfig.Timeline.api_keys.flickr;
          } else {
            api_key = Aes.Ctr.decrypt(masterConfig.api_keys_master.flickr, masterConfig.vp, 256);
          }
          the_url = "//api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + api_key + "&photo_id=" + m.id + "&format=json&jsoncallback=?";
          library.getJSON(the_url, function(d) {
            var flickr_best_size, flickr_id, flickr_img_size, flickr_img_thumb, flickr_large_id, flickr_size_found, flickr_thumb_id, i;

            flickr_id = ExternalAPI.flickr.getFlickrIdFromUrl(d.sizes.size[0].url);
            flickr_large_id = "#" + m.uid;
            flickr_thumb_id = "#" + m.uid + "_thumb";
            flickr_img_size = void 0;
            flickr_img_thumb = void 0;
            flickr_size_found = false;
            flickr_best_size = "Large";
            flickr_best_size = ExternalAPI.flickr.sizes(masterConfig.sizes.api.height);
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
            library.attr(flickr_large_id, "src", flickr_img_size);
            library.attachElement(flickr_thumb_id, "<img src='" + flickr_img_thumb + "'>");
          }).error(function(jqXHR, textStatus, errorThrown) {
            trace("FLICKR error");
            trace("FLICKR ERROR: " + textStatus + " " + jqXHR.responseText);
          }).success(function(d) {
            clearTimeout(callback_timeout);
            callback();
          });
        },
        pushQue: function() {
          if (masterConfig.flickr.que.length > 0) {
            ExternalAPI.flickr.create(masterConfig.flickr.que[0], ExternalAPI.flickr.pushQue);
            util.removeRange(masterConfig.flickr.que, 0);
          }
        },
        sizes: function(s) {
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
        getFlickrIdFromUrl: function(url) {
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
        get: function(m, thumb) {
          if (thumb) {
            return "//instagr.am/p/" + m.id + "/media/?size=t";
          } else {
            return "//instagr.am/p/" + m.id + "/media/?size=" + ExternalAPI.instagram.sizes(masterConfig.sizes.api.height);
          }
        },
        sizes: function(s) {
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
        isInstagramUrl: function(url) {
          return url.match("instagr.am/p/") || url.match("instagram.com/p/");
        },
        getInstagramIdFromUrl: function(url) {
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
        get: function(m) {
          masterConfig.soundcloud.que.push(m);
          masterConfig.soundcloud.active = true;
        },
        create: function(m, callback) {
          var the_url;

          the_url = "//soundcloud.com/oembed?url=" + m.id + "&format=js&callback=?";
          library.getJSON(the_url, function(d) {
            library.attachElement("#" + m.uid, d.html);
            callback();
          });
        },
        pushQue: function() {
          if (masterConfig.soundcloud.que.length > 0) {
            ExternalAPI.soundcloud.create(masterConfig.soundcloud.que[0], ExternalAPI.soundcloud.pushQue);
            util.removeRange(masterConfig.soundcloud.que, 0);
          }
        }
      },
      wikipedia: {
        get: function(m) {
          masterConfig.wikipedia.que.push(m);
          masterConfig.wikipedia.active = true;
        },
        create: function(m, callback) {
          var callback_timeout, temp_text, the_url;

          the_url = "//" + m.lang + ".wikipedia.org/w/api.php?action=query&prop=extracts&redirects=&titles=" + m.id + "&exintro=1&format=json&callback=?";
          callback_timeout = setTimeout(callback, masterConfig.timers.api, m);
          if (browser.browser === "Explorer" && parseInt(browser.version, 10) >= 7 && window.XDomainRequest) {
            temp_text = "<h4><a href='http://" + masterConfig.language.api.wikipedia + ".wikipedia.org/wiki/" + m.id + "' target='_blank'>" + m.url + "</a></h4>";
            temp_text += "<span class='wiki-source'>" + masterConfig.language.messages.wikipedia + "</span>";
            temp_text += "<p>Wikipedia entry unable to load using Internet Explorer 8 or below.</p>";
            library.attachElement("#" + m.uid, temp_text);
          }
          library.getJSON(the_url, function(d) {
            var don, i, tcrashjs2coffee, wiki_extract, wiki_number_of_paragraphs, wiki_text, wiki_text_array, wiki_title, _wiki;

            if (d.query) {
              wiki_extract = void 0;
              wiki_title = void 0;
              _wiki = "";
              wiki_text = "";
              wiki_number_of_paragraphs = 1;
              wiki_text_array = [];
              wiki_extract = util.getObjectAttributeByIndex(d.query.pages, 0).extract;
              wiki_title = util.getObjectAttributeByIndex(d.query.pages, 0).title;
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
              _wiki = "<h4><a href='http://" + masterConfig.language.api.wikipedia + ".wikipedia.org/wiki/" + wiki_title + "' target='_blank'>" + wiki_title + "</a></h4>";
              _wiki += "<span class='wiki-source'>" + masterConfig.language.messages.wikipedia + "</span>";
              _wiki += util.linkify_wikipedia(wiki_text);
              if (wiki_extract.match("REDIRECT")) {
                don = void 0;
                tcrashjs2coffee = 0;
              } else {
                library.attachElement("#" + m.uid, _wiki);
              }
            }
          }).error(function(jqXHR, textStatus, errorThrown) {
            trace("WIKIPEDIA error");
            trace("WIKIPEDIA ERROR: " + textStatus + " " + jqXHR.responseText);
            trace(errorThrown);
            library.attachElement("#" + m.uid, library.loadingmessage("<p>Wikipedia is not responding</p>"));
            clearTimeout(callback_timeout);
            if (masterConfig.wikipedia.tries < 4) {
              trace("WIKIPEDIA ATTEMPT " + masterConfig.wikipedia.tries);
              trace(m);
              masterConfig.wikipedia.tries++;
              ExternalAPI.wikipedia.create(m, callback);
            } else {
              callback();
            }
          }).success(function(d) {
            masterConfig.wikipedia.tries = 0;
            clearTimeout(callback_timeout);
            callback();
          });
        },
        pushQue: function() {
          if (masterConfig.wikipedia.que.length > 0) {
            trace("WIKIPEDIA PUSH QUE " + masterConfig.wikipedia.que.length);
            ExternalAPI.wikipedia.create(masterConfig.wikipedia.que[0], ExternalAPI.wikipedia.pushQue);
            util.removeRange(masterConfig.wikipedia.que, 0);
          }
        }
      },
      youtube: {
        get: function(m) {
          var the_url;

          the_url = "//gdata.youtube.com/feeds/api/videos/" + m.id + "?v=2&alt=jsonc&callback=?";
          masterConfig.youtube.que.push(m);
          if (!masterConfig.youtube.active) {
            if (!masterConfig.youtube.api_loaded) {
              LoadLib.js("//www.youtube.com/player_api", function() {
                trace("YouTube API Library Loaded");
              });
            }
          }
          library.getJSON(the_url, function(d) {
            ExternalAPI.youtube.createThumb(d, m);
          });
        },
        create: function(m) {
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
              onReady: ExternalAPI.youtube.onPlayerReady,
              onStateChange: ExternalAPI.youtube.onStateChange
            }
          });
          masterConfig.youtube.array.push(p);
        },
        createThumb: function(d, m) {
          var thumb_id;

          trace("CREATE THUMB");
          trace(d);
          trace(m);
          if (typeof d.data !== "undefined") {
            thumb_id = "#" + m.uid + "_thumb";
            library.attachElement(thumb_id, "<img src='" + d.data.thumbnail.sqDefault + "'>");
          }
        },
        pushQue: function() {
          var i;

          i = 0;
          while (i < masterConfig.youtube.que.length) {
            ExternalAPI.youtube.create(masterConfig.youtube.que[i]);
            i++;
          }
          masterConfig.youtube.que = [];
        },
        onAPIReady: function() {
          masterConfig.youtube.active = true;
          ExternalAPI.youtube.pushQue();
        },
        stopPlayers: function() {
          var i;

          i = 0;
          while (i < masterConfig.youtube.array.length) {
            if (masterConfig.youtube.array[i].playing) {
              masterConfig.youtube.array[i].player[Object.keys(masterConfig.youtube.array[i].player)[0]].stopVideo();
            }
            i++;
          }
        },
        onStateChange: function(e) {
          var dontcrashjs2coffee, i;

          i = 0;
          while (i < masterConfig.youtube.array.length) {
            if (masterConfig.youtube.array[i].player[Object.keys(masterConfig.youtube.array[i].player)[0]] === e.target) {
              if (e.data === YT.PlayerState.PLAYING) {
                masterConfig.youtube.array[i].playing = true;
                trace(masterConfig.youtube.array[i].hd);
                if (masterConfig.youtube.array[i].hd) {
                  dontcrashjs2coffee = 0;
                }
              }
            }
            i++;
          }
        },
        onPlayerReady: function(e) {}
      },
      vimeo: {
        get: function(m) {
          masterConfig.vimeo.que.push(m);
          masterConfig.vimeo.active = true;
        },
        create: function(m, callback) {
          var thumb_url, video_url;

          trace("VIMEO CREATE");
          thumb_url = "//vimeo.com/api/v2/video/" + m.id + ".json";
          video_url = "//player.vimeo.com/video/" + m.id + "?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff";
          library.getJSON(thumb_url, function(d) {
            ExternalAPI.vimeo.createThumb(d, m);
            callback();
          });
          library.attachElement("#" + m.uid, "<iframe autostart='false' frameborder='0' width='100%' height='100%' src='" + video_url + "'></iframe>");
        },
        createThumb: function(d, m) {
          var thumb_id;

          trace("VIMEO CREATE THUMB");
          thumb_id = "#" + m.uid + "_thumb";
          library.attachElement(thumb_id, "<img src='" + d[0].thumbnail_small + "'>");
        },
        pushQue: function() {
          if (masterConfig.vimeo.que.length > 0) {
            ExternalAPI.vimeo.create(masterConfig.vimeo.que[0], ExternalAPI.vimeo.pushQue);
            util.removeRange(masterConfig.vimeo.que, 0);
          }
        }
      },
      vine: {
        get: function(m) {
          masterConfig.vine.que.push(m);
          masterConfig.vine.active = true;
        },
        create: function(m, callback) {
          var video_url;

          trace("VINE CREATE");
          video_url = "https://vine.co/v/" + m.id + "/embed/simple";
          library.attachElement("#" + m.uid, "<iframe frameborder='0' width='100%' height='100%' src='" + video_url + "'></iframe><script async src='http://platform.vine.co/static/scripts/embed.js' charset='utf-8'></script>");
        },
        pushQue: function() {
          if (masterConfig.vine.que.length > 0) {
            ExternalAPI.vine.create(masterConfig.vine.que[0], ExternalAPI.vine.pushQue);
            util.removeRange(masterConfig.vine.que, 0);
          }
        }
      },
      webthumb: {
        get: function(m, thumb) {
          masterConfig.webthumb.que.push(m);
          masterConfig.webthumb.active = true;
        },
        sizes: function(s) {
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
        create: function(m) {
          var thumb_url, url;

          trace("WEB THUMB CREATE");
          thumb_url = "//api.pagepeeker.com/v2/thumbs.php?";
          url = m.id.replace("http://", "");
          library.attachElement("#" + m.uid, "<a href='" + m.id + "' target='_blank'><img src='" + thumb_url + "size=x&url=" + url + "'></a>");
          library.attachElement("#" + m.uid + "_thumb", "<img src='" + thumb_url + "size=t&url=" + url + "'>");
        },
        pushQue: function() {
          var i;

          i = 0;
          while (i < masterConfig.webthumb.que.length) {
            ExternalAPI.webthumb.create(masterConfig.webthumb.que[i]);
            i++;
          }
          masterConfig.webthumb.que = [];
        }
      }
    }.init();
  });

}).call(this);
