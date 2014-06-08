describe("actions with helpers", function(){
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
      "helpers": "tests/data/sample-route-helpers",
      "mount": "/myroutes",
      "emitReady": "ExpressRoutes"
    })
    plasma.emit(expressAppChemical)
    plasma.on("ExpressRoutes", function(){
      expect(expressAppChemical.routes["post"]["/myroutes"]()).toBe("helper index")
      next()
    })
  })
})