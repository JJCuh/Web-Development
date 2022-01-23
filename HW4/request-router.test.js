const { requestListener } = require("./request-router");
const createRoutingTable = require("./routing-tables");

const mockRequest = function (url, method = "GET") {
  return {
    url,
    method,
  };
};

const mockResponse = function () {
  return {
    end: jest.fn(),
    write: jest.fn(),
    setHeader: jest.fn(),
  };
};

describe("the request router", () => {
  let initialAppState;

  beforeEach(() => {
    initialAppState = {
      visitors: [],
      routes: createRoutingTable(),
    };
  });

  it("[1] requestListener should be a higher order function", () => {
    const rl = requestListener({});
    expect(typeof rl).toBe("function");
  });

  it("[1] should set the correct properties on each request", () => {
    const request = mockRequest();
    requestListener(initialAppState)(request, mockResponse());

    expect(request.app).toBe(initialAppState);
    expect(request.params).not.toBeUndefined();
  });

  it("[2] should match the / route ", () => {
    const request = mockRequest("/");
    const response = mockResponse();
    requestListener(initialAppState)(request, response);
    expect(response.write).toHaveBeenCalledWith(
      expect.stringContaining("index route")
    );
  });

  it("[2] should route a request to /hello/arman and attach the parameters", () => {
    const request = mockRequest("/hello/arman");
    const response = mockResponse();
    requestListener(initialAppState)(request, response);

    expect(request.params.name).toBe("arman");
    expect(response.write).toHaveBeenCalledWith(
      expect.stringContaining("arman")
    );
    expect(response.statusCode).toEqual(200);
  });

  it("[2] should route a request to /hello/from/arman", () => {
    const request = mockRequest("/hello/from/arman", "POST");
    const response = mockResponse();
    requestListener(initialAppState)(request, response);

    expect(initialAppState.visitors.arman).toBe(1);
    expect(request.params.name).toBe("arman");
    expect(response.write).toHaveBeenCalledWith(
      expect.stringContaining("arman, you've dropped by")
    );
    expect(response.end).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toEqual(200);
  });

  it("[2] should send the correct NOT FOUND response", () => {
    const request = mockRequest("/foo/bar/asdf");
    const response = mockResponse();
    requestListener(initialAppState)(request, response);

    expect(response.statusCode).toEqual(404);
  });
});
