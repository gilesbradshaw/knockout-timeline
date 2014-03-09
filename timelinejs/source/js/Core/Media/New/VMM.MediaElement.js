(function() {
  define(["VMM", "trace", "VMM.ExternalAPI"], function(VMM, trace) {
    return VMM.MediaElement = {
      init: function() {
        return this;
      },
      loadingmessage: function(m) {
        return "<div class='vco-loading'><div class='vco-loading-container'><div class='vco-loading-icon'></div>" + "<div class='vco-message'><p>" + m + "</p></div></div></div>";
      },
      thumbnail: function(data, w, h, uid) {
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
      create: function(data, uid) {
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
