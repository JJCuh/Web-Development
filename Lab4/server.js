const chalk = require("chalk");
const fs = require("fs/promises");
const http = require("http");
const path = require("path");
const routes = require("./routes");

/**
 * @task create a Routing Table which maps a URL string to a
 * function.
 */
const RoutingTable = {
  "/": routes.home,
  "/public": routes.public,
  "/about": routes.about,  
};

/**
 * @function routeRequest
 * @description Given a request object from Node.js, returns
 *              a handler function to call. Also assigns the
 *              req.params object to any parameters in the request.
 *              For parsing parameters in a URL, it should use
 *              the path-to-regexp library - https://github.com/pillarjs/path-to-regexp
 * @param {http.ClientRequest} req - The http.ClientRequest to route
 * @returns {function(http.ClientRequest, httpClientResponse)} a request handler
 */
const routeRequest = function (req) {
  // determining the best match according to our routing table
  req.params = ''
  if (!req.url) {
    return function(req, res) { 
      res.statusCode = 404
      res.end()
    };
  }
  if (req.url === '/') {
    return RoutingTable['/']
  }
  else if(req.url === '/about') {
    return RoutingTable['/about']
  }
  else if(req.url === '/public') {
    req.pathname = ''
    return RoutingTable['/public']
  }
  else if(req.url.match(/\/public\/(.*)/)) {
    req.pathname = req.url.split("/")[2]
    return RoutingTable['/public']
  }
  else {
    return function(req, res) { 
      res.statusCode = 404
      res.end()
    };
  }
};

/**
 * @function requestListener
 * @description Routes the http.ClientRequest based on the pathname. This will
 *              be similar to classwork we do in Week 5.
 *
 * @param {http.ClientRequest} req - The http.ClientRequest to route
 * @param {http.ServerResponse} res - the http.ServerResponse that will be sent
 *
 * @returns
 */
const requestListener = function (req, res) {
  /**
   * Take the body of the anonymous function returned from the requestListener homework
   * and paste it into here. You want the code that starts with return function(req, res)
   */   

  // defining req.app structure
  req.app = {
    staticFilesDirectory: process.argv[2],
    cache: {},
  }

  // if already in cache and "fresh" enough, then return stored data
  if (req.app.cache[req.url]) {
    console.log(Date.now)
    if (Date.now - req.app.cache[req.url].cachedAtMs <= 100000) {
      return req.app.cache[req.url].result
    }
  }

  // otherwise call routeRequest
  else {
    let routeMatch = routeRequest(req)
    // if successful, it should be a function
    if (routeMatch) {
      routeMatch(req, res)
    }
  }
};

// This block only gets run when you invoke this as "node server.js <args>"
// This block will NOT be run when you use "npm run grade".
if (require.main === module) {
  /**
   * @task Make sure that you take in 1 command line argument
   * which specifies where all the static files are.
   */
  
   const arg = process.argv[2];
   if (!arg) {
     console.error("argument is required");
     process.exit(1);
   }
   
  /**
   * @task Create and start a server using `http.createServer`. If
   * the request has a url field, route it using the Routing Table
   * created above. If it doesn't exist, send a 404.
   */

  http.createServer(requestListener).listen(8080);

}

module.exports = { requestListener };


