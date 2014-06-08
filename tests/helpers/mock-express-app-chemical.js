module.exports = function(type){
  this.type = type || "MockExpressServer";
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