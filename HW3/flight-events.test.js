const originalConsoleLog = console.log;

const mockConsoleLog = jest.fn();
const mockReadFile = jest.fn();
const mockGraph = jest.fn();

const graph = require("./data-structures/graph");
const events = require("events");

jest.spyOn(global.console, "log").mockImplementation(mockConsoleLog);

jest.mock("fs", function () {
  return {
    readFile: mockReadFile,
  };
});

const printRoute = require("./flight-events");
const mockFileContents = `ABE,ATL
ABE,DTW
ABE,ORD
ABI,DFW
ABQ,ATL
ABQ,BWI
ABQ,CLT
ABQ,DAL
ABQ,DEN
ABQ,DFW`;

describe("printing a route", function () {
  let eventPublisher = new events.EventEmitter();

  beforeEach(function () {
    mockConsoleLog.mockClear();
    mockReadFile.mockClear();

    mockGraph.mockClear();
    mockGraph.mockImplementation(function () {
      return {
        bfs: jest.fn(),
        addEdge: jest.fn(),
        eventPublisher,
      };
    });
  });

  it("[2] should call fs read file with a callback", function () {
    printRoute("SJC", "SEA");
    // make sure that you're using the callback version of fs.readFile, not the promise version
    expect(mockReadFile).toHaveBeenCalledWith(
      "./routes.csv",
      "utf-8",
      expect.any(Function)
    );
  });

  it("[3] should call add edge and bfs properly", function () {
    const g = {
      bfs: jest.fn(),
      addEdge: jest.fn(),
      eventPublisher,
    };

    jest.spyOn(graph, "Graph").mockImplementation(function () {
      return g;
    });

    printRoute("SJC", "SEA");
    const callback = mockReadFile.mock.calls[0][2];
    callback(null, mockFileContents);

    expect(g.addEdge).toHaveBeenCalledTimes(10);
    expect(g.bfs).toHaveBeenCalledTimes(1);
    expect(g.bfs).toHaveBeenCalledWith("SJC", "SEA");
  });

  it("[2] should print out origin and destination when starting a route", function () {
    jest.spyOn(graph, "Graph").mockImplementation(mockGraph);

    printRoute("SJC", "SEA");
    const callback = mockReadFile.mock.calls[0][2];
    callback(null, mockFileContents);

    // this will abstract your graph implementation so if you don't get the graph portion
    // right, you can still get points for reigstering the event handler
    eventPublisher.emit("start", { origin: "SJC", destination: "SEA" });
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.any(String),
      "start",
      "SJC",
      "SEA"
    );
  });

  it("[2] should print out when going through a hub city", function () {
    printRoute("SFO", "SLC");
    const callback = mockReadFile.mock.calls[0][2];
    callback(null, mockFileContents);

    const path = ["SFO", "SLC"];

    eventPublisher.emit("hub", { path });
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.any(String),
      "hub",
      path
    );
  });

  it("[2] should print out when the origin was not found", function () {
    printRoute("AAA", "SEA");
    const callback = mockReadFile.mock.calls[0][2];
    callback(null, mockFileContents);

    eventPublisher.emit("not-found", "AAA");
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.any(String),
      "not-found",
      "AAA"
    );
  });

  it("[2] should print out he path wheen a rouote has been found", function () {
    printRoute("SJC", "SEA");
    const callback = mockReadFile.mock.calls[0][2];
    callback(null, mockFileContents);

    const path = ["SJC", "PDX", "SEA"];

    eventPublisher.emit("route-found", { path });
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.any(String),
      "route-found",
      path
    );
  });
});
