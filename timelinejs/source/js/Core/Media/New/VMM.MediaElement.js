(function() {
  define(["trace", "VMM.Library", "VMM.Util", "VMM.masterConfig", "VMM.ExternalAPI"], function(trace, library, util, masterConfig, ExternalAPI) {
    var MediaElement;

    return MediaElement = {
      init: function() {
        return this;
      },
      thumbnail: function(data, w, h, uid) {
        var m, _uid;

        _uid = "";
        if ((uid != null) && uid !== "") {
          _uid = uid;
        }
        if ((data.media != null) && data.media !== "") {
          m = ExternalAPI.mediaTypeFromAsset(data);
          if ((data.thumbnail != null) && data.thumbnail !== "") {
            trace("CUSTOM THUMB");
            return "<div class='thumbnail thumb-custom' id='" + uid + "_custom_thumb'><img src='" + data.thumbnail + "'></div>";
          } else {
            return m.mediaType.thumbnail(m, uid);
          }
        }
      },
      create: function(data, uid) {
        var captionElem, creditElem, loading_message, m, mediaElem, _id, _valid;

        _valid = false;
        loading_message = library.loadingmessage(masterConfig.language.messages.loading + "...");
        if ((data.media != null) && data.media !== "") {
          mediaElem = "";
          captionElem = "";
          creditElem = "";
          _id = "";
          m = void 0;
          m = ExternalAPI.mediaTypeFromAsset(data);
          m.uid = uid;
          _valid = true;
          if ((data.credit != null) && data.credit !== "") {
            creditElem = "<div class='credit'>" + util.linkify_with_twitter(data.credit, "_blank") + "</div>";
          }
          if ((data.caption != null) && data.caption !== "") {
            captionElem = "<div class='caption'>" + util.linkify_with_twitter(data.caption, "_blank") + "</div>";
          }
          mediaElem = "<div class='media-container' >" + m.mediaType.createElement(m, loading_message) + creditElem + captionElem + "</div>";
          if (m.mediaType.isTextMedia) {
            return "<div class='text-media'><div class='media-wrapper'>" + mediaElem + "</div></div>";
          } else {
            return "<div class='media-wrapper'>" + mediaElem + "</div>";
          }
        }
      }
    }.init();
  });

}).call(this);
