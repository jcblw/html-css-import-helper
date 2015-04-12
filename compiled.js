'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var fs = require('fs'),
    glob = require('glob'),
    path = require('path'),
    extend = require('extend');

/*
  ImportHelper
  =============
  a way to imports css based components into Handlebars Helpers

  @todo consider making this all sync for sake of not haveing to wait for callback
*/

var ImportHelper = (function () {
  function ImportHelper() {
    var globpath = arguments[0] === undefined ? '*' : arguments[0];
    var options = arguments[1] === undefined ? {} : arguments[1];
    var callback = arguments[2] === undefined ? function () {} : arguments[2];

    _classCallCheck(this, ImportHelper);

    this.options = options;
    this.Handlebars = options.Handlebars;
    this.data = options.data;
    this.callback = callback;
    this.Handlebars.registerHelper('style', styleHelper(this.Handlebars));
    glob(globpath, this.onFiles.bind(this));
  }

  _createClass(ImportHelper, [{
    key: 'onFiles',
    value: function onFiles(err, files) {
      if (err) {
        return this.callback(err);
      }
      var extension = this.options.extension;
      var components = files.filter(ImportHelper.filterExtension(extension));

      this.getComponents(components);
    }
  }, {
    key: 'getComponents',
    value: function getComponents() {
      var _this = this;

      var components = arguments[0] === undefined ? [] : arguments[0];

      if (!components.length) {
        return this.callback(new Error('No components found'));
      }
      ImportHelper.readFiles(components, function (err, contents) {
        if (err) return _this.callback(err);
        _this.compileComponents(contents);
      });
    }
  }, {
    key: 'compileComponents',
    value: function compileComponents() {
      var components = arguments[0] === undefined ? {} : arguments[0];

      var Handlebars = this.Handlebars;
      var key = undefined;

      for (var _key in components) {
        var template = Handlebars.compile(components[_key]),
            fileName = _key.split('/').pop().split('.').shift(),
            helperName = fileName.charAt(0).toUpperCase() + fileName.slice(1);

        Handlebars.registerHelper(helperName, ImportHelper.componentHelper(template, Handlebars));
      }
      this.callback();
    }
  }], [{
    key: 'componentHelper',
    value: function componentHelper(template, Handlebars) {
      return function (options) {
        var payload = extend(true, {}, this, options.hash);
        return new Handlebars.SafeString(template(payload));
      };
    }
  }, {
    key: 'readFiles',
    value: function readFiles() {
      var files = arguments[0] === undefined ? [''] : arguments[0];
      var callback = arguments[1] === undefined ? function () {} : arguments[1];

      var amountLoaded = 0;

      var contents = {},
          amount = files.length;

      function done(err, content) {
        if (err) {
          return callback(err);
        }contents[files[amountLoaded]] = content;
        amountLoaded++;
        if (amountLoaded === amount) {
          return callback(null, contents);
        }
        fs.readFile(files[amountLoaded], 'utf8', done);
      }

      fs.readFile(files[0], 'utf8', done);
    }
  }, {
    key: 'filterExtension',
    value: function filterExtension() {
      var ext = arguments[0] === undefined ? 'html' : arguments[0];

      var pattern = new RegExp(ext + '$');
      return function filterExtensionIterator(file) {
        return !!file.match(pattern);
      };
    }
  }]);

  return ImportHelper;
})();

// need to figure out a way to make pathing better
// possibly re register with base path
function styleHelper(Handlebars) {
  return function deferredStyleHelper(stylePath) {
    var filePath = path.resolve(__dirname, stylePath),
        content = fs.readFileSync(filePath, 'utf8'),
        contentHTML = '<style type="text/css">\n' + content + '\n</style>';
    return new Handlebars.SafeString(contentHTML);
  };
}

module.exports = ImportHelper;
// success
// start this thing
