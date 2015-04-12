
const
  fs = require('fs'),
  glob = require('glob'),
  path = require('path'),
  extend = require('extend')


/*
  ImportHelper
  =============
  a way to imports css based components into Handlebars Helpers

  @todo consider making this all sync for sake of not haveing to wait for callback
*/

class ImportHelper {
  constructor(globpath = '*', options = {}, callback = function(){}) {
    this.options = options;
    this.Handlebars = options.Handlebars
    this.data = options.data
    this.callback = callback
    this.Handlebars.registerHelper('style', styleHelper(this.Handlebars))
    glob(globpath, this.onFiles.bind(this))
  }

  onFiles(err, files) {
    if (err) return this.callback(err);

    const
      {extension} = this.options,
      components = files.filter(ImportHelper.filterExtension(extension))

    this.getComponents(components)
  }

  getComponents(components = []) {
    if (!components.length) {
      return this.callback(new Error('No components found'))
    }
    ImportHelper.readFiles(components, (err, contents) => {
      if (err) return this.callback(err)
      this.compileComponents(contents)
    })
  }

  compileComponents(components = {}) {
    const
      Handlebars = this.Handlebars
    let
      key

    for (let key in components) {
      let
        template = Handlebars.compile(components[key]),
        fileName = key.split('/').pop().split('.').shift(),
        helperName = fileName.charAt(0).toUpperCase() + fileName.slice(1)

      Handlebars.registerHelper(helperName, ImportHelper.componentHelper(template, Handlebars))
    }
    this.callback() // success
  }

  static componentHelper(template, Handlebars) {
    return function(options) {
      let payload = extend(true, {}, this, options.hash)
      return new Handlebars.SafeString(template(payload))
    }
  }

  static readFiles(files = [''], callback = function(){}) {
      let
        amountLoaded = 0

      const
        contents = {},
        amount = files.length

      function done(err, content) {
        if (err) return callback(err)
        contents[files[amountLoaded]] = content
        amountLoaded++
        if (amountLoaded === amount) {
          return callback(null, contents)
        }
        fs.readFile(files[amountLoaded], 'utf8', done)
      }

      fs.readFile(files[0], 'utf8', done) // start this thing
  }

  static filterExtension(ext = 'html') {
    const pattern = new RegExp(ext + '$')
    return function filterExtensionIterator(file) {
      return !!file.match(pattern)
    }
  }
}

// need to figure out a way to make pathing better
// possibly re register with base path
function styleHelper(Handlebars) {
  return function deferredStyleHelper(stylePath) {
    const
      filePath = path.resolve(__dirname, stylePath),
      content = fs.readFileSync(filePath, 'utf8'),
      contentHTML = `<style type="text/css">\n${content}\n</style>`
    return new Handlebars.SafeString(contentHTML)
  }
}

module.exports = ImportHelper
