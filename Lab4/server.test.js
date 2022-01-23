jest.mock("./routes", () => ({
  home: jest.fn(),
  public: jest.fn(),
  about: jest.fn(),
}));

const mockRequest = (pathname = "") => ({
  pathname,
  headers: {
    host: "mywebsite",
  },
  url: pathname,
});

const mockEnd = jest.fn();
const mockResponse = function () {
  return {
    writeHead: jest.fn().mockReturnValue({ end: mockEnd }),
    write: jest.fn().mockReturnValue(this),
    end: mockEnd,
  };
};

const server = require("./server");
const routes = require("./routes");

describe("the server", () => {
  it("[4] should return a 404 when no url is passed in", () => {
    const response = mockResponse();
    server.requestListener(mockRequest(), response);
    expect(response.statusCode).toBe(404);
    expect(response.end).toHaveBeenCalledTimes(1);
  });

  it("[4] should return a 404 if the route was not in the routing table", () => {
    const response = mockResponse();
    server.requestListener(mockRequest("/foo"), response);
    expect(response.statusCode).toBe(404);
    expect(response.end).toHaveBeenCalled();
  });

  it("[4] should call the home route when the path is /", () => {
    server.requestListener(mockRequest("/"), mockResponse());
    expect(routes.home).toHaveBeenCalledTimes(1);
  });

  it("[4] should call the public route when the path starts with /public", () => {
    server.requestListener(mockRequest("/public"), mockResponse());
    expect(routes.public).toHaveBeenCalledTimes(1);
  });

  it("[4] should call the about route the path is /about", () => {
    server.requestListener(mockRequest("/about"), mockResponse());
    expect(routes.about).toHaveBeenCalledTimes(1);
  });
});
