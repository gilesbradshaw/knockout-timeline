(function() {
  define(["VMM", "global", "trace", "type", "VMM.Timeline"], function(VMM, global, trace, type) {
    return VMM.Timeline.DataObj = {
      data_obj: {},
      model_array: [],
      getData: function(raw_data) {
        var req;

        VMM.Timeline.DataObj.data_obj = {};
        VMM.fireEvent(global, VMM.Timeline.Config.events.messege, VMM.Timeline.Config.language.messages.loading_timeline);
        if (type.of(raw_data) === "object") {
          trace("DATA SOURCE: JSON OBJECT");
          VMM.Timeline.DataObj.parseJSON(raw_data);
        } else if (type.of(raw_data) === "string") {
          if (raw_data.match("%23")) {
            trace("DATA SOURCE: TWITTER SEARCH");
            VMM.Timeline.DataObj.model.tweets.getData("%23medill");
          } else if (raw_data.match("spreadsheet")) {
            trace("DATA SOURCE: GOOGLE SPREADSHEET");
            VMM.Timeline.DataObj.model.googlespreadsheet.getData(raw_data);
          } else if (raw_data.match("storify.com")) {
            trace("DATA SOURCE: STORIFY");
            VMM.Timeline.DataObj.model.storify.getData(raw_data);
          } else if (raw_data.match(".jsonp")) {
            trace("DATA SOURCE: JSONP");
            LoadLib.js(raw_data, VMM.Timeline.DataObj.onJSONPLoaded);
          } else {
            trace("DATA SOURCE: JSON");
            req = "";
            if (raw_data.indexOf("?") > -1) {
              req = raw_data + "&callback=onJSONP_Data";
            } else {
              req = raw_data + "?callback=onJSONP_Data";
            }
            VMM.getJSON(req, VMM.Timeline.DataObj.parseJSON);
          }
        } else if (type.of(raw_data) === "html") {
          trace("DATA SOURCE: HTML");
          VMM.Timeline.DataObj.parseHTML(raw_data);
        } else {
          trace("DATA SOURCE: UNKNOWN");
        }
      },
      onJSONPLoaded: function() {
        trace("JSONP IS LOADED");
        VMM.fireEvent(global, VMM.Timeline.Config.events.data_ready, storyjs_jsonp_data);
      },
      parseHTML: function(d) {
        var found_main_media, _data_obj;

        trace("parseHTML");
        trace("WARNING: THIS IS STILL ALPHA AND WILL NOT WORK WITH ID's other than #timeline");
        _data_obj = VMM.Timeline.DataObj.data_template_obj;
        if (VMM.Lib.find("#timeline section", "time")[0]) {
          _data_obj.timeline.startDate = VMM.Lib.html(VMM.Lib.find("#timeline section", "time")[0]);
          _data_obj.timeline.headline = VMM.Lib.html(VMM.Lib.find("#timeline section", "h2"));
          _data_obj.timeline.text = VMM.Lib.html(VMM.Lib.find("#timeline section", "article"));
          found_main_media = false;
          if (VMM.Lib.find("#timeline section", "figure img").length !== 0) {
            found_main_media = true;
            _data_obj.timeline.asset.media = VMM.Lib.attr(VMM.Lib.find("#timeline section", "figure img"), "src");
          } else if (VMM.Lib.find("#timeline section", "figure a").length !== 0) {
            found_main_media = true;
            _data_obj.timeline.asset.media = VMM.Lib.attr(VMM.Lib.find("#timeline section", "figure a"), "href");
          } else {

          }
          if (found_main_media) {
            if (VMM.Lib.find("#timeline section", "cite").length !== 0) {
              _data_obj.timeline.asset.credit = VMM.Lib.html(VMM.Lib.find("#timeline section", "cite"));
            }
            if (VMM.Lib.find(this, "figcaption").length !== 0) {
              _data_obj.timeline.asset.caption = VMM.Lib.html(VMM.Lib.find("#timeline section", "figcaption"));
            }
          }
        }
        VMM.Lib.each("#timeline li", function(i, elem) {
          var found_media, valid_date, _date;

          valid_date = false;
          _date = {
            type: "default",
            startDate: "",
            headline: "",
            text: "",
            asset: {
              media: "",
              credit: "",
              caption: ""
            },
            tags: "Optional"
          };
          if (VMM.Lib.find(this, "time") !== 0) {
            valid_date = true;
            _date.startDate = VMM.Lib.html(VMM.Lib.find(this, "time")[0]);
            if (VMM.Lib.find(this, "time")[1]) {
              _date.endDate = VMM.Lib.html(VMM.Lib.find(this, "time")[1]);
            }
            _date.headline = VMM.Lib.html(VMM.Lib.find(this, "h3"));
            _date.text = VMM.Lib.html(VMM.Lib.find(this, "article"));
            found_media = false;
            if (VMM.Lib.find(this, "figure img").length !== 0) {
              found_media = true;
              _date.asset.media = VMM.Lib.attr(VMM.Lib.find(this, "figure img"), "src");
            } else if (VMM.Lib.find(this, "figure a").length !== 0) {
              found_media = true;
              _date.asset.media = VMM.Lib.attr(VMM.Lib.find(this, "figure a"), "href");
            } else {

            }
            if (found_media) {
              if (VMM.Lib.find(this, "cite").length !== 0) {
                _date.asset.credit = VMM.Lib.html(VMM.Lib.find(this, "cite"));
              }
              if (VMM.Lib.find(this, "figcaption").length !== 0) {
                _date.asset.caption = VMM.Lib.html(VMM.Lib.find(this, "figcaption"));
              }
            }
            trace(_date);
            _data_obj.timeline.date.push(_date);
          }
        });
        VMM.fireEvent(global, VMM.Timeline.Config.events.data_ready, _data_obj);
      },
      parseJSON: function(d) {
        trace("parseJSON");
        if (d.timeline.type === "default") {
          trace("DATA SOURCE: JSON STANDARD TIMELINE");
          VMM.fireEvent(global, VMM.Timeline.Config.events.data_ready, d);
        } else if (d.timeline.type === "twitter") {
          trace("DATA SOURCE: JSON TWEETS");
          VMM.Timeline.DataObj.model_Tweets.buildData(d);
        } else {
          trace("DATA SOURCE: UNKNOWN JSON");
          trace(type.of(d.timeline));
        }
      },
      model: {
        googlespreadsheet: {
          getData: function(raw) {
            var getjsondata, key, requestJsonData, timeout, tries, url, worksheet;

            requestJsonData = function() {
              var getjsondata;

              getjsondata = VMM.getJSON(url, function(d) {
                clearTimeout(timeout);
                VMM.Timeline.DataObj.model.googlespreadsheet.buildData(d);
              }).error(function(jqXHR, textStatus, errorThrown) {
                trace("Google Docs ERROR");
                trace("Google Docs ERROR: " + textStatus + " " + jqXHR.responseText);
              }).success(function(d) {
                clearTimeout(timeout);
              });
            };
            getjsondata = void 0;
            key = void 0;
            worksheet = void 0;
            url = void 0;
            timeout = void 0;
            tries = 0;
            key = VMM.Util.getUrlVars(raw)["key"];
            worksheet = VMM.Util.getUrlVars(raw)["worksheet"];
            if (typeof worksheet === "undefined") {
              worksheet = "od6";
            }
            url = "https://spreadsheets.google.com/feeds/list/" + key + "/" + worksheet + "/public/values?alt=json";
            timeout = setTimeout(function() {
              trace("Google Docs timeout " + url);
              trace(url);
              if (tries < 3) {
                VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Still waiting on Google Docs, trying again " + tries);
                tries++;
                getjsondata.abort();
                requestJsonData();
              } else {
                VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Google Docs is not responding");
              }
            }, 16000);
            requestJsonData();
          },
          buildData: function(d) {
            var data_obj, date, dd, dd_type, era, getGVar, i, is_valid;

            getGVar = function(v) {
              if (typeof v !== "undefined") {
                return v.$t;
              } else {
                return "";
              }
            };
            data_obj = VMM.Timeline.DataObj.data_template_obj;
            is_valid = false;
            VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Parsing Google Doc Data");
            if (typeof d.feed.entry === "undefined") {
              VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Error parsing spreadsheet. Make sure you have no blank rows and that the headers have not been changed.");
            } else {
              is_valid = true;
              i = 0;
              while (i < d.feed.entry.length) {
                dd = d.feed.entry[i];
                dd_type = "";
                if (typeof dd.gsx$type !== "undefined") {
                  dd_type = dd.gsx$type.$t;
                } else {
                  if (typeof dd.gsx$titleslide !== "undefined") {
                    dd_type = dd.gsx$titleslide.$t;
                  }
                }
                if (dd_type.match("start") || dd_type.match("title")) {
                  data_obj.timeline.startDate = getGVar(dd.gsx$startdate);
                  data_obj.timeline.headline = getGVar(dd.gsx$headline);
                  data_obj.timeline.asset.media = getGVar(dd.gsx$media);
                  data_obj.timeline.asset.caption = getGVar(dd.gsx$mediacaption);
                  data_obj.timeline.asset.credit = getGVar(dd.gsx$mediacredit);
                  data_obj.timeline.text = getGVar(dd.gsx$text);
                  data_obj.timeline.type = "google spreadsheet";
                } else if (dd_type.match("era")) {
                  era = {
                    startDate: getGVar(dd.gsx$startdate),
                    endDate: getGVar(dd.gsx$enddate),
                    headline: getGVar(dd.gsx$headline),
                    text: getGVar(dd.gsx$text),
                    tag: getGVar(dd.gsx$tag)
                  };
                  data_obj.timeline.era.push(era);
                } else {
                  date = {
                    type: "google spreadsheet",
                    startDate: getGVar(dd.gsx$startdate),
                    endDate: getGVar(dd.gsx$enddate),
                    headline: getGVar(dd.gsx$headline),
                    text: getGVar(dd.gsx$text),
                    tag: getGVar(dd.gsx$tag),
                    asset: {
                      media: getGVar(dd.gsx$media),
                      credit: getGVar(dd.gsx$mediacredit),
                      caption: getGVar(dd.gsx$mediacaption),
                      thumbnail: getGVar(dd.gsx$mediathumbnail)
                    }
                  };
                  data_obj.timeline.date.push(date);
                }
                i++;
              }
            }
            if (is_valid) {
              VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Finished Parsing Data");
              VMM.fireEvent(global, VMM.Timeline.Config.events.data_ready, data_obj);
            } else {
              VMM.fireEvent(global, VMM.Timeline.Config.events.messege, VMM.Language.messages.loading + " Google Doc Data (cells)");
              trace("There may be too many entries. Still trying to load data. Now trying to load cells to avoid Googles limitation on cells");
              VMM.Timeline.DataObj.model.googlespreadsheet.getDataCells(d.feed.link[0].href);
            }
          },
          getDataCells: function(raw) {
            var getjsondata, key, requestJsonData, timeout, tries, url;

            requestJsonData = function() {
              var getjsondata;

              getjsondata = VMM.getJSON(url, function(d) {
                clearTimeout(timeout);
                VMM.Timeline.DataObj.model.googlespreadsheet.buildDataCells(d);
              }).error(function(jqXHR, textStatus, errorThrown) {
                trace("Google Docs ERROR");
                trace("Google Docs ERROR: " + textStatus + " " + jqXHR.responseText);
              }).success(function(d) {
                clearTimeout(timeout);
              });
            };
            getjsondata = void 0;
            key = void 0;
            url = void 0;
            timeout = void 0;
            tries = 0;
            key = VMM.Util.getUrlVars(raw)["key"];
            url = "https://spreadsheets.google.com/feeds/cells/" + key + "/od6/public/values?alt=json";
            timeout = setTimeout(function() {
              trace("Google Docs timeout " + url);
              trace(url);
              if (tries < 3) {
                VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Still waiting on Google Docs, trying again " + tries);
                tries++;
                getjsondata.abort();
                requestJsonData();
              } else {
                VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Google Docs is not responding");
              }
            }, 16000);
            requestJsonData();
          },
          buildDataCells: function(d) {
            var cell, cellnames, column_name, data_obj, date, dd, dd_type, era, getGVar, i, is_valid, k, list, max_row;

            getGVar = function(v) {
              if (typeof v !== "undefined") {
                return v.$t;
              } else {
                return "";
              }
            };
            data_obj = VMM.Timeline.DataObj.data_template_obj;
            is_valid = false;
            cellnames = ["timeline"];
            list = [];
            max_row = 0;
            i = 0;
            k = 0;
            VMM.fireEvent(global, VMM.Timeline.Config.events.messege, VMM.Language.messages.loading_timeline + " Parsing Google Doc Data (cells)");
            if (typeof d.feed.entry !== "undefined") {
              is_valid = true;
              i = 0;
              while (i < d.feed.entry.length) {
                dd = d.feed.entry[i];
                if (parseInt(dd.gs$cell.row) > max_row) {
                  max_row = parseInt(dd.gs$cell.row);
                }
                i++;
              }
              i = 0;
              while (i < max_row + 1) {
                date = {
                  type: "",
                  startDate: "",
                  endDate: "",
                  headline: "",
                  text: "",
                  tag: "",
                  asset: {
                    media: "",
                    credit: "",
                    caption: "",
                    thumbnail: ""
                  }
                };
                list.push(date);
                i++;
              }
              i = 0;
              while (i < d.feed.entry.length) {
                dd = d.feed.entry[i];
                dd_type = "";
                column_name = "";
                cell = {
                  content: getGVar(dd.gs$cell),
                  col: dd.gs$cell.col,
                  row: dd.gs$cell.row,
                  name: ""
                };
                if (cell.row === 1) {
                  if (cell.content === "Start Date") {
                    column_name = "startDate";
                  } else if (cell.content === "End Date") {
                    column_name = "endDate";
                  } else if (cell.content === "Headline") {
                    column_name = "headline";
                  } else if (cell.content === "Text") {
                    column_name = "text";
                  } else if (cell.content === "Media") {
                    column_name = "media";
                  } else if (cell.content === "Media Credit") {
                    column_name = "credit";
                  } else if (cell.content === "Media Caption") {
                    column_name = "caption";
                  } else if (cell.content === "Media Thumbnail") {
                    column_name = "thumbnail";
                  } else if (cell.content === "Type") {
                    column_name = "type";
                  } else {
                    if (cell.content === "Tag") {
                      column_name = "tag";
                    }
                  }
                  cellnames.push(column_name);
                } else {
                  cell.name = cellnames[cell.col];
                  list[cell.row][cell.name] = cell.content;
                }
                i++;
              }
              i = 0;
              while (i < list.length) {
                date = list[i];
                if (date.type.match("start") || date.type.match("title")) {
                  data_obj.timeline.startDate = date.startDate;
                  data_obj.timeline.headline = date.headline;
                  data_obj.timeline.asset.media = date.media;
                  data_obj.timeline.asset.caption = date.caption;
                  data_obj.timeline.asset.credit = date.credit;
                  data_obj.timeline.text = date.text;
                  data_obj.timeline.type = "google spreadsheet";
                } else if (date.type.match("era")) {
                  era = {
                    startDate: date.startDate,
                    endDate: date.endDate,
                    headline: date.headline,
                    text: date.text,
                    tag: date.tag
                  };
                  data_obj.timeline.era.push(era);
                } else {
                  if (date.startDate) {
                    date = {
                      type: "google spreadsheet",
                      startDate: date.startDate,
                      endDate: date.endDate,
                      headline: date.headline,
                      text: date.text,
                      tag: date.tag,
                      asset: {
                        media: date.media,
                        credit: date.credit,
                        caption: date.caption,
                        thumbnail: date.thumbnail
                      }
                    };
                    data_obj.timeline.date.push(date);
                  } else {
                    trace("Skipping item " + i + " in list: no start date.");
                  }
                }
                i++;
              }
            }
            is_valid = data_obj.timeline.date.length > 0;
            if (is_valid) {
              VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Finished Parsing Data");
              VMM.fireEvent(global, VMM.Timeline.Config.events.data_ready, data_obj);
            } else {
              VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Unable to load Google Doc data source. Make sure you have no blank rows and that the headers have not been changed.");
            }
          }
        },
        storify: {
          getData: function(raw) {
            var key, storify_timeout, url;

            key = void 0;
            url = void 0;
            storify_timeout = void 0;
            VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Loading Storify...");
            key = raw.split("storify.com/")[1];
            url = "//api.storify.com/v1/stories/" + key + "?per_page=300&callback=?";
            storify_timeout = setTimeout(function() {
              trace("STORIFY timeout");
              VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Storify is not responding");
            }, 6000);
            VMM.getJSON(url, VMM.Timeline.DataObj.model.storify.buildData).error(function(jqXHR, textStatus, errorThrown) {
              trace("STORIFY error");
              trace("STORIFY ERROR: " + textStatus + " " + jqXHR.responseText);
            }).success(function(d) {
              clearTimeout(storify_timeout);
            });
          },
          buildData: function(d) {
            var asset_text, d_date, d_name, d_nickname, dd, i, is_text, t_name, t_nickname, tt, _data_obj, _date;

            VMM.fireEvent(global, VMM.Timeline.Config.events.messege, "Parsing Data");
            _data_obj = VMM.Timeline.DataObj.data_template_obj;
            _data_obj.timeline.startDate = new Date(d.content.date.created);
            _data_obj.timeline.headline = d.content.title;
            trace(d);
            tt = "";
            t_name = d.content.author.username;
            t_nickname = "";
            if (typeof d.content.author.name !== "undefined") {
              t_name = d.content.author.name;
              t_nickname = d.content.author.username + "&nbsp;";
            }
            if (typeof d.content.description !== "undefined" && (d.content.description != null)) {
              tt += d.content.description;
            }
            tt += "<div class='storify'>";
            tt += "<div class='vcard author'><a class='screen-name url' href='" + d.content.author.permalink + "' target='_blank'>";
            tt += "<span class='avatar'><img src='" + d.content.author.avatar + "' style='max-width: 32px; max-height: 32px;'></span>";
            tt += "<span class='fn'>" + t_name + "</span>";
            tt += "<span class='nickname'>" + t_nickname + "<span class='thumbnail-inline'></span></span>";
            tt += "</a>";
            tt += "</div>";
            tt += "</div>";
            _data_obj.timeline.text = tt;
            _data_obj.timeline.asset.media = d.content.thumbnail;
            _data_obj.timeline.type = "storify";
            i = 0;
            while (i < d.content.elements.length) {
              dd = d.content.elements[i];
              is_text = false;
              d_date = new Date(dd.posted_at);
              trace(dd.type);
              _date = {
                type: "storify",
                startDate: dd.posted_at,
                endDate: dd.posted_at,
                headline: " ",
                slug: "",
                text: "",
                asset: {
                  media: "",
                  credit: "",
                  caption: ""
                }
              };
              if (dd.type === "image") {
                if (typeof dd.source.name !== "undefined") {
                  if (dd.source.name === "flickr") {
                    _date.asset.media = "//flickr.com/photos/" + dd.meta.pathalias + "/" + dd.meta.id + "/";
                    _date.asset.credit = "<a href='" + _date.asset.media + "'>" + dd.attribution.name + "</a>";
                    _date.asset.credit += " on <a href='" + dd.source.href + "'>" + dd.source.name + "</a>";
                  } else if (dd.source.name === "instagram") {
                    _date.asset.media = dd.permalink;
                    _date.asset.credit = "<a href='" + dd.permalink + "'>" + dd.attribution.name + "</a>";
                    _date.asset.credit += " on <a href='" + dd.source.href + "'>" + dd.source.name + "</a>";
                  } else {
                    _date.asset.credit = "<a href='" + dd.permalink + "'>" + dd.attribution.name + "</a>";
                    if (typeof dd.source.href !== "undefined") {
                      _date.asset.credit += " on <a href='" + dd.source.href + "'>" + dd.source.name + "</a>";
                    }
                    _date.asset.media = dd.data.image.src;
                  }
                } else {
                  _date.asset.credit = "<a href='" + dd.permalink + "'>" + dd.attribution.name + "</a>";
                  _date.asset.media = dd.data.image.src;
                }
                _date.slug = dd.attribution.name;
                if (typeof dd.data.image.caption !== "undefined") {
                  if (dd.data.image.caption !== "undefined") {
                    _date.asset.caption = dd.data.image.caption;
                    _date.slug = dd.data.image.caption;
                  }
                }
              } else if (dd.type === "quote") {
                if (dd.permalink.match("twitter")) {
                  _date.asset.media = dd.permalink;
                  _date.slug = VMM.Util.untagify(dd.data.quote.text);
                } else if (dd.permalink.match("storify")) {
                  is_text = true;
                  _date.asset.media = "<blockquote>" + dd.data.quote.text.replace(/<\s*\/?\s*b\s*.*?>/g, "") + "</blockquote>";
                }
              } else if (dd.type === "link") {
                _date.headline = dd.data.link.title;
                _date.text = dd.data.link.description;
                if (dd.data.link.thumbnail !== "undefined" && dd.data.link.thumbnail !== "") {
                  _date.asset.media = dd.data.link.thumbnail;
                } else {
                  _date.asset.media = dd.permalink;
                }
                _date.asset.caption = "<a href='" + dd.permalink + "' target='_blank'>" + dd.data.link.title + "</a>";
                _date.slug = dd.data.link.title;
              } else if (dd.type === "text") {
                if (dd.permalink.match("storify")) {
                  is_text = true;
                  d_name = d.content.author.username;
                  d_nickname = "";
                  if (typeof dd.attribution.name !== "undefined") {
                    t_name = dd.attribution.name;
                    t_nickname = dd.attribution.username + "&nbsp;";
                  }
                  asset_text = "<div class='storify'>";
                  asset_text += "<blockquote><p>" + dd.data.text.replace(/<\s*\/?\s*b\s*.*?>/g, "") + "</p></blockquote>";
                  asset_text += "<div class='vcard author'><a class='screen-name url' href='" + dd.attribution.href + "' target='_blank'>";
                  asset_text += "<span class='avatar'><img src='" + dd.attribution.thumbnail + "' style='max-width: 32px; max-height: 32px;'></span>";
                  asset_text += "<span class='fn'>" + t_name + "</span>";
                  asset_text += "<span class='nickname'>" + t_nickname + "<span class='thumbnail-inline'></span></span>";
                  asset_text += "</a></div></div>";
                  _date.text = asset_text;
                  if ((i + 1) >= d.content.elements.length) {
                    _date.startDate = d.content.elements[i - 1].posted_at;
                  } else {
                    if (d.content.elements[i + 1].type === "text" && d.content.elements[i + 1].permalink.match("storify")) {
                      if ((i + 2) >= d.content.elements.length) {
                        _date.startDate = d.content.elements[i - 1].posted_at;
                      } else {
                        if (d.content.elements[i + 2].type === "text" && d.content.elements[i + 2].permalink.match("storify")) {
                          if ((i + 3) >= d.content.elements.length) {
                            _date.startDate = d.content.elements[i - 1].posted_at;
                          } else {
                            if (d.content.elements[i + 3].type === "text" && d.content.elements[i + 3].permalink.match("storify")) {
                              _date.startDate = d.content.elements[i - 1].posted_at;
                            } else {
                              trace("LEVEL 3");
                              _date.startDate = d.content.elements[i + 3].posted_at;
                            }
                          }
                        } else {
                          trace("LEVEL 2");
                          _date.startDate = d.content.elements[i + 2].posted_at;
                        }
                      }
                    } else {
                      trace("LEVEL 1");
                      _date.startDate = d.content.elements[i + 1].posted_at;
                    }
                  }
                  _date.endDate = _date.startDate;
                }
              } else if (dd.type === "video") {
                _date.headline = dd.data.video.title;
                _date.asset.caption = dd.data.video.description;
                _date.asset.caption = dd.source.username;
                _date.asset.media = dd.data.video.src;
              } else {
                trace("NO MATCH ");
                trace(dd);
              }
              if (is_text) {
                _date.slug = VMM.Util.untagify(dd.data.text);
              }
              _data_obj.timeline.date.push(_date);
              i++;
            }
            VMM.fireEvent(global, VMM.Timeline.Config.events.data_ready, _data_obj);
          }
        },
        tweets: {
          type: "twitter",
          buildData: function(raw_data) {
            VMM.bindEvent(global, VMM.Timeline.DataObj.model.tweets.onTwitterDataReady, "TWEETSLOADED");
            VMM.ExternalAPI.twitter.getTweets(raw_data.timeline.tweets);
          },
          getData: function(raw_data) {
            VMM.bindEvent(global, VMM.Timeline.DataObj.model.tweets.onTwitterDataReady, "TWEETSLOADED");
            VMM.ExternalAPI.twitter.getTweetSearch(raw_data);
          },
          onTwitterDataReady: function(e, d) {
            var i, _data_obj, _date;

            _data_obj = VMM.Timeline.DataObj.data_template_obj;
            i = 0;
            while (i < d.tweetdata.length) {
              _date = {
                type: "tweets",
                startDate: "",
                headline: "",
                text: "",
                asset: {
                  media: "",
                  credit: "",
                  caption: ""
                },
                tags: "Optional"
              };
              _date.startDate = d.tweetdata[i].raw.created_at;
              if (type.of(d.tweetdata[i].raw.from_user_name)) {
                _date.headline = d.tweetdata[i].raw.from_user_name + " (<a href='https://twitter.com/" + d.tweetdata[i].raw.from_user + "'>" + "@" + d.tweetdata[i].raw.from_user + "</a>)";
              } else {
                _date.headline = d.tweetdata[i].raw.user.name + " (<a href='https://twitter.com/" + d.tweetdata[i].raw.user.screen_name + "'>" + "@" + d.tweetdata[i].raw.user.screen_name + "</a>)";
              }
              _date.asset.media = d.tweetdata[i].content;
              _data_obj.timeline.date.push(_date);
              i++;
            }
            VMM.fireEvent(global, VMM.Timeline.Config.events.data_ready, _data_obj);
          }
        }
      },
      data_template_obj: {
        timeline: {
          headline: "",
          description: "",
          asset: {
            media: "",
            credit: "",
            caption: ""
          },
          date: [],
          era: []
        }
      },
      date_obj: {
        startDate: "2012,2,2,11,30",
        headline: "",
        text: "",
        asset: {
          media: "http://youtu.be/vjVfu8-Wp6s",
          credit: "",
          caption: ""
        },
        tags: "Optional"
      }
    };
  });

}).call(this);
