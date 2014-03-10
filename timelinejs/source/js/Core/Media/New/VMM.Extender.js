(function() {
  define(["jquery", "trace", "VMM.FileExtension", "VMM.Util", "VMM.ExternalAPI", "VMM.Language"], function($, trace, fileExtension, util, ExternalAPI, language) {
    var addFlags, mediaTypes, unknownMediaType;

    mediaTypes = [];
    unknownMediaType = void 0;
    addFlags = function(mediaType) {
      return $.extend(mediaType, {
        flags: {
          active: false,
          array: [],
          api_loaded: false,
          queue: []
        }
      });
    };
    $.extend(ExternalAPI, {
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
      pushQueues: function() {
        var mediaType, _i, _len;

        for (_i = 0, _len = mediaTypes.length; _i < _len; _i++) {
          mediaType = mediaTypes[_i];
          if (mediaType.pushQueue && mediaType.flags.active) {
            mediaType.pushQueue();
          }
        }
        if (unknownMediaType.pushQueue && unknownMediaType.flags.active) {
          return unknownMediaType.pushQueue();
        }
      },
      configure: function(config) {
        var mediaType, _i, _len;

        for (_i = 0, _len = mediaTypes.length; _i < _len; _i++) {
          mediaType = mediaTypes[_i];
          if (mediaType.configure) {
            mediaType.configure(config);
          }
        }
        if (unknownMediaType.configure) {
          return unknownMediaType.configure(config);
        }
      },
      stopPlayers: function() {
        var mediaType, _i, _len;

        for (_i = 0, _len = mediaTypes.length; _i < _len; _i++) {
          mediaType = mediaTypes[_i];
          if (mediaType.stopPlayers) {
            mediaType.stopPlayers();
          }
        }
        if (unknownMediaType.stopPlayers) {
          return unknownMediaType.stopPlayers();
        }
      },
      insertMediaType: function(name, mediaType) {
        mediaType.name = name;
        ExternalAPI[name] = addFlags(mediaType);
        return mediaTypes.unshift(mediaType);
      },
      addMediaType: function(name, mediaType) {
        mediaType.name = name;
        ExternalAPI[name] = addFlags(mediaType);
        return mediaTypes.push(mediaType);
      },
      setUnknownMediaType: function(mediaType) {
        return unknownMediaType = addFlags(mediaType);
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
            lang: language.lang,
            uniqueid: util.unique_ID(6)
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
    ExternalAPI.addMediaType("twitter-ready", ExternalAPI["twitter-ready"]);
    ExternalAPI.addMediaType("youtube", ExternalAPI.youtube);
    ExternalAPI.addMediaType("vimeo", ExternalAPI.vimeo);
    ExternalAPI.addMediaType("dailymotion", ExternalAPI.dailymotion);
    ExternalAPI.addMediaType("vine", ExternalAPI.vine, ExternalAPI.addMediaType("soundcloud", ExternalAPI.soundcloud));
    ExternalAPI.addMediaType("twitter", ExternalAPI.twitter);
    ExternalAPI.addMediaType("googlemaps", ExternalAPI.googlemaps);
    ExternalAPI.addMediaType("googleplus", ExternalAPI.googleplus);
    ExternalAPI.addMediaType("flickr", ExternalAPI.flickr);
    ExternalAPI.addMediaType("instagram", ExternalAPI.instagram);
    ExternalAPI.addMediaType("image", ExternalAPI.image);
    ExternalAPI.addMediaType("googledocs", ExternalAPI.googledocs);
    ExternalAPI.addMediaType("wikipedia", ExternalAPI.wikipedia);
    ExternalAPI.addMediaType("website", ExternalAPI.website);
    ExternalAPI.addMediaType("storify", ExternalAPI.storify);
    ExternalAPI.addMediaType("blockquote", ExternalAPI.blockquote);
    ExternalAPI.addMediaType("iframe", ExternalAPI.iframe);
    return ExternalAPI.setUnknownMediaType("unknown", ExternalAPI.unknown);
  });

}).call(this);
