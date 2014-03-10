(function() {
  requirejs.config({
    baseUrl: '/',
    shim: {
      easing: ["jquery"],
      linq: ["jquery"],
      "bootstrap-tooltip": ["jquery"]
    },
    paths: {
      knockout: "Scripts/knockout-3.1.0.debug",
      jquery: "Scripts/jquery-2.1.0",
      linq: "Scripts/jquery.linq",
      "trace": "/source/js/core/core/new/trace",
      "global": "/source/js/core/core/new/global",
      "Date.extensions": "/source/js/core/core/new/Date.extensions",
      "type": "/source/js/core/core/new/type",
      "jQueryExtender": "/source/js/core/core/new/jQueryExtender",
      "easing": "/source/js/core/Library/Jquery/easing",
      "lazyload": "/source/js/core/Library/LazyLoad",
      "aes": "/source/js/core/Library/Aes",
      "bootstrap-tooltip": "/source/js/core/Library/bootstrap-tooltip",
      "leaflet": "/source/js/core/Library/leaflet",
      "ko.easing": "/source/js/core/core/new/custombindings/easing",
      "ko.importDates": "/source/js/core/core/new/custombindings/importDate",
      "VMM.Browser": "/source/js/core/core/new/VMM.Browser",
      "VMM.Date": "/source/js/core/core/new/VMM.Date",
      "VMM.FileExtension": "/source/js/core/core/new/VMM.FileExtension",
      "VMM.masterConfig": "/source/js/core/core/new/VMM.masterConfig",
      "VMM.Library": "/source/js/core/core/new/VMM.Library",
      "VMM.LoadLib": "/source/js/core/core/new/VMM.LoadLib",
      "VMM.Util": "/source/js/core/core/new/VMM.Util",
      "VMM.ExternalAPI": "/source/js/core/Media/new/VMM.ExternalAPI",
      "VMM.Extender": "/source/js/core/Media/new/VMM.Extender",
      "VMM.MediaElement": "/source/js/core/Media/new/VMM.MediaElement",
      "VMM.TextElement": "/source/js/core/Media/new/VMM.TextElement",
      "VMM.DragSlider": "/source/js/core/Slider/new/VMM.DragSlider",
      "VMM.Slider": "/source/js/core/Slider/new/VMM.Slider",
      "VMM.Slider.Slide": "/source/js/core/Slider/new/VMM.Slider.Slide",
      "VMM.Timeline": "/source/js/new/VMM.Timeline",
      "VMM.Timeline.DataObj": "/source/js/new/VMM.Timeline.DataObj",
      "VMM.Timeline.TimeNav": "/source/js/new/VMM.Timeline.TimeNav",
      "VMM.Language": "/source/js/core/language/VMM.Language"
    }
  });

  require(["VMM.Timeline", "knockout", "jquery", "linq", "ko.easing", "ko.importDates"], function(Timeline, ko, $) {
    var tConfig, timeline;

    tConfig = {
      config: ko.observable({
        type: ko.observable('timeline'),
        preload: ko.observable(4),
        current_slide: (function() {
          var initial;

          initial = ko.observable(0);
          return ko.computed({
            deferEvaluation: true,
            read: function() {
              if (initial() > tConfig.timeline().dates().length) {
                initial(tConfig.timeline().dates().length);
              }
              return initial();
            },
            write: function(x) {
              return initial(x);
            }
          });
        })(),
        forward: function() {
          return tConfig.config().current_slide(tConfig.config().current_slide() + 1);
        },
        backward: function() {
          return tConfig.config().current_slide(tConfig.config().current_slide() - 1);
        },
        interval: ko.observable(10),
        something: ko.observable(0),
        width: ko.observable(1200),
        ease: ko.observable("easeInOutExpo"),
        duration: ko.observable(1000),
        timeline: ko.observable(false),
        spacing: ko.observable(15),
        nav: ko.observable({
          height: ko.observable(200)
        }),
        slider: ko.observable({
          height: ko.observable(600),
          content: ko.observable({
            width: ko.observable(720),
            height: ko.observable(400),
            padding: ko.observable(120),
            padding_default: ko.observable(120)
          }),
          nav: ko.observable({
            width: ko.observable(100),
            height: ko.observable(200)
          })
        }),
        touch: ko.observable(),
        language: ko.observable({
          right_to_left: ko.observable()
        })
      }),
      timeline: ko.observable({
        headline: ko.observable("Sh*t People Say"),
        type: ko.observable("default"),
        text: ko.observable("People say stuff"),
        startDate: ko.observable("2012,1,26"),
        dates: ko.observableArray([
          {
            startDate: ko.observable("2011,12,12"),
            endDate: ko.observable("2012,1,27"),
            headline: ko.observable("Vine"),
            text: ko.observable("<p>Vine Test</p>"),
            asset: ko.observable({
              media: ko.observable("https://vine.co/v/b55LOA1dgJU"),
              credit: ko.observable(""),
              caption: ko.observable("")
            })
          }, {
            startDate: ko.observable("2011,12,13"),
            endDate: ko.observable("2012,1,28"),
            headline: ko.observable("Vine#2"),
            text: ko.observable("<p>Vine Test</p>"),
            asset: ko.observable({
              media: ko.observable("https://vine.co/v/b55LOA1dgJU"),
              credit: ko.observable(""),
              caption: ko.observable("")
            })
          }
        ])
      })
    };
    $(document).ready(function() {
      ko.applyBindings(tConfig);
      return tConfig.timeline().dates.push({
        startDate: ko.observable("2011,12,12"),
        endDate: ko.observable("2012,1,27"),
        headline: ko.observable("Vine#3"),
        text: ko.observable("<p>Vine Test</p>"),
        asset: ko.observable({
          media: ko.observable("https://vine.co/v/b55LOA1dgJU"),
          credit: ko.observable(""),
          caption: ko.observable("")
        })
      });
    });
    timeline = new Timeline('timeline', 1800, 800);
    return timeline.init({
      type: 'timeline',
      source: {
        "timeline": {
          "headline": "Sh*t People Say",
          "type": "default",
          "text": "People say stuff",
          "startDate": "2012,1,26",
          "date": [
            {
              "startDate": "2011,12,12",
              "endDate": "2012,1,27",
              "headline": "Vine",
              "text": "<p>Vine Test</p>",
              "asset": {
                "media": "https://vine.co/v/b55LOA1dgJU",
                "credit": "",
                "caption": ""
              }
            }, {
              "startDate": "2012,1,26",
              "endDate": "2012,1,27",
              "headline": "Sh*t Politicians Say",
              "text": "<p>In true political fashion, his character rattles off common jargon heard from people running for office.</p>",
              "asset": {
                "media": "http://www.dailymotion.com/video/x1fudyl_2015-jeep-renegade_tech",
                "credit": "",
                "caption": ""
              }
            }, {
              "startDate": "2012,1,10",
              "headline": "Sh*t Nobody Says",
              "text": "<p>Have you ever heard someone say “can I burn a copy of your Nickelback CD?” or “my Bazooka gum still has flavor!” Nobody says that.</p>",
              "asset": {
                "media": "http://en.wikipedia.org/wiki/John_Bradshaw_(judge)",
                "credit": "",
                "caption": ""
              }
            }, {
              "startDate": "2012,1,26",
              "headline": "Sh*t Chicagoans Say",
              "text": "<p>Have you ever heard someone say “can I burn a copy of your Nickelback CD?” or “my Bazooka gum still has flavor!” Nobody says that.</p>",
              "asset": {
                "media": "http://www.bbc.co.uk/news/uk-england-hampshire-26504109",
                "credit": "all credit to the bbc",
                "caption": "a captioon gopes here"
              }
            }, {
              "startDate": "2011,12,12",
              "headline": "Sh*t Girls Say",
              "text": "",
              "asset": {
                "media": "http://youtu.be/u-yLGIH7W9Y",
                "credit": "",
                "caption": "Writers & Creators: Kyle Humphrey & Graydon Sheppard"
              }
            }, {
              "startDate": "2012,1,4",
              "headline": "Sh*t Broke People Say",
              "text": "",
              "asset": {
                "media": "http://youtu.be/zyyalkHjSjo",
                "credit": "",
                "caption": ""
              }
            }, {
              "startDate": "2012,1,4",
              "headline": "Sh*t Silicon Valley Says",
              "text": "",
              "asset": {
                "media": "http://youtu.be/BR8zFANeBGQ",
                "credit": "",
                "caption": "written, filmed, and edited by Kate Imbach & Tom Conrad"
              }
            }, {
              "startDate": "2011,12,25",
              "headline": "Sh*t Vegans Say",
              "text": "",
              "asset": {
                "media": "http://youtu.be/OmWFnd-p0Lw",
                "credit": "",
                "caption": ""
              }
            }, {
              "startDate": "2012,1,23",
              "headline": "Sh*t Graphic Designers Say",
              "text": "",
              "asset": {
                "media": "http://youtu.be/KsT3QTmsN5Q",
                "credit": "",
                "caption": ""
              }
            }, {
              "startDate": "2011,12,30",
              "headline": "Sh*t Wookiees Say",
              "text": "",
              "asset": {
                "media": "http://youtu.be/vJpBCzzcSgA",
                "credit": "",
                "caption": ""
              }
            }, {
              "startDate": "2012,1,17",
              "headline": "Sh*t People Say About Sh*t People Say Videos",
              "text": "",
              "asset": {
                "media": "http://youtu.be/c9ehQ7vO7c0",
                "credit": "",
                "caption": ""
              }
            }, {
              "startDate": "2012,1,20",
              "headline": "Sh*t Social Media Pros Say",
              "text": "",
              "asset": {
                "media": "http://youtu.be/eRQe-BT9g_U",
                "credit": "",
                "caption": ""
              }
            }, {
              "startDate": "2012,1,11",
              "headline": "Sh*t Old People Say About Computers",
              "text": "",
              "asset": {
                "media": "http://youtu.be/HRmc5uuoUzA",
                "credit": "",
                "caption": ""
              }
            }, {
              "startDate": "2012,1,11",
              "headline": "Sh*t College Freshmen Say",
              "text": "",
              "asset": {
                "media": "http://youtu.be/rwozXzo0MZk",
                "credit": "",
                "caption": ""
              }
            }, {
              "startDate": "2011,12,16",
              "headline": "Sh*t Girls Say - Episode 2",
              "text": "",
              "asset": {
                "media": "http://youtu.be/kbovd-e-hRg",
                "credit": "",
                "caption": "Writers & Creators: Kyle Humphrey & Graydon Sheppard"
              }
            }, {
              "startDate": "2011,12,24",
              "headline": "Sh*t Girls Say - Episode 3 Featuring Juliette Lewis",
              "text": "",
              "asset": {
                "media": "http://youtu.be/bDHUhT71JN8",
                "credit": "",
                "caption": "Writers & Creators: Kyle Humphrey & Graydon Sheppard"
              }
            }, {
              "startDate": "2012,1,27",
              "headline": "Sh*t Web Designers Say",
              "text": "",
              "asset": {
                "media": "http://youtu.be/MEOb_meSHhQ",
                "credit": "",
                "caption": ""
              }
            }, {
              "startDate": "2012,1,12",
              "headline": "Sh*t Hipsters Say",
              "text": "No meme is complete without a bit of hipster-bashing.",
              "asset": {
                "media": "http://youtu.be/FUhrSVyu0Kw",
                "credit": "",
                "caption": "Written, Directed, Conceptualized and Performed by Carrie Valentine and Jessica Katz"
              }
            }, {
              "startDate": "2012,1,6",
              "headline": "Sh*t Cats Say",
              "text": "No meme is complete without cats. This had to happen, obviously.",
              "asset": {
                "media": "http://youtu.be/MUX58Vi-YLg",
                "credit": "",
                "caption": ""
              }
            }, {
              "startDate": "2012,1,21",
              "headline": "Sh*t Cyclists Say",
              "text": "",
              "asset": {
                "media": "http://youtu.be/GMCkuqL9IcM",
                "credit": "",
                "caption": "Video script, production, and editing by Allen Krughoff of Hardcastle Photography"
              }
            }, {
              "startDate": "2011,12,30",
              "headline": "Sh*t Yogis Say",
              "text": "",
              "asset": {
                "media": "http://youtu.be/IMC1_RH_b3k",
                "credit": "",
                "caption": ""
              }
            }, {
              "startDate": "2012,1,18",
              "headline": "Sh*t New Yorkers Say",
              "text": "",
              "asset": {
                "media": "http://youtu.be/yRvJylbSg7o",
                "credit": "",
                "caption": "Directed and Edited by Matt Mayer, Produced by Seth Keim, Written by Eliot Glazer. Featuring Eliot and Ilana Glazer, who are siblings, not married."
              }
            }
          ]
        }
      }
    });
  });

}).call(this);
