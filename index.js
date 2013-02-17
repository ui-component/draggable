
/**
 * dependencies.
 */

var configurable = require('configurable.js')
  , emitter = require('emitter')
  , mouse = require('mouse');

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
  this.mouse = mouse(this.el, this);
  this.mouse.bind();
  return this;
};

/**
 * on-mousedown
 */

Draggable.prototype.onmousedown = function(e){
  this.ox = el.offsetLeft;
  this.oy = el.offsetTop;
  this.x = e.pageX;
  this.y = e.pageY;
  this.emit('start');
};

/**
 * on-mousemove
 */

Draggable.prototype.onmousemove = function(e){
  this.el.style.left = this.ox + (e.pageX - this.x);
  this.el.style.top = this.oy + (e.pageY - this.y);
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
  return this;
};
