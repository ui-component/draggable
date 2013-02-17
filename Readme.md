
# draggable

  make any element draggable.

## Installation

    $ component install ui-component/draggable

## Example

```js
var el = document.querySelector('#el');
var draggable = require('draggable')(el);
draggable.build();
```

## API

### draggable(el[, opts])

  Create a new `Draggable` with `el` and optional `opts` object.

### draggable.build()

  bind all events.

### draggable.destroy()

  unbind all events.

## License

  MIT
