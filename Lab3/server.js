const chalk = require("chalk");
const fs = require("fs/promises");
const http = require("http");
const { resolve } = require("path");
const { TaskList } = require("./task-list/task-list");
const readBody = require("./utils/read-body");
const sendResponse = require("./utils/send-response");

const handleRequest = function (tasklist, file) {
  /**
   * @function requestHandler
   * For documentation check: https://nodejs.org/docs/latest-v14.x/api/http.html#http_http_createserver_options_requestlistener
   * This function will get really long and that's okay. It allows you
   * to have access to the tasklist and file variables wherever necessary
   *
   */
  
  return function (req, res) {
    /**
     * Reference for Status Codes https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
     * Check the lab handout for most information.
     *
     * @task (1) Handle requests when the _url_ is "/tasks"
     *  (a) if the request method is GET return all the tasks in default sort order with the OK status code
     */

    if (req.url ==='/tasks') {
      // for any method not get
      if (req.method !== "GET") {
        return sendResponse(res, 405)
      }
      // get array of sorted tasks
      const tasks = tasklist.readAllTasks(tasklist.TaskListOrder.CompletedDate)
      res.statusCode = 200 // sending 200 response
      res.setHeader("Content-Type", "application/json")
      res.write(JSON.stringify(tasks)) // write string of tasks to response
      res.end()
    }

    /** 
      * @task (2) Handle requests when the _url_ _startsWith "/task"
      *  (a) If the request method is POST, the url will be just "/task", then you should
      *      _read the body_ of the request to see the description of the task
      *      that's being sent. Commit that to both the in memory structure and a local file called 'tasks'
      *  (b) For requests where the method is GET, PUT, and DELETE, return the following status codes
      *    BAD_REQUEST - if there was no id provided
      *    NOT_FOUND - if there specified id was not provided
      *    NO_CONTENT, ACCEPTED, OK - if the response was successful, but you'll have to figure out which is which.
      *  (c) For requests where the method is anything else, return the status code for METHOD_NOT_ALLOWED.
      */

    else if (req.url === '/task') {
      // return 405 when method has no handler
      if (!(req.method === 'GET' || req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE')) {
        return sendResponse(res, 405)
      }
      else if (req.method !== 'POST') {
      // return 400 if no ID passed in and not POST
        return sendResponse(res, 400, "no ID passed in")
      }
      else {
        return readBody(req).then(function(body) {
          if (body) {
            tasklist.createTask(body)
            return sendResponse(res, 201, body)
          }
          return sendResponse(res, 400)
        }).then(function() {
          return fs.writeFile(file, tasklist.serializeTasks())
        });
        /*
        return new Promise(function (resolve) {
          tasklist.createTask() // creating new task
          // writing new tasks to file
          const tasks = tasklist.readAllTasks()
          file = fs.writeFile("POST", JSON.stringify(tasks.tasks), () => {
          })
          resolve(sendResponse(res, 201, "test task"))
        })
        */
        /* Tried using readBody code below, but couldn't get it to work :(
        readBody(req).then(function(body) {
          if (body) {
            tasklist.createTask(body)
            sendResponse(res, 201, body)
          }
          tasklist.createTask()
          sendResponse(res, 400)
        })
        */
      }
    }
    
    // @task (4) For any request that _mutates_ data, write all the tasks out to a tasks file
    else if (req.url.match(/\/task\/([0-200]+)/)) { // regex for all /task with an id
      const id = req.url.split("/")[2]
      check = tasklist.isTask(id)
      if (!check) {
        return sendResponse(res, 404, task.toString()) // if not in tasklist
      } 
      if (req.method === 'GET') {
        task = tasklist.readTask(id).task
        return sendResponse(res, 200, task.toString())
      }
      else if (req.method === 'PUT') {
        task = tasklist.completeTask(id).task
        return new Promise(function (resolve) {
          // writing new tasks to file
          const tasks = tasklist.readAllTasks()
          file = fs.writeFile("PUT", JSON.stringify(tasks.tasks), () => {
          })
          resolve(sendResponse(res, 200, task.toString()))
        })
      }
      else if (req.method === 'DELETE') {
        tasklist.deleteTask(id)
        return new Promise(function (resolve) {
          // writing new tasks to file
          const tasks = tasklist.readAllTasks()
          file = fs.writeFile("DELETE", JSON.stringify(tasks.tasks), () => {
          })
          resolve(sendResponse(res, 204))
        })
      }
    }
    
    // @task (3) Handle requests when the _url_ is anything else, return the status code for NOT_FOUND
    else {
      return sendResponse(res, 404, "URL not found")
    }
  };
};

if (require.main === module) {
  const tl = TaskList();
  let server = http.createServer(handleRequest(tl, "tasks"));
  server.listen(8080);

  /**
   * @task (1) read the tasks file using fs/promises
   *  (a) if the contents are a parseable JSON array, then load those tasks into the task list and start the server
   *  (b) if the file doesn't exist, print a message to the console and then start the server
   *  (c) if the file exists but the content is not a _parseable_ _JSON_ _array_, print a message to the console and use process.exit(1)
   * @task (2) after you've finished this block, remove the server.listen above and instead,
   *   and find where to put it below (after handling errors)
   *
   */
}

module.exports = handleRequest;
