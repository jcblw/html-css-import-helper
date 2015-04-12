// use iojs

'use strict'

const
  Handlebars = require('Handlebars'),
  ImportHelper = require('../compiled'),
  fs = require('fs'),
  path = require('path'),
  components = path.resolve(__dirname, './components/*.html'),
  mainPath = path.resolve(__dirname, './index.html'),
  mainTemplate = Handlebars.compile(fs.readFileSync(mainPath, 'utf8')),
  options = {
    Handlebars: Handlebars
  }

new ImportHelper(components, options, function(err) {
  if (err) throw err;
  console.log(mainTemplate({}))
})
