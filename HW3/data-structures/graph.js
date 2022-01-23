const events = require("events");
const path = require("path");
const Queue = require("./queue");

const HUB_AIRPORTS = ["ATL", "LAX"];

const Graph = function () {
  // because this variable is declared up here, you don't need
  // to use this.eventPublisher, you can just use eventPublisher
  const eventPublisher = new events.EventEmitter();

  return {
    eventPublisher,
    edges: [],
    vertices: [],

    /**
     * @function addVertex
     * @param {string} airportCode
     * @description adds a vertex into the graph
     *
     * YOU DO NOT NEED TO EDIT THIS FUNCTION
     */
    addVertex: function (airportCode) {
      const code = airportCode.toUpperCase();

      if (this.vertices[code]) {
        return;
      }

      const vertex = {
        code,
        connections: [],
      };

      this.edges[code] = vertex.connections;
      this.vertices[code] = vertex;

      return vertex;
    },

    /**
     * @function addEdge
     * @param {string} origin
     * @param {string} destination
     * @description adds an edge between origin and destination into the graph
     *              adding the vertices to the graph if it doesn't already exist
     *
     * YOU DO NOT NEED TO EDIT THIS FUNCTION
     */
    addEdge: function (origin, destination) {
      const originAirportCode = origin.toUpperCase();
      const destinationAirportCode = destination.toUpperCase();

      if (!this.vertices[originAirportCode]) {
        this.addVertex(origin);
      }
      if (!this.vertices[destinationAirportCode]) {
        this.addVertex(destination);
      }

      if (!this.edges[originAirportCode].includes(destinationAirportCode)) {
        this.edges[originAirportCode].push(destinationAirportCode);
        this.edges[destinationAirportCode].push(originAirportCode);
      }
    },

    /**
     * @function bfs
     * @param {string} origin - the starting airport code
     * @param {string} description - the ending airport code
     *
     * @tasks
     * NOTE: make sure that you use the exact event type in quotes.
     *
     * 1. publish a "not-found" event to anyone listening when either the origin
     *    or the destination do not exist. The data that is sent with the event
     *    should be a string containing the airport code that was not found
     * 2. publish an "err" event if the origin and destination airport code are the
     *    same. The data should be the origin passed in.
     * 3. publish a "start" event once the bfs algorithm has started, the data should be an object
     *    with the keys "origin" and "destination"
     * 4. publish a "route-found" event once a path has been found between the origin and destination
     *    the data should be an object with a "hops" key that has the number of airports it took to
     *    get to the destination and "path" which is an array containing the airports that connect
     *    origin and destination
     * 5. publish a "hub" event if we land in a hub airport (defined above). the data will be the
     *    same as the "route-found" event
     */
    bfs: function (origin, destination) {
      const originAirportCode = origin.toUpperCase();
      const destinationAirportCode = destination.toUpperCase();
      
      const seen = {};
      const paths = {};
      const q = Queue();

      // Q3
      if (!this.vertices[originAirportCode]) {
        eventPublisher.emit("not-found", originAirportCode);
        return null;
      }
      if (!this.vertices[destinationAirportCode]) {
        eventPublisher.emit("not-found", destinationAirportCode);
        return null;
      }
      if (this.vertices[originAirportCode] === this.vertices[destinationAirportCode]) {
        eventPublisher.emit("err", originAirportCode);
        return null;
      }
      eventPublisher.emit("start", {
        origin: originAirportCode,
        destination: destinationAirportCode,
      });

      for (const neighbor of this.vertices[originAirportCode].connections) {
        seen[neighbor] = true;
        paths[neighbor] = [originAirportCode, neighbor];

        if (HUB_AIRPORTS[0] === neighbor || HUB_AIRPORTS[1] === neighbor) {
          eventPublisher.emit("hub", {
            hops: paths[neighbor].length,
            path: paths[neighbor],
          });
        }

        if (destinationAirportCode === neighbor) {
          eventPublisher.emit("route-found", {
            hops:paths[neighbor].length-1,
            path:paths[neighbor],
          });

          return paths[neighbor];
        }
        q.enqueue(neighbor);
      }

      while (q.size() > 0) {
        const previous = q.dequeue();

        for (const neighbor of this.vertices[previous].connections) {
          if (seen[neighbor]) {
            continue;
          }

          seen[neighbor] = true;
          paths[neighbor] = paths[previous].slice(0);
          paths[neighbor].push(neighbor);

          if (HUB_AIRPORTS[0] === neighbor || HUB_AIRPORTS === neighbor){
            eventEmitter.emit('hub',{
                hops:paths[neighbor].length,
                path:paths[neighbor]
            })
          }

          if (neighbor === destinationAirportCode) {
            // path found
            eventPublisher.emit("route-found",{
            hops:paths[neighbor].length,
            path:paths[neighbor]
          })
            return paths[neighbor];
          }

          q.enqueue(neighbor);
        }
      }

      return null;
    },
  };
};

module.exports = {
  Graph,
};
