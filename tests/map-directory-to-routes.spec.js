describe("map directory to routes", function(){
  var Plasma = require("organic-plasma")
  var ExpressRoutes = require("../index")

  var MockExpressServerChemical = function(){
    this.type = "MockExpressServer";
    var app = this.data = {};
    var routes = this.routes = {};
    ["get", "post", "put", "delete"].forEach(function(method){
      app[method] = function(url, handler) {
        if(!routes[method])
          routes[method] = {}
        if(!routes[method][url]) {
          routes[method][url] = handler
        } else {
          var firsthandler = routes[method][url]
          routes[method][url] = []
          routes[method][url].push(firsthandler)
          routes[method][url].push(handler)
        }
      }
    })
  }

  it("loads all files in directory", function(next){
    var expressAppChemical = new MockExpressServerChemical()
    var plasma = new Plasma()
    var organelle = new ExpressRoutes(plasma, {
      "reactOn": "MockExpressServer",
      "pattern": "**/*.js",
      "path": "tests/data/sample-routes",
      "mount": "/myroutes",
      "emitReady": "ExpressRoutes"
    })
    plasma.emit(expressAppChemical)
    plasma.on("ExpressRoutes", function(){
      expect(expressAppChemical.routes["get"]).toBeDefined()
      expect(expressAppChemical.routes["get"]["/myroutes"]).toBeDefined()
      next()
    })
  })
  it("mounts index files before all siblings per directory", function(next){
    var expressAppChemical = new MockExpressServerChemical()
    var plasma = new Plasma()
    var organelle = new ExpressRoutes(plasma, {
      "reactOn": "MockExpressServer",
      "pattern": "**/*.js",
      "path": "tests/data/sample-routes",
      "emitReady": "ExpressRoutes"
    })
    plasma.emit(expressAppChemical)
    plasma.on("ExpressRoutes", function(){
      expect(expressAppChemical.routes["get"]).toBeDefined()
      expect(expressAppChemical.routes["post"]["/inner/fetch"].length).toBe(2)
      expect(expressAppChemical.routes["post"]["/inner/fetch"][0]()).toBe("index")
      next()
    })
  })
})