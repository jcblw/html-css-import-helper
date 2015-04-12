# HTML CSS import Helper

> This is just an experiment.

The idea behind this is to simply import css and html via a Handlebars Helper. Right now the api is very rough. Suggestions are welcome.

## Usage

 ```javascript
 var
  Handlebars = require('Handlebars'),
  ImportHelpers = require('./path-to/module'),
  options = {
    Handlebars: Handlebars
  }

new ImportHelpers('./components/**/*.html', options, function(err) {
  // if there is no error you now have the new Helpers
});
// this is async because all the readfiles
```

### Component Example

A component is just a `HTML` file. We register a `style` helper to allow you to import styles inline into your html. eg

```handlebars
{{!-- path/button.html --}}
{{style 'path/button.css'}}
<button {{#if className}}class="{{className}}"{{/className}}></button>
```

### Using component

```handlebars
{{!-- based off file name --}}
{{Button className="foo--button"}}
```

## Development

This ES6 all over it, so you'll need to compile it to actually run it `npm run build`. Also examples are using some ES6 as well so its best to run those with [iojs](https://iojs.org/en/index.html).
