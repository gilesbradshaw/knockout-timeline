(function() {
  define(["jquery", "VMM", "trace", "VMM.ExternalAPI"], function($, VMM, trace) {
    var mediaTypes, unknownMediaType;

    mediaTypes = [];
    unknownMediaType = void 0;
    $.extend(VMM.ExternalAPI, {
      insertMediaType: function(name, mediaType) {
        mediaType.name = name;
        VMM.ExternalAPI[name] = mediaType;
        return mediaTypes.unshift(mediaType);
      },
      addMediaType: function(name, mediaType) {
        mediaType.name = name;
        VMM.ExternalAPI[name] = mediaType;
        return mediaTypes.push(mediaType);
      },
      setUnknownMediaType: function(mediaType) {
        return unknownMediaType = mediaType;
      },
      mediaTypeFromAsset: function(asset) {
        var media, mediaId, mediaType, ret, _i, _len;

        media = function() {
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
      assetTest: function(asset, media, d) {
        if (d && d.match("div class='twitter'")) {
          return {
            id: d,
            mediaType: VMM.ExternalAPI["twitter-ready"]
          };
        }
      },
      thumbnail: function(media, uid) {
        return "<div class='thumbnail thumb-twitter'></div>";
      },
      createElement: function(media, loading_message) {
        return media.id;
      },
      isTextMedia: true
    });
    VMM.ExternalAPI.addMediaType("youtube", $.extend(VMM.ExternalAPI.youtube, {
      assetTest: function(asset, media, d) {
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
      thumbnail: function(media, uid) {
        return "<div class='thumbnail thumb-youtube' id='" + uid + "_thumb'></div>";
      },
      createElement: function(media, loading_message) {
        var mediaElem;

        mediaElem = "<div class='media-shadow'><div class='media-frame video youtube' id='" + media.uid + "'>" + loading_message + "</div></div>";
        VMM.ExternalAPI.youtube.get(media);
        return mediaElem;
      }
    }));
    VMM.ExternalAPI.addMediaType("vimeo", $.extend(VMM.ExternalAPI.vimeo, {
      assetTest: function(asset, media, d) {
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
      thumbnail: function(media, uid) {
        return "<div class='thumbnail thumb-vimeo' id='" + uid + "_thumb'></div>";
      },
      createElement: function(media, loading_message) {
        var mediaElem;

        mediaElem = "<div class='media-shadow media-frame video vimeo' id='" + media.uid + "'>" + loading_message + "</div>";
        VMM.ExternalAPI.vimeo.get(media);
        return mediaElem;
      }
    }));
    VMM.ExternalAPI.addMediaType("dailymotion", $.extend(VMM.ExternalAPI.dailymotion, {
      assetTest: function(asset, media, d) {
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
      thumbnail: function(media, uid) {
        return "<div class='thumbnail thumb-video'></div>";
      },
      createElement: function(media, loading_message) {
        return "<div class='media-shadow'><iframe class='media-frame video dailymotion' autostart='false' frameborder='0' width='100%' height='100%' src='http://www.dailymotion.com/embed/video/" + media.id + "'></iframe></div>";
      }
    }));
    VMM.ExternalAPI.addMediaType("vine", $.extend(VMM.ExternalAPI.vine, {
      assetTest: function(asset, media, d) {
        if (d) {
          if (d.match("(www.)?vine.co")) {
            trace("VINE");
            if (d.match("vine.co/v/")) {
              trace(d.split("vine.co/v/")[1]);
              return {
                id: d.split("vine.co/v/")[1],
                type: "vine",
                mediaType: VMM.ExternalAPI.vine
              };
            } else {
              return {
                type: "vine",
                mediaType: VMM.ExternalAPI.vine
              };
            }
          }
        }
      },
      thumbnail: function(media, uid) {
        return "<div class='thumbnail thumb-vine'></div>";
      },
      createElement: function(media, loading_message) {
        var mediaElem;

        mediaElem = "<div class='media-shadow media-frame video vine' id='" + media.uid + "'>" + loading_message + "</div>";
        VMM.ExternalAPI.vine.get(media);
        return mediaElem;
      }
    }));
    VMM.ExternalAPI.addMediaType("soundcloud", $.extend(VMM.ExternalAPI.soundcloud, {
      assetTest: function(asset, media, d) {
        if (d) {
          if (d.match("(player.)?soundcloud.com")) {
            return {
              id: d,
              type: "soundcloud",
              mediaType: VMM.ExternalAPI.soundcloud
            };
          }
        }
      },
      thumbnail: function(media, uid) {
        return "<div class='thumbnail thumb-audio'></div>";
      },
      createElement: function(media, loading_message) {
        var mediaElem;

        mediaElem = "<div class='media-frame media-shadow soundcloud' id='" + media.uid + "'>" + loading_message + "</div>";
        VMM.ExternalAPI.soundcloud.get(media);
        return mediaElem;
      }
    }));
    VMM.ExternalAPI.addMediaType("twitter", $.extend(VMM.ExternalAPI.twitter, {
      assetTest: function(asset, media, d) {
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
            media.mediaType = VMM.ExternalAPI.twitter;
            return media;
          }
        }
      },
      thumbnail: function(media, uid) {
        return "<div class='thumbnail thumb-twitter'></div>";
      },
      createElement: function(media, loading_message) {
        var mediaElem;

        mediaElem = "<div class='twitter' id='" + media.uid + "'>" + loading_message + "</div>";
        VMM.ExternalAPI.twitter.get(media);
        return mediaElem;
      },
      isTextMedia: true
    }));
    VMM.ExternalAPI.addMediaType("googlemaps", $.extend(VMM.ExternalAPI.googlemaps, {
      assetTest: function(asset, media, d) {
        if (d) {
          if (d.match("maps.google") && !d.match("staticmap")) {
            return $.extend(media, {
              type: "google-map",
              id: d.split(/src=['|"][^'|"]*?['|"]/g),
              mediaType: VMM.ExternalAPI.googlemaps
            });
          }
        }
      },
      thumbnail: function(media, uid) {
        return "<div class='thumbnail thumb-map'></div>";
      },
      createElement: function(media, loading_message) {
        var mediaElem;

        mediaElem = "<div class='media-frame media-shadow map' id='" + media.uid + "'>" + loading_message + "</div>";
        VMM.ExternalAPI.googlemaps.get(media);
        return mediaElem;
      }
    }));
    VMM.ExternalAPI.addMediaType("googleplus", $.extend(VMM.ExternalAPI.googleplus, {
      assetTest: function(asset, media, d) {
        if (d) {
          if (d.match("plus.google")) {
            media.type = "googleplus";
            media.id = d.split("/posts/")[1];
            media.mediaType = VMM.ExternalAPI.googleplus;
            if (d.split("/posts/")[0].match("u/0/")) {
              return media.user = d.split("u/0/")[1].split("/posts")[0];
            } else {
              return media.user = d.split("google.com/")[1].split("/posts/")[0];
            }
          }
        }
      },
      thumbnail: function(media, uid) {
        return "<div class='thumbnail thumb-googleplus'></div>";
      },
      createElement: function(media, loading_message) {
        var mediaElem;

        mediaElem = "<div class='googleplus' id='googleplus_" + media.id + "'>" + loading_message + "</div>";
        VMM.ExternalAPI.googleplus.get(media);
        return mediaElem;
      },
      isTextMedia: true
    }));
    VMM.ExternalAPI.addMediaType("flickr", $.extend(VMM.ExternalAPI.flickr, {
      assetTest: function(asset, media, d) {
        if (d) {
          if (d.match("flickr.com/photos/")) {
            media.type = "flickr";
            media.id = VMM.ExternalAPI.flickr.getFlickrIdFromUrl(d);
            media.link = d;
            media.mediaType = VMM.ExternalAPI.flickr;
            if (Boolean(media.id)) {
              return media;
            } else {
              return false;
            }
          }
        }
      },
      thumbnail: function(media, uid) {
        return "<div class='thumbnail thumb-photo' id='" + uid + "_thumb'></div>";
      },
      createElement: function(media, loading_message) {
        var mediaElem;

        mediaElem = "<div class='media-image media-shadow'><a href='" + media.link + "' target='_blank'><img id='" + media.uid + "'></a></div>";
        VMM.ExternalAPI.flickr.get(media);
        return mediaElem;
      }
    }));
    VMM.ExternalAPI.addMediaType("instagram", $.extend(VMM.ExternalAPI.instagram, {
      assetTest: function(asset, media, d) {
        if (d) {
          if (VMM.ExternalAPI.instagram.isInstagramUrl(d)) {
            media.type = "instagram";
            media.link = d;
            media.id = VMM.ExternalAPI.instagram.getInstagramIdFromUrl(d);
            media.mediaType = VMM.ExternalAPI.instagram;
            if (Boolean(media.id)) {
              return media;
            } else {
              return false;
            }
          }
        }
      },
      thumbnail: function(media, uid) {
        return "<div class='thumbnail thumb-instagram' id='" + uid + "_thumb'><img src='" + VMM.ExternalAPI.instagram.get(media, true) + "'></div>";
      },
      createElement: function(media, loading_message) {
        return "<div class='media-image media-shadow'><a href='" + media.link + "' target='_blank'><img src='" + VMM.ExternalAPI.instagram.get(media) + "'></a></div>";
      }
    }));
    VMM.ExternalAPI.addMediaType("image", {
      assetTest: function(asset, media, d) {
        if (d) {
          if (d.match(/jpg|jpeg|png|gif/i) || d.match("staticmap") || d.match("yfrog.com") || d.match("twitpic.com")) {
            return $.extend(media, {
              type: "image",
              id: d,
              mediaType: VMM.ExternalAPI.image
            });
          }
        }
      },
      thumbnail: function(media, uid) {
        return "<div class='thumbnail thumb-photo'></div>";
      },
      createElement: function(media, loading_message) {
        if (media.id.match("https://")) {
          media.id = media.id.replace("https://", "http://");
        }
        return "<div class='media-image media-shadow'><img src='" + media.id + "' class='media-image'></div>";
      }
    });
    VMM.ExternalAPI.addMediaType("googledocs", $.extend(VMM.ExternalAPI.googledocs, {
      assetTest: function(asset, media, d) {
        if (d) {
          if (VMM.FileExtention.googleDocType(d)) {
            return $.extend(media, {
              type: "googledoc",
              id: d,
              mediaType: VMM.ExternalAPI.googledocs
            });
          }
        }
      },
      thumbnail: function(media, uid) {
        return "<div class='thumbnail thumb-document'></div>";
      },
      createElement: function(media, loading_message) {
        var mediaElem;

        mediaElem = "<div class='media-frame media-shadow doc' id='" + media.uid + "'>" + loading_message + "</div>";
        VMM.ExternalAPI.googledocs.get(media);
        return mediaElem;
      }
    }));
    VMM.ExternalAPI.addMediaType("wikipedia", $.extend(VMM.ExternalAPI.wikipedia, {
      assetTest: function(asset, media, d) {
        var wiki_id;

        if (d) {
          if (d.match("(www.)?wikipedia.org")) {
            media.type = "wikipedia";
            wiki_id = d.split("wiki/")[1].split("#")[0].replace("_", " ");
            media.id = wiki_id.replace(" ", "%20");
            media.lang = d.split("//")[1].split(".wikipedia")[0];
            media.mediaType = VMM.ExternalAPI.wikipedia;
            return media;
          }
        }
      },
      thumbnail: function(media, uid) {
        return "<div class='thumbnail thumb-wikipedia'></div>";
      },
      createElement: function(media, loading_message) {
        var mediaElem;

        mediaElem = "<div class='wikipedia' id='" + media.uid + "'>" + loading_message + "</div>";
        return VMM.ExternalAPI.wikipedia.get(media);
      },
      isTextMedia: true
    }));
    VMM.ExternalAPI.addMediaType("website", {
      assetTest: function(asset, media, d) {
        if (d) {
          if (d.indexOf("http://") === 0) {
            media.type = "website";
            media.id = d;
            media.mediaType = VMM.ExternalAPI.website;
            return media;
          }
        }
      },
      thumbnail: function(media, uid) {
        return "<div class='thumbnail thumb-website' id='" + uid + "_thumb'></div>";
      },
      createElement: function(media, loading_message) {
        var mediaElem;

        mediaElem = "<div class='media-shadow website' id='" + media.uid + "'>" + loading_message + "</div>";
        VMM.ExternalAPI.webthumb.get(media);
        return mediaElem;
      }
    });
    VMM.ExternalAPI.addMediaType("storify", {
      assetTest: function(asset, media, d) {
        if (d) {
          if (d.match("storify")) {
            media.type = "storify";
            media.id = d;
            media.mediaType = VMM.ExternalAPI.storify;
            return media;
          }
        }
      },
      thumbnail: function(media, uid) {
        return "<div class='thumbnail thumb-storify'></div>";
      },
      createElement: function(media, loading_message) {
        return "<div class='plain-text-quote'>" + media.id + "</div>";
      },
      isTextMedia: true
    });
    VMM.ExternalAPI.addMediaType("blockquote", {
      assetTest: function(asset, media, d) {
        if (d) {
          if (d.match("blockquote")) {
            media.type = "quote";
            media.id = d;
            media.mediaType = VMM.ExternalAPI.blockquote;
            return media;
          }
        }
      },
      thumbnail: function(media, uid) {
        return "<div class='thumbnail thumb-quote'></div>";
      },
      createElement: function(media, loading_message) {
        return "<div class='plain-text-quote'>" + media.id + "</div>";
      },
      isTextMedia: true
    });
    VMM.ExternalAPI.addMediaType("iframe", {
      assetTest: function(asset, media, d) {
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
            media.mediaType = VMM.ExternalAPI.iframe;
            trace("iframe url: " + media.id);
            if (Boolean(media.id)) {
              return media;
            } else {
              return false;
            }
          }
        }
      },
      thumbnail: function(media, uid) {
        return "<div class='thumbnail thumb-video'></div>";
      },
      createElement: function(media, loading_message) {
        return "<div class='media-shadow'><iframe class='media-frame video' autostart='false' frameborder='0' width='100%' height='100%' src='" + media.id + "'></iframe></div>";
      },
      isTextMedia: true
    });
    return VMM.ExternalAPI.setUnknownMediaType("unknown", {
      assetTest: function(asset, media, d) {
        if (d) {
          trace("unknown media");
          return $.extend(media, {
            type: "unknown",
            id: d,
            mediaType: unknownMediaType
          });
        }
      },
      thumbnail: function(media, uid) {
        return "<div class='thumbnail thumb-plaintext'></div>";
      },
      createElement: function(media, loading_message) {
        trace("NO KNOWN MEDIA TYPE FOUND TRYING TO JUST PLACE THE HTML");
        return "<div class='plain-text'><div class='container'>" + VMM.Util.properQuotes(media.id) + "</div></div>";
      },
      isTextMedia: true
    });
  });

}).call(this);
