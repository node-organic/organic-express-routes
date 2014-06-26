var path = require("path")
var glob = require("glob-stream")
var sort = require('sort-stream')
var methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]

var loadHelpers = function(app, plasma, dna, done){
  var helpers = {}
  var routesHelpersRootPath = path.join(process.cwd(),dna.helpers)
  // glob for action helpers
  glob.create(path.join(routesHelpersRootPath, dna.pattern))
    .on("data", function(file){
      var helperId = file.path.split(routesHelpersRootPath).pop().replace("/","").replace(/\//g, path.sep)
      helperId = helperId.replace(path.extname(file.path), "").replace(new RegExp(path.sep,"g"), "/")
      helpers[helperId] = require(file.path)
      if(dna.log)
        console.log("loaded helper", helperId, "->",file.path.split(routesHelpersRootPath).pop())
    })
    .on("error", console.error)
    .on("end", function(){
      done(helpers)
    })
}

var loadActions = function(app, plasma, dna, helpers, done) {
  var routesRootPath = path.join(process.cwd(),dna.path)
  // glob for action handlers
  glob.create(path.join(routesRootPath,dna.pattern)).pipe(sort(function(a,b){
      if(a.path.indexOf("index") != -1 && b.path.indexOf("index") == -1)
        return -1
      if(a.path.indexOf("index") == -1 && b.path.indexOf("index") != -1)
        return 1
      if(a.path.indexOf("index") != -1 && b.path.indexOf("index") != -1)
        return 0
      if(a.path.indexOf("index") == -1 && b.path.indexOf("index") == -1)
        return 0
    }))
    .on("data", function(file){
      var builder = require(file.path)
      if(typeof builder !== "function") return
      var api = builder(plasma, dna, helpers);
      for(var key in api)
        if(key.indexOf(" ") !== -1 || methods.indexOf(key) !== -1) {
          var method = key.split(" ").shift()
          var url = file.path.split(routesRootPath).pop()
          var sep = path.sep == "\\" ? "\\\\" : path.sep;
          url = url.replace(path.extname(file.path), "").replace(new RegExp(sep,"g"), "/")
          if(key.indexOf(" ") !== -1)
            url += key.split(" ").pop()
          if(url.indexOf("/index") != -1)
            url = url.replace("/index", "")
          if(dna.mount)
            url = dna.mount+url
          if(url == "")
            url = "/"
          if(method == "*")
            app.all(url, api[key])
          else
            app[method.toLowerCase()](url, api[key])
          if(dna.log)
            console.log("mounted action ", "-", method, "-", url, "->",file.path.split(routesRootPath).pop())
        }
    })
    .on("error", console.error)
    .on("end", function(){
      done()
    })
}

module.exports = function(plasma, dna) {
  plasma.on(dna.reactOn, function(c){
    var app = c.data || c[0].data;
    if(dna.helpers && dna.path) {
      loadHelpers(app, plasma, dna, function(helpers){
        loadActions(app, plasma, dna, helpers, function(){
          if(dna.emitReady) 
            plasma.emit(dna.emitReady, true)
        })
      })
    }
    else
    if(dna.path)
      loadActions(app, plasma, dna, {}, function(){
        if(dna.emitReady) 
          plasma.emit(dna.emitReady, true)
      })
  })
}
