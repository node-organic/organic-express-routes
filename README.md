# organic-express-routes v0.1.0

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
    
## usage 101

Having directory structure 

  ```
  + project_root
  |-+ routes
    |-+ api
      |-+ users
        |-+ _user
          |- index.js
          |- validate.js
        |- index.js 
      |- index.js
      |- version.js
    |-+ site
      |- index.js
      |- about.js
  ```

* assuming every `.js` file contains the following source

        ```
        module.exports = function(plasma, dna, helpers) {
          return {
            "GET": function(req, res, next){
              console.info(req, res, next)
            }
          }
        }
        ```

* assuming organic-express-routes has been initiated with following dna

        ```
        {
          "path": "routes/api",
          "mount": "/api",
          ...
        }
        ```

Will mount all found actions within files respecting their location relative to the `dna.path` property value in the following **order**:

| route | file |
| ----- | ---- |
| GET /api | /api/index.js |
| GET /api/version | /api/version.js |
| GET /api/users | /api/users/index.js |
| GET /api/users/:user | /api/users/_user/index.js |
| GET /api/users/:user/validate | /api/users/_user/validate.js |

