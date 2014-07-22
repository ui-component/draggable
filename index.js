
/**
 * dependencies.
 */

var emitter = require('emitter')
  , mouse = require('mouse')
  , events = require('events')
  , translate = require('translate')
  , classes = require('classes');

/**
 * export `Draggable`.
 */

module.exports = function(el){
  return new Draggable(el);
};

/**
 * initialize new `Draggable`.
 *
 * @param {Element} el
 * @param {Object} opts
 */

function Draggable(el){
  this._xAxis = true;
  this._yAxis = true;
  this.el = el;
}

/**
 * mixins.
 */

emitter(Draggable.prototype);

/**
 * build draggable.
 *
 * @return {Draggable}
 */

Draggable.prototype.build = function(){
  var el = this._handle || this.el;
  this.touch = events(el, this);
  this.touch.bind('touchstart', 'onmousedown');
  this.touch.bind('touchmove', 'onmousemove');
  this.touch.bind('touchend', 'onmouseup');
  this.mouse = mouse(el, this);
  this.mouse.bind();
  return this;
};

/**
 * on-mousedown
 */

Draggable.prototype.onmousedown = function(e){
  e.preventDefault();
  if (e.touches) e = e.touches[0];
  var rect = this.rect = this.el.getBoundingClientRect();
  this.ox = rect.left - this.el.offsetLeft;
  this.oy = rect.top - this.el.offsetTop;
  this.x = e.pageX - rect.left;
  this.y = e.pageY - rect.top;
  classes(this.el).add('dragging');
  this.emit('start');
};

/**
 * on-mousemove
 */

Draggable.prototype.onmousemove = function(e){
  if (e.touches) e = e.touches[0];
  var styles = this.el.style
    , x = this._xAxis ? e.pageX - this.x : this.ox
    , y = this._yAxis ? e.pageY - this.y : this.oy
    , rel = this.el
    , el
    , o;

  // support containment
  if (el = this._containment) {
    o = { y: y + rel.clientHeight };
    o.x = x + rel.clientWidth;
    o.height = el.clientHeight;
    o.width = el.clientWidth;
    o.h = o.height - rel.clientHeight;
    o.w = o.width - rel.clientWidth;
    if (0 >= x) x = 0;
    if (0 >= y) y = 0;
    if (o.y >= o.height) y = o.h;
    if (o.x >= o.width) x = o.w;
  }

  // move draggable.
  translate(this.el, x, y);

  // all done.
  this.emit('drag');
};

/**
 * on-mouseup
 */

Draggable.prototype.onmouseup = function(e){
  classes(this.el).remove('dragging');
  this.emit('end');
};

/**
 * destroy draggable.
 */

Draggable.prototype.destroy = function(){
  if (this.mouse) this.mouse.unbind();
  this.mouse = null;
  if (this.touch) this.touch.unbind();
  this.touch = null;
  return this;
};

/**
 * Disable x-axis movement.
 * @return {Draggable} 
 */

Draggable.prototype.disableXAxis = function(){
  this._xAxis = false;
  return this;
};

/**
 * Disable y-axis movement.
 * @return {Draggable}
 */

Draggable.prototype.disableYAxis = function(){
  this._yAxis = false;
  return this;
};

/**
 * Set a containment element.
 * @param  {Element} el 
 * @return {Draggable}    
 */

Draggable.prototype.containment = function(el){
  this._containment = el;
  return this;
};

/**
 * Set a handle.
 * @param  {Element} el 
 * @return {Draggable}    
 */

Draggable.prototype.handle = function(el){
  this._handle = el;
  return this;
};
