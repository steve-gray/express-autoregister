# express-autoregister
Automatic route registration for Express based NodeJS applications, using
folder structure to map parent paths for routes.

## Installation
To install:

    npm install --save express-autoregister

## Usage
When initializing your express application:


    const appRoot = require('app-root-path');
    const autoregister = require('express-autoregister');
    const path = require('path');
    
    ... much code, such happy ...
    
    app.use(autoregister({
      routes: path.join(appRoot.toString(), '/routes')
    });

## Conventions
It is assumed that `/routes` in the example above is an appplication-root
relative folder. Inside that folder, there might be folders such as:

    /api
        /status
            default.js

Where default.js contains:

    const router = require('express').Router();
    router.get('/', (req, res, next) => {
        res.render('index'); // Assumes handlebars or similar
    });

    module.exports = router;

The autoregister library will then create this path as:

    `http://<base-url>/api/status`

In short, you can now avoid all the require() work needed to nest
up your routing for Express. This allows you to change operation
structures very easily during development.

*Routes are pathed relative to their parent directory*
# Troubleshooting
To troubleshoot on Windows:

    SET DEBUG=express-autoregister

On Mac/Linux:

    export DEBUG=express-autoregister

This will produce debug output such as:

    express-autoregister Starting automatic route registration +0ms
    express-autoregister    Starting directory /Users/steveg/Desktop/workspace/linehaul/linehaul-web/src/routes +4ms
    express-autoregister    Router is the root, no parent-attach. +1ms
    express-autoregister    Recursing child: help +1ms
    express-autoregister       Starting directory /Users/steveg/Desktop/workspace/linehaul/linehaul-web/src/routes/help +0ms
    express-autoregister       Router is a child of a parent, attaching under path: /help +0ms
    express-autoregister       Loading JS module via require(/Users/steveg/Desktop/workspace/linehaul/linehaul-web/src/routes/help/index.js) +1ms
    express-autoregister       Appending route to hierarchy +1ms
    express-autoregister       Finished directory /Users/steveg/Desktop/workspace/linehaul/linehaul-web/src/routes/help +0ms
    express-autoregister    Recursing child: help +0ms
    express-autoregister       Starting directory /Users/steveg/Desktop/workspace/linehaul/linehaul-web/src/routes/help +0ms
    express-autoregister       Router is a child of a parent, attaching under path: /help +0ms
    express-autoregister       Loading JS module via require(/Users/steveg/Desktop/workspace/linehaul/linehaul-web/src/routes/help/index.js) +1ms
    express-autoregister       Appending route to hierarchy +0ms
    express-autoregister       Finished directory /Users/steveg/Desktop/workspace/linehaul/linehaul-web/src/routes/help +0ms
    express-autoregister    Finished directory /Users/steveg/Desktop/workspace/linehaul/linehaul-web/src/routes +0ms
    express-autoregister Route mapping completed +0ms

This will allow you to see what is happening and why.

# Contributions
Licensed under the MIT license. Please submit improvments as Github issues.