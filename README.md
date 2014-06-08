# organic-express-routes

Organelle for `glob`-ing a directory of actions modules and mounting them to expressjs app

## dna

    {
      "source": "node_modules/organic-express-routes",
      "reactOn": "ExpressServer",
      "pattern": "/**/*.js",
      "path": "path/to/routes",
      "helpers": "path/to/routes-helpers",
      "mount": "/myroutes",
      "log": false,
      "emitReady": "ExpressRoutes"
    }

### `reactOn` property

Should be either `ExpressServer` chemical with [expected structure](https://github.com/outbounder/organic-express-server#emitready-chemical) or array of chemicals where the first one is mapped as `ExpressServer` chemical.

### `helpers` property

Optional, if provided with directory path will load all files matching given `pattern`. 

### `mount` property

Optional, if provided all route handlers will be mounted to express app with given value as prefix.

### `emitReady` property

Indicates the type of the chemical to be emitted once loading and mounting is complete

## action module format

    module.exports = function(plasma, dna, helpers) {
      return {
        "GET": expressHandler,
        "POST": [expressHandler, ...],
        "PUT /:id": expressHandler,
        "DELETE /inner/url/:id": helpers["expressHandlerBuilder"](),
        "OPTIONS": function(req, res, next) {
          next()
        }
      }
    }