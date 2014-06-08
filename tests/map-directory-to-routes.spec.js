describe("map directory to routes", function(){
  var Plasma = require("organic-plasma")
  var ExpressRoutes = require("../index")
  var MockExpressServerChemical = require("./helpers/mock-express-app-chemical")

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