const fs = require('fs') // needed to read JSON file from disk
const Collection = require('postman-collection').Collection;
const beautify = require('beautify');

// Load a collection to memory from a JSON file on disk (say, sample-collection.json)
var collection = new Collection(JSON.parse(fs.readFileSync(process.argv[2]).toString()))
//console.log(collection)
var routes = [];
collection.forEachItem((a,b,c)=>{
  try {
    routes.push({method:a.request.method, route:a.request.url.getPath({unresolved:true})})
      console.log(a.request.method+addSpaces(8 - a.request.method.length )+a.request.url.getPath({unresolved:true}))
  } catch (e) { }
})

function addSpaces(num) {
  var spaces = "";
  for (var i = 0; i < num; i++) {
      spaces += ' ';
  }
  return spaces
}


console.log(JSON.stringify(routes, null, 4))
