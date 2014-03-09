###
VéritéCo JS Core
Designed and built by Zach Wise at VéritéCo zach@verite.co

This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
###


# VMM
#================================================== 

# Main Scope Container
#	================================================== 

#var VMM = {};

# Debug
#	================================================== 

# Master Config
#	================================================== 

#google:		"jwNGnYw4hE9lmAez4ll0QD+jo6SKBJFknkopLS4FrSAuGfIwyj57AusuR0s8dAo=",

#VMM.createElement(tag, value, cName, attrs, styles);

# TAG

# CLOSE TAG

# CREDIT

# CAPTION

# Hide URL Bar for iOS and Android by Scott Jehl
# https://gist.github.com/1183357

# If there's a hash, or addEventListener is undefined, stop here

#scroll to 1

#reset to 0 on bodyready, if needed

#reset to hide addr bar at onload

# Trace (console.log)
#================================================== 
define ["Class"], (Class)->
	VMM = Class.extend({})
	VMM.debug = true
	VMM.master_config = (
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
	VMM.createElement = (tag, value, cName, attrs, styles) ->
		ce = ""
		if tag? and tag isnt ""
			ce += "<" + tag
			ce += " class='" + cName + "'"    if cName? and cName isnt ""
			ce += " " + attrs    if attrs? and attrs isnt ""
			ce += " style='" + styles + "'"    if styles? and styles isnt ""
			ce += ">"
			ce += value    if value? and value isnt ""
			ce = ce + "</" + tag + ">"
		ce

	VMM.createMediaElement = (media, caption, credit) ->
		ce = ""
		_valid = false
		ce += "<div class='media'>"
		if media? and media isnt ""
			valid = true
			ce += "<img src='" + media + "'>"
			ce += VMM.createElement("div", credit, "credit")    if credit? and credit isnt ""
			ce += VMM.createElement("div", caption, "caption")    if caption? and caption isnt ""
		ce += "</div>"
		ce

	VMM.hideUrlBar = ->
		win = window
		doc = win.document
		if not location.hash or not win.addEventListener
			window.scrollTo 0, 1
			scrollTop = 1
			bodycheck = setInterval(->
				if doc.body
					clearInterval bodycheck
					scrollTop = (if "scrollTop" of doc.body then doc.body.scrollTop else 1)
					win.scrollTo 0, (if scrollTop is 1 then 0 else 1)
				return
			, 15)
			win.addEventListener "load", (->
				setTimeout (->
					win.scrollTo 0, (if scrollTop is 1 then 0 else 1)
					return
				), 0
				return
			), false
		return
	VMM


