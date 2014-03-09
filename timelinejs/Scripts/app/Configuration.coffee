requirejs.config
	baseUrl:'/'
	shim:
		easing:["jquery"]
		"bootstrap-tooltip":["jquery"]
		"VMM.Language":["VMM"]

	paths:

		jquery: "Scripts/jquery-2.1.0"

		"trace":"/source/js/core/core/new/trace"
		"Class":"/source/js/core/core/new/Class"
		"global":"/source/js/core/core/new/global"
		"Date.extensions":"/source/js/core/core/new/Date.extensions"
		"is_":"/source/js/core/core/new/is_"
		"type":"/source/js/core/core/new/type"
		"easing":"/source/js/core/Library/Jquery/easing"
		"lazyload":"/source/js/core/Library/LazyLoad"
		"aes":"/source/js/core/Library/Aes"
		"bootstrap-tooltip":"/source/js/core/Library/bootstrap-tooltip"
		"leaflet":"/source/js/core/Library/leaflet"

		"VMM":"/source/js/core/core/new/VMM"
		"VMM.Browser":"/source/js/core/core/new/VMM.Browser"
		"VMM.Date":"/source/js/core/core/new/VMM.Date"
		"VMM.FileExtention":"/source/js/core/core/new/VMM.FileExtention" #(sic)
		"VMM.Library":"/source/js/core/core/new/VMM.Library"
		"VMM.LoadLib":"/source/js/core/core/new/VMM.LoadLib"
		"VMM.Util":"/source/js/core/core/new/VMM.Util"

		#media
		"VMM.ExternalAPI":"/source/js/core/Media/new/VMM.ExternalAPI"
		"VMM.Extender":"/source/js/core/Media/new/VMM.Extender"
		"VMM.MediaElement":"/source/js/core/Media/new/VMM.MediaElement"
		"VMM.TextElement":"/source/js/core/Media/new/VMM.TextElement"

		#slider
		"VMM.DragSlider":"/source/js/core/Slider/new/VMM.DragSlider"
		"VMM.Slider":"/source/js/core/Slider/new/VMM.Slider"
		"VMM.Slider.Slide":"/source/js/core/Slider/new/VMM.Slider.Slide"

		#timeline
		"VMM.Timeline":"/source/js/new/VMM.Timeline"
		"VMM.Timeline.DataObj":"/source/js/new/VMM.Timeline.DataObj"
		"VMM.Timeline.TimeNav":"/source/js/new/VMM.Timeline.TimeNav"

		"VMM.Language":"/source/js/core/language/VMM.Language"




require [
	"global"
	"Class"
	"trace"
	"VMM"
	"is_"
	"type"
	"VMM.LoadLib"
	"VMM.Browser"
	"VMM.Date"
	"VMM.FileExtention"
	"VMM.Library"
	"VMM.Util"
	"VMM.ExternalAPI"
	"VMM.Extender"
	"VMM.MediaElement"
	"VMM.DragSlider"
	"VMM.Slider"
	"VMM.Slider.Slide"
	"VMM.Timeline"
	"VMM.Timeline.DataObj"
	"VMM.Timeline.TimeNav"
	#"VMM.Language"

	"Date.extensions"
	"aes"
	"bootstrap-tooltip"
	"leaflet"

], (global, Class, trace, VMM, is_, type, loadLib)->
	timeline = new VMM.Timeline 'timeline', 1200,500

	timeline.init
		type:'timeline'
		source:
			"timeline":
				"headline":"Sh*t People Say",
				"type":"default",
				"text":"People say stuff",
				"startDate":"2012,1,26",
				"date": [
						"startDate":"2011,12,12",
						"endDate":"2012,1,27",
						"headline":"Vine",
						"text":"<p>Vine Test</p>",
						"asset":
							"media":"https://vine.co/v/b55LOA1dgJU",
							"credit":"",
							"caption":""
				,
						"startDate":"2012,1,26",
						"endDate":"2012,1,27",
						"headline":"Sh*t Politicians Say",
						"text":"<p>In true political fashion, his character rattles off common jargon heard from people running for office.</p>",
						"asset":
							"media":"http://youtu.be/u4XpeU9erbg",
							"credit":"",
							"caption":""
				]
