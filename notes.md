# CSS Components

CSS components are components that are reusable that only use html and css.

## Component

A component consist of two things HTML, and CSS. These two things should come together with one include.

## Handlebars

Right now this would be the templating engine of choice but this should be built in a way that it can be swapped seemlessly.

```javascript
var
  Handlebars = require('Handlebars'),
  importHelper = require('import-helper');

importHelper.register('./components/**/*', Handlebars, function(err) {
  // done registering / inlining assets for helpers.
});
```

```handlebars
<!doctype html>
<meta charset ="utf8" />
<body>
  {{!-- imports css and --}}
  {{Gallery images=imageSet className="custome-class"}}
</body>
```
