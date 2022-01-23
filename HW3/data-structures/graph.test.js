const graph = require("./graph");

const fillGraph = function () {
  const g = graph.Graph();
  g.addEdge("SJC", "PDX");
  g.addEdge("PDX", "SEA");
  g.addEdge("SJC", "OAK");
  g.addEdge("OAK", "SFO");
  g.addEdge("SFO", "PHX");
  g.addEdge("SFO", "DEN");
  g.addEdge("PHX", "SLC");
  g.addEdge("LAX", "PHX");
  g.addEdge("LAX", "SJC");

  return g;
};

describe("emitting events during bfs", function () {
  it("[1] should emit a not found event when the origin doesnt exist", function () {
    const g = fillGraph();
    const emitterSpy = jest.spyOn(g.eventPublisher, "emit");
    g.bfs("ATL", "PDX");
    expect(emitterSpy).toHaveBeenCalledWith("not-found", "ATL");
  });

  it("[1] should emit a not found event when the destination doesnt exist", function () {
    const g = fillGraph();
    const emitterSpy = jest.spyOn(g.eventPublisher, "emit");
    g.bfs("PDX", "ATL");
    expect(emitterSpy).toHaveBeenCalledWith("not-found", "ATL");
  });

  it("[1] should emit an error event when the origin is the same as the destination", function () {
    const g = fillGraph();
    const emitterSpy = jest.spyOn(g.eventPublisher, "emit");
    g.bfs("PDX", "PDX");
    expect(emitterSpy).toHaveBeenCalledWith("err", "PDX");
  });

  it("[1] should emit a start event when starting", function () {
    const g = fillGraph();
    const emitterSpy = jest.spyOn(g.eventPublisher, "emit");
    g.bfs("SJC", "OAK");
    expect(emitterSpy).toHaveBeenCalledWith("start", {
      origin: "SJC",
      destination: "OAK",
    });
  });

  it("[1] should emit a route-found event  when there's a direct flight", function () {
    const g = fillGraph();
    const emitterSpy = jest.spyOn(g.eventPublisher, "emit");
    g.bfs("OAK", "SFO");
    expect(emitterSpy).toHaveBeenCalledWith("route-found", {
      hops: 1,
      path: expect.arrayContaining(["OAK", "SFO"]),
    });
  });

  it("[1] should emit a route-found event when a route is found", function () {
    const g = fillGraph();
    const emitterSpy = jest.spyOn(g.eventPublisher, "emit");
    g.bfs("OAK", "SLC");
    expect(emitterSpy).toHaveBeenCalledWith("route-found", {
      hops: 4,
      path: ["OAK", "SFO", "PHX", "SLC"],
    });
  });

  it("[1] should emit a hub event when passing through a hub city", function () {
    const g = fillGraph();
    const emitterSpy = jest.spyOn(g.eventPublisher, "emit");
    g.bfs("SJC", "PHX");
    expect(emitterSpy).toHaveBeenCalledWith("hub", {
      hops: 2,
      path: ["SJC", "LAX"],
    });
  });
});
