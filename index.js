
/**
 * dependencies.
 */

var configurable = require('configurable.js')
  , emitter = require('emitter')
  , mouse = require('mouse')
  , events = require('events');

/**
 * export `Draggable`.
 */

module.exports = function(el, opts){
  return new Draggable(el, opts);
};

/**
 * initialize new `Draggable`.
 *
 * @param {Element} el
 * @param {Object} opts
 */

function Draggable(el, opts){
  this.settings = {};
  this.enable('x');
  this.enable('y');
  this.set(opts || {});
  this.el = el;
}

/**
 * mixins.
 */

configurable(Draggable.prototype);
emitter(Draggable.prototype);

/**
 * build draggable.
 *
 * @return {Draggable}
 */

Draggable.prototype.build = function(){
  var el = this.get('handle') || this.el;
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
  this.x = e.pageX - rect.left;
  this.y = e.pageY - rect.top;
  this.emit('start');
};

/**
 * on-mousemove
 */

Draggable.prototype.onmousemove = function(e){
  if (e.touches) e = e.touches[0];
  var styles = this.el.style
    , x = e.pageX - this.x
    , y = e.pageY - this.y
    , rel = this.el
    , el
    , o;

  // support containment
  if (el = this.get('containment')) {
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
  if (this.enabled('x')) styles.left = x + 'px';
  if (this.enabled('y')) styles.top = y + 'px';

  // all done.
  this.emit('drag');
};

/**
 * on-mouseup
 */

Draggable.prototype.onmouseup = function(e){
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
