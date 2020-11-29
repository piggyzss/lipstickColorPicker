const jsonConcat = require('json-concat')
const fs = require('fs')

// an array of filenames to concat
const files = []

// or whatever directory you want to read
const theDirectory = __dirname
fs.readdirSync(theDirectory).forEach((file) => {
  // you may want to filter these by extension, etc. to make sure they are JSON files
  files.push(file)
})

jsonConcat({
  src: files,
  dest: "./index.json"
}, function (json) {
  console.log(json)
})
