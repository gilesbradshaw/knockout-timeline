# DRAG SLIDER
#================================================== 
define [
	"VMM.Library"
	"trace"
], (library, trace)->
	DragSlider = ->
		
		# PUBLIC FUNCTIONS
		#		================================================== 
		
		#dragslider			= drag_object;
		
		# PRIVATE FUNCTIONS
		#		================================================== 
		makeDraggable = (drag_object, move_object) ->
			library.bindEvent drag_object, onDragStart, dragevent.down,
				element: move_object
				delement: drag_object

			library.bindEvent drag_object, onDragEnd, dragevent.up,
				element: move_object
				delement: drag_object

			library.bindEvent drag_object, onDragLeave, dragevent.leave,
				element: move_object
				delement: drag_object
		onDragLeave = (e) ->
			library.unbindEvent e.data.delement, onDragMove, dragevent.move
			e.preventDefault()    unless drag.touch
			e.stopPropagation()
			if drag.sliding
				drag.sliding = false
				dragEnd e.data.element, e.data.delement, e
				false
			else
				true
		onDragStart = (e) ->
			dragStart e.data.element, e.data.delement, e
			e.preventDefault()    unless drag.touch
			
			#e.stopPropagation();
			true
		onDragEnd = (e) ->
			e.preventDefault()    unless drag.touch
			
			#e.stopPropagation();
			if drag.sliding
				drag.sliding = false
				dragEnd e.data.element, e.data.delement, e
				false
			else
				true
		onDragMove = (e) ->
			dragMove e.data.element, e
		dragStart = (elem, delem, e) ->
			if drag.touch
				trace "IS TOUCH"
				library.css elem, "-webkit-transition-duration", "0"
				drag.pagex.start = e.originalEvent.touches[0].screenX
				drag.pagey.start = e.originalEvent.touches[0].screenY
			else
				drag.pagex.start = e.pageX
				drag.pagey.start = e.pageY
			drag.left.start = getLeft(elem)
			drag.time.start = new Date().getTime()
			library.stop elem
			library.bindEvent delem, onDragMove, dragevent.move,
				element: elem

		dragEnd = (elem, delem, e) ->
			library.unbindEvent delem, onDragMove, dragevent.move
			dragMomentum elem, e
		dragMove = (elem, e) ->
			drag_to = undefined
			drag_to_y = undefined
			drag.sliding = true
			if drag.touch
				drag.pagex.end = e.originalEvent.touches[0].screenX
				drag.pagey.end = e.originalEvent.touches[0].screenY
			else
				drag.pagex.end = e.pageX
				drag.pagey.end = e.pageY
			drag.left.end = getLeft(elem)
			drag_to = -(drag.pagex.start - drag.pagex.end - drag.left.start)
			if Math.abs(drag.pagey.start) - Math.abs(drag.pagey.end) > 10
				trace "SCROLLING Y"
				trace Math.abs(drag.pagey.start) - Math.abs(drag.pagey.end)
			if Math.abs(drag_to - drag.left.start) > 10
				library.css elem, "left", drag_to
				e.preventDefault()
				e.stopPropagation()
		dragMomentum = (elem, e) ->
			drag_info =
				left: drag.left.end
				left_adjust: 0
				change:
					x: 0

				time: (new Date().getTime() - drag.time.start) * 10
				time_adjust: (new Date().getTime() - drag.time.start) * 10

			multiplier = 3000
			multiplier = 6000    if drag.touch
			drag_info.change.x = multiplier * (Math.abs(drag.pagex.end) - Math.abs(drag.pagex.start))
			drag_info.left_adjust = Math.round(drag_info.change.x / drag_info.time)
			drag_info.left = Math.min(drag_info.left + drag_info.left_adjust)
			if drag.constraint
				if drag_info.left > drag.constraint.left
					drag_info.left = drag.constraint.left
					drag_info.time = 5000    if drag_info.time > 5000
				else if drag_info.left < drag.constraint.right
					drag_info.left = drag.constraint.right
					drag_info.time = 5000    if drag_info.time > 5000
			library.fireEvent dragslider, "DRAGUPDATE", [drag_info]
			unless is_sticky
				if drag_info.time > 0
					if drag.touch
						library.animate elem, drag_info.time, "easeOutCirc",
							left: drag_info.left

					else
						library.animate elem, drag_info.time, drag.ease,
							left: drag_info.left

		getLeft = (elem) ->
			parseInt library.css(elem, "left").substring(0, library.css(elem, "left").length - 2), 10
		drag =
			element: ""
			element_move: ""
			constraint: ""
			sliding: false
			pagex:
				start: 0
				end: 0

			pagey:
				start: 0
				end: 0

			left:
				start: 0
				end: 0

			time:
				start: 0
				end: 0

			touch: false
			ease: "easeOutExpo"

		dragevent =
			down: "mousedown"
			up: "mouseup"
			leave: "mouseleave"
			move: "mousemove"

		mousedrag =
			down: "mousedown"
			up: "mouseup"
			leave: "mouseleave"
			move: "mousemove"

		touchdrag =
			down: "touchstart"
			up: "touchend"
			leave: "mouseleave"
			move: "touchmove"

		dragslider = this
		is_sticky = false
		@createPanel = (drag_object, move_object, constraint, touch, sticky) ->
			drag.element = drag_object
			drag.element_move = move_object
			is_sticky = sticky    if sticky? and sticky isnt ""
			if constraint? and constraint isnt ""
				drag.constraint = constraint
			else
				drag.constraint = false
			if touch
				drag.touch = touch
			else
				drag.touch = false
			trace "TOUCH" + drag.touch
			if drag.touch
				dragevent = touchdrag
			else
				dragevent = mousedrag
			makeDraggable drag.element, drag.element_move

		@updateConstraint = (constraint) ->
			trace "updateConstraint"
			drag.constraint = constraint

		@cancelSlide = (e) ->
			library.unbindEvent drag.element, onDragMove, dragevent.move
			true

		return