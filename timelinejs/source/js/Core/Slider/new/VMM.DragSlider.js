(function() {
  define(["VMM.Library", "trace"], function(library, trace) {
    var DragSlider;

    return DragSlider = function() {
      var drag, dragEnd, dragMomentum, dragMove, dragStart, dragevent, dragslider, getLeft, is_sticky, makeDraggable, mousedrag, onDragEnd, onDragLeave, onDragMove, onDragStart, touchdrag;

      makeDraggable = function(drag_object, move_object) {
        library.bindEvent(drag_object, onDragStart, dragevent.down, {
          element: move_object,
          delement: drag_object
        });
        library.bindEvent(drag_object, onDragEnd, dragevent.up, {
          element: move_object,
          delement: drag_object
        });
        return library.bindEvent(drag_object, onDragLeave, dragevent.leave, {
          element: move_object,
          delement: drag_object
        });
      };
      onDragLeave = function(e) {
        library.unbindEvent(e.data.delement, onDragMove, dragevent.move);
        if (!drag.touch) {
          e.preventDefault();
        }
        e.stopPropagation();
        if (drag.sliding) {
          drag.sliding = false;
          dragEnd(e.data.element, e.data.delement, e);
          return false;
        } else {
          return true;
        }
      };
      onDragStart = function(e) {
        dragStart(e.data.element, e.data.delement, e);
        if (!drag.touch) {
          e.preventDefault();
        }
        return true;
      };
      onDragEnd = function(e) {
        if (!drag.touch) {
          e.preventDefault();
        }
        if (drag.sliding) {
          drag.sliding = false;
          dragEnd(e.data.element, e.data.delement, e);
          return false;
        } else {
          return true;
        }
      };
      onDragMove = function(e) {
        return dragMove(e.data.element, e);
      };
      dragStart = function(elem, delem, e) {
        if (drag.touch) {
          trace("IS TOUCH");
          library.css(elem, "-webkit-transition-duration", "0");
          drag.pagex.start = e.originalEvent.touches[0].screenX;
          drag.pagey.start = e.originalEvent.touches[0].screenY;
        } else {
          drag.pagex.start = e.pageX;
          drag.pagey.start = e.pageY;
        }
        drag.left.start = getLeft(elem);
        drag.time.start = new Date().getTime();
        library.stop(elem);
        return library.bindEvent(delem, onDragMove, dragevent.move, {
          element: elem
        });
      };
      dragEnd = function(elem, delem, e) {
        library.unbindEvent(delem, onDragMove, dragevent.move);
        return dragMomentum(elem, e);
      };
      dragMove = function(elem, e) {
        var drag_to, drag_to_y;

        drag_to = void 0;
        drag_to_y = void 0;
        drag.sliding = true;
        if (drag.touch) {
          drag.pagex.end = e.originalEvent.touches[0].screenX;
          drag.pagey.end = e.originalEvent.touches[0].screenY;
        } else {
          drag.pagex.end = e.pageX;
          drag.pagey.end = e.pageY;
        }
        drag.left.end = getLeft(elem);
        drag_to = -(drag.pagex.start - drag.pagex.end - drag.left.start);
        if (Math.abs(drag.pagey.start) - Math.abs(drag.pagey.end) > 10) {
          trace("SCROLLING Y");
          trace(Math.abs(drag.pagey.start) - Math.abs(drag.pagey.end));
        }
        if (Math.abs(drag_to - drag.left.start) > 10) {
          library.css(elem, "left", drag_to);
          e.preventDefault();
          return e.stopPropagation();
        }
      };
      dragMomentum = function(elem, e) {
        var drag_info, multiplier;

        drag_info = {
          left: drag.left.end,
          left_adjust: 0,
          change: {
            x: 0
          },
          time: (new Date().getTime() - drag.time.start) * 10,
          time_adjust: (new Date().getTime() - drag.time.start) * 10
        };
        multiplier = 3000;
        if (drag.touch) {
          multiplier = 6000;
        }
        drag_info.change.x = multiplier * (Math.abs(drag.pagex.end) - Math.abs(drag.pagex.start));
        drag_info.left_adjust = Math.round(drag_info.change.x / drag_info.time);
        drag_info.left = Math.min(drag_info.left + drag_info.left_adjust);
        if (drag.constraint) {
          if (drag_info.left > drag.constraint.left) {
            drag_info.left = drag.constraint.left;
            if (drag_info.time > 5000) {
              drag_info.time = 5000;
            }
          } else if (drag_info.left < drag.constraint.right) {
            drag_info.left = drag.constraint.right;
            if (drag_info.time > 5000) {
              drag_info.time = 5000;
            }
          }
        }
        library.fireEvent(dragslider, "DRAGUPDATE", [drag_info]);
        if (!is_sticky) {
          if (drag_info.time > 0) {
            if (drag.touch) {
              return library.animate(elem, drag_info.time, "easeOutCirc", {
                left: drag_info.left
              });
            } else {
              return library.animate(elem, drag_info.time, drag.ease, {
                left: drag_info.left
              });
            }
          }
        }
      };
      getLeft = function(elem) {
        return parseInt(library.css(elem, "left").substring(0, library.css(elem, "left").length - 2), 10);
      };
      drag = {
        element: "",
        element_move: "",
        constraint: "",
        sliding: false,
        pagex: {
          start: 0,
          end: 0
        },
        pagey: {
          start: 0,
          end: 0
        },
        left: {
          start: 0,
          end: 0
        },
        time: {
          start: 0,
          end: 0
        },
        touch: false,
        ease: "easeOutExpo"
      };
      dragevent = {
        down: "mousedown",
        up: "mouseup",
        leave: "mouseleave",
        move: "mousemove"
      };
      mousedrag = {
        down: "mousedown",
        up: "mouseup",
        leave: "mouseleave",
        move: "mousemove"
      };
      touchdrag = {
        down: "touchstart",
        up: "touchend",
        leave: "mouseleave",
        move: "touchmove"
      };
      dragslider = this;
      is_sticky = false;
      this.createPanel = function(drag_object, move_object, constraint, touch, sticky) {
        drag.element = drag_object;
        drag.element_move = move_object;
        if ((sticky != null) && sticky !== "") {
          is_sticky = sticky;
        }
        if ((constraint != null) && constraint !== "") {
          drag.constraint = constraint;
        } else {
          drag.constraint = false;
        }
        if (touch) {
          drag.touch = touch;
        } else {
          drag.touch = false;
        }
        trace("TOUCH" + drag.touch);
        if (drag.touch) {
          dragevent = touchdrag;
        } else {
          dragevent = mousedrag;
        }
        return makeDraggable(drag.element, drag.element_move);
      };
      this.updateConstraint = function(constraint) {
        trace("updateConstraint");
        return drag.constraint = constraint;
      };
      this.cancelSlide = function(e) {
        library.unbindEvent(drag.element, onDragMove, dragevent.move);
        return true;
      };
    };
  });

}).call(this);
