define [], ()->
	master_config = (
		init: ->
			this

		sizes:
			api:
				width: 0
				height: 0

		vp: "Pellentesque nibh felis, eleifend id, commodo in, interdum vitae, leo"
		api_keys_master:
			flickr: "RAIvxHY4hE/Elm5cieh4X5ptMyDpj7MYIxziGxi0WGCcy1s+yr7rKQ=="
			google: "uQKadH1VMlCsp560gN2aOiMz4evWkl1s34yryl3F/9FJOsn+/948CbBUvKLN46U="
			twitter: ""

		timers:
			api: 7000

		api:
			pushques: []

		twitter:
			active: false
			array: []
			api_loaded: false
			que: []

		flickr:
			active: false
			array: []
			api_loaded: false
			que: []

		youtube:
			active: false
			array: []
			api_loaded: false
			que: []

		vimeo:
			active: false
			array: []
			api_loaded: false
			que: []

		vine:
			active: false
			array: []
			api_loaded: false
			que: []

		webthumb:
			active: false
			array: []
			api_loaded: false
			que: []

		googlemaps:
			active: false
			map_active: false
			places_active: false
			array: []
			api_loaded: false
			que: []

		googledocs:
			active: false
			array: []
			api_loaded: false
			que: []

		googleplus:
			active: false
			array: []
			api_loaded: false
			que: []

		wikipedia:
			active: false
			array: []
			api_loaded: false
			que: []
			tries: 0

		soundcloud:
			active: false
			array: []
			api_loaded: false
			que: []
	).init()
