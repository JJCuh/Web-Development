const express = require('express')
const app = express()
const path = require('path')
const http = require("http");
const fs = require('fs');
const mongodb = require("mongodb");

const REQUIRED_CONFIGURATION = [
  "username",
  "password",
  "address",
  "defaultDatabase",
  "port",
];

/**
 * @function setupServer
 * @description Initializes all the state necessary for the server.
 *
 * @param {Object} config - configuration object that hopefully contains all the server configuration
 * @returns { db: BattleshipCollection, port: number }
 */
 const setupServer = (config) => {
  // this section breaks up the mongoURL into its constituent parts
  const authentication = `${config.username}:${config.password}`;
  const address = `${config.address}/${config.defaultDatabase}`;
  const options = "retryWrites=true&w=majority";
  const mongoURL = `mongodb+srv://${authentication}@${address}?${options}`;

  // setup options for the MongoDB client. We haven't yet established
  // a connection, we're specifying HOW we want to connect.
  const client = new mongodb.MongoClient(mongoURL, {
    useUnifiedTopology: true,
  });

  // Connect once per server since the MongoClient will handle all the connection logic
  // Because we want to return a fully connected client + the port,
  // we can't use return client.connect() which returns a Promise itself.
  // Remember this server's configuration isn't JUST the database connection.
  const connectionPromise = client.connect();
  return connectionPromise.then(() => {
    return {
      port: config.port,
      db: BattleshipCollection(client.db(config.defaultDatabase)),
    };
  });
};

/**
 * @function catchJSONConfigFileReadingErrors
 * @description Handles any errors that might occur while reading a JSON file
 *  and exits the program with an approppriate message.
 *
 * @param {string} file - the name of the file that was attempted to be read
 * @param {Error} err - the error that was returned
 *
 * @exits
 */
 const catchJSONConfigFileReadingErrors = (file, err) => {
  // this checks specifically for any Syntax error. when JSON.parse fails
  // to prse JSON, it returns SyntaxaError
  if (err instanceof SyntaxError) {
    console.log(
      "file contents could not be decoded as JSON, verify the JSON is proper using a JSON linter"
    );
  } else if (err.code === "ENOENT") {
    console.log(`${file} was not found`);
  } else if (err.code === "EISDIR") {
    console.log(`${file} is a directory but a file was expected`);
  } else {
    console.log(err);
  }

  process.exit(1);
};

const sendBody = (res, statusCode, body = null) => {
  if (body && res.statusCode !== 500) {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...res.headers,
      };

      const responseBody =
        headers["Content-Type"] === "application/json"
          ? JSON.stringify(body)
          : body;

      res.writeHead(statusCode, http.STATUS_CODES[statusCode], headers);
      res.write(responseBody);
    } catch (err) {
      if (err instanceof SyntaxError) {
        res.writeHead(500);
      }
    }
  } else {
    res.writeHead(statusCode);

    if (res.statusCode === 500) {
      res.log.error = body;
    }
  }

  res.end();
  return Promise.resolve({
    statusCode,
    body,
  });
};

const readBody = function (req) {
  return new Promise(function (resolve) {
    let body = [];
    req
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        resolve(Buffer.concat(body).toString());
      });
  });
};

const BattleshipCollection = (db) => {
  // since we'll reuse the same collection for all our methods, we can declare
  // it here and it'll be available for all the methods to reuse.
  const collection = db.collection("battleship");


  app.use('/battleship', express.static(path.join(__dirname, '/public')))

  app.get('/battleship', function(req,res) {
    res.sendFile(path.join(__dirname + '/index.html'))
  });

  app.post('/reset',  (req, res) => {
    return readBody(req).then((body) => {
      const boards = JSON.parse(body);
      // check to make sure boards arent empty
      if (!boards) {
        return sendBody(res, 400);
      }
      const fileName = "player-" + boards["playerNumber"] + "-boards.json";
      fs.writeFile(fileName, JSON.stringify(boards), err => {
        if (err) {
          console.error(err);
          return;
        }
      });
      return sendBody(res, 201);
    });
  });

  app.post('/setBoard',  (req, res) => {
    return readBody(req).then((body) => {
      const boards = JSON.parse(body);
      // check to make sure boards arent empty
      if (!boards) {
        return sendBody(res, 400);
      }
      const fileName = "player-" + boards["playerNumber"] + "-boards.json";
      fs.writeFile(fileName, JSON.stringify(boards), err => {
        if (err) {
          console.error(err);
          return;
        }
      });
      return sendBody(res, 201);
    });
  });

  app.get('/updateBoards1',  (req, res) => {
    return collection
      .updateOne(board1, {
        $set: {
          board1: board2
        },
      })
      .then(() => {
        return collection.findOne(board1);
      });
  });

  app.get('/updateBoards2',  (req, res) => {
    return collection
      .updateOne(board2, {
        $set: {
          board2: board1
        },
      })
      .then(() => {
        return collection.findOne(board2);
      });
  });

  app.post('/attack1',  (req, res) => {
    return collection
      .updateOne(board1, {
        $set: {
          board1: board2
        },
      })
      .then(() => {
        return collection.findOne(board1);
      });
  });

  app.post('/attack2',  (req, res) => {
    return collection
      .updateOne(board2, {
        $set: {
          board2: board1
        },
      })
      .then(() => {
        return collection.findOne(board2);
      });
  });

  app.post('/setTurn',  (req, res) => {
    return collection
      .updateOne(turn, {
        $set: {
          turn: otherPlayer
        },
      })
      .then(() => {
        return collection.findOne(turn);
      });
  });

  app.get('/getTurn', () => {
      return collection.findOne(turn);
  });
};

/**
 * @function createServer
 * @description creates an HTTP server on the given port and passes the initial state
 * to every request listener
 *
 * @param {{ db: BattleshipCollection, port: number }} initializedServerState
 */
const createServer = (initializedServerState) => {
  const server = http.createServer(handleRequests(initializedServerState.db));
  server.listen(initializedServerState.port);
  console.log(
    `PID: ${process.pid}. Running on :${initializedServerState.port}`
  );
};

/**
 * @function main
 * @description the starting point for this program
 */
const main = () => {
  // __dirname in a node script returns the path of the folder where the current JavaScript file resides
  // so we can use path relative to this server.js file
  const mainDirectory = __dirname;

  // read configuration parameters from the config;.json file so
  // we can change configuration without changing our code
  const configurationFilePath = path.join(mainDirectory, "mongo.config.json");
  fs.readFile(configurationFilePath, "utf-8")
    .then((configRawContents) => {
      const config = JSON.parse(configRawContents);

      // before using the configuration file, make sure we have all the required keys
      const missingKeys = [];
      for (const key of REQUIRED_CONFIGURATION) {
        if (!config[key]) {
          missingKeys.push(key);
        }
      }

      if (missingKeys.length > 0) {
        console.log(
          `Configuration is invalid. Missing the following keys: ${missingKeys}`
        );
        process.exit(1);
      }

      return setupServer(config);
    })
    .catch((err) => {
      catchJSONConfigFileReadingErrors(configurationFilePath, err);
    })
    .then(createServer);
};

main();