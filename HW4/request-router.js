/**
 * @task1 Questions
 *
 * 1. What are all the routes that this server can handle?
 * /, /public/(.*), /about, /visitors, /hello/:name, /hello/from/:name
 * 
 * 2. How do you send a request to the server when the port is 8080?
 * .listen(8080);
 * 
 * 3. What is printed (only for the last request) when you send 5
 *    requests to /hello/from/arman and then 1 request to /visitors?
 * "Hello Arman, you've dropped by 5 times." /visitors will return a string of all visitors.
 * 
 * 4. What file is requested if you make a request to /public/foo/bar/baz?
 * baz
 * 
 * 5. For the /hello/:name route, what properties from req are used?
 * params and app
 * 
 * 6. What is the value of the Content-Type header for the /visitors route?
 * application/json
 * 
 * 7. What are the two request methods this server wiil receive?\
 * GET and POST
 * 
 * 8. What status code is sent back if you send a request not using one of the specified request methods?
 * 405
 * 
 * 9. What function is used to write the body of a response?
 * res.write()
 * 
 * 10. How do you start the server but not the grading script?
 * node /request-router.js
 *
 */

const http = require("http");
const pathToRegexp = require("path-to-regexp");
const createRoutingTable = require("./routing-tables");

/**
 * @task5 extract the path from the request object and try to
 * match it against the routing table that's held in the app
 * state.
 */
const routeRequest = function (req) {
  if (req.url === undefined){
    req.params = ''
    return
  }
  analyze = req.url.split('/')
  params = ''
  if (analyze.length <= 2){
    //there is no params
  } else{
    params = analyze[2]
  }
  req.params = params

  if (analyze.length === 4){
    console.log(req.app.routes['/hello/from/:name'])
    req.app.visitors.push(analyze[3])
    req.app.visitors[analyze[3]]++
    console.log(req.app.visitors)
    return (req, res) => { res.statusCode = 404 }
  }
  else if(analyze.length == 3){
    if (analyze[1] === 'hello') {
      return (req, res) => { res.statusCode = 404 }
    } else if(analyze[1] === 'public') {
      return (req, res)=> { res.statusCode=404 }
    }
  }
  else if(analyze.length == 2){
    if (analyze[0] === '' && analyze[1] === '')
      return req.app.routes['/']
    } else {
      return (req,res)=>{res.statusCode = 404}
    }
};

/**
 * @task3 Create a higher-order function that takes in an object
 * to be used as the application state and returns a function that
 * can be used as the callback for http.createServer
 */
const requestListener = function (appState) {

  return requestListenerCallback = (req, res) => {
    
    req.app = appState
    
    //req.params = "something not undefined"
    hi = routeRequest(req)
    if (hi !== undefined){
      hi(req, res)
    }

  }
  
  /**
   * @task4 Add 2 new properties to each request object, then
   * try to route the request by calling the routeRequest function
   * from above. If no request is matched, remember to send the
   * proper status code. If it is, then call the assocaited handler.
   * @hint - For the types of req and res, look here
   * https://nodejs.org/api/http.html#http_http_createserver_options_requestlistener
   * 
   */
};

/**
 * This if statement ensures the server is only started when run
 * using `node server.js <port>`. When you use the grading script,
 * this file won't be the "main module" so the condition
 * evaluates to false.
 */
if (require.main === module) {
  const port = process.argv[2];
  if (!port) {
    console.error("port is a required argument");
    process.exit(1);
  } else if (port < 1000) {
    console.warn(
      "You might have some issues if your port is less than 1000. Try using 8080"
    );
  }

  /**
   * @task2 Create an http server that uses the requestListener function
   * as the callback for when requests are received. Start the server
   * on the port from above
   */ 

  const intialAppState = {
    visitors: [],
    routes: createRoutingTable(),
  };

  http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.write(`server running on port ${port}`);
    res.end();
  }).listen(port, requestListener(initialAppState));
}

module.exports = {
  requestListener,
};
