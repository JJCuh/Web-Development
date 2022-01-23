const graph = require("./data-structures/graph");
const fs = require("fs");
const chalk = require("chalk");

const FILE_NAME = "./routes.csv";

const main = function (origin, destination) {
  const g = graph.Graph();

  /**
   * @task add event handlers here. Keep it all before the next
   * comment just so there's a bit of distinction in your code
   */
  g.eventPublisher.on("start", function(start_object) {
    console.log("4a", "start", start_object["origin"], start_object["destination"])
  })

  g.eventPublisher.on("not-found", function(not_found_object) {
    console.log("4b", "not-found", not_found_object)
  })

  g.eventPublisher.on("error", function(error_object) {
    console.log("err", "error", error_object)
  })

  g.eventPublisher.on("hub", function(hub_object) {
    console.log("4c", "hub", hub_object["path"])
  })

  g.eventPublisher.on("route-found", function(route_found_object) {
    console.log("4d", "route-found", route_found_object["path"])
  })

  /**
   * @task read the routes.csv file using the fs module. Use the encoding
   * utf-8 and pass a callback function
   *
   * This callback iterates separate each line in the file into
   * its two constituent airports. Add each edge into the graph using
   * the g.addEdge() method
   *
   * After that, it runs a the bfs algorithm to find a path between the origin
   * and destination
   */
   fs.readFile(FILE_NAME, "utf-8" , (err, data) => {
     if (err) {
       console.error(err)
       return
     }
     const lines = data.split("\n")
     for (let i = 0; i < lines.length; i++) {
        const ports = lines[i].split(",");
        g.addEdge(ports[0], ports[1])
     }
     g.bfs(origin, destination)
   })
};

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(
      chalk.red(
        `ERROR: must pass in 2 airports but only received ${args.length}`
      )
    );
    process.exit(1);
  }

  main(args[0], args[1]);
}

module.exports = main;

