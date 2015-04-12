// use iojs

'use strict'

const
  Handlebars = require('Handlebars'),
  ImportHelper = require('../compiled'),
  fs = require('fs'),
  path = require('path'),
  ws = fs.createWriteStream(path.resolve(__dirname, './output.html')),
  components = path.resolve(__dirname, './components/*.html'),
  mainPath = path.resolve(__dirname, './index.html'),
  mainTemplate = Handlebars.compile(fs.readFileSync(mainPath, 'utf8')),
  options = {
    Handlebars: Handlebars
  }

ws.on('close', console.log.bind(console.log, 'File output.html written'))

new ImportHelper(components, options, function(err) {
  if (err) throw err
  ws.write(mainTemplate({}))
  ws.end()
})
