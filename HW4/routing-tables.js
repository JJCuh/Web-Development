const path = require("path");
/**
 * For the first 3 routes you don't need to use the pathToRegexp
 * library. For the bottom 4 to match, you will
 */

const returnNotAllowed = function (res) {
  res.statusCode = 405;
  res.end();
};

module.exports = function (extraRoutes) {
  return Object.assign(
    {
      "/": function (req, res) {
        if (req.method !== "GET") {
          return returnNotAllowed(res);
        }

        res.statusCode = 200;
        res.write("Yay!, you hit the index route");
        res.end();
      },
      "/public/(.*)": function (req, res) {
        if (req.method !== "GET") {
          return returnNotAllowed(res);
        }
        res.statusCode = 200;
        const filePath = req.url.split("/");
        const response = [
          "If this were the lab, you would return the file at:",
          path.join(...filePath.splice(1)),
        ];
        res.write(response.join("\n"));
        res.end();
      },
      "/about": function (req, res) {
        if (req.method !== "GET") {
          return returnNotAllowed(res);
        }
        res.statusCode = 200;
        res.write("Would have fetched about.html page!");
        res.end();
      },
      "/visitors": function (req, res) {
        if (req.method !== "GET") {
          return returnNotAllowed(res);
        }

        const allVisitors = Object.keys(req.app.visitors);

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(allVisitors));
        res.end();
      },
      "/hello/:name": function (req, res) {
        if (req.method !== "GET") {
          return returnNotAllowed(res);
        }

        const visitor = req.params.name;
        const visits = req.app.visitors[visitor];

        let body = `Hello ${req.params.name}`;
        if (visits > 0) {
          body = `Hello again ${req.params.name}`;
        }

        res.statusCode = 200;
        res.write(body);
        res.end();
      },
      "/hello/from/:name": function (req, res) {
        if (req.method !== "POST") {
          return returnNotAllowed(res);
        }

        res.statusCode = 200;
        const visitor = req.params.name;
        if (!req.app.visitors[visitor]) {
          req.app.visitors[visitor] = 1;
        } else {
          req.app.visitors[visitor] += 1;
        }
        const visits = req.app.visitors[visitor];
        res.write(`Hello ${visitor}, you've dropped by ${visits} times.`);
        res.end();
      },
    },
    extraRoutes
  );
};
