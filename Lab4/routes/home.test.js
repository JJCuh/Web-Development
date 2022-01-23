const mockEnd = jest.fn();
const mockReadFile = jest.fn();

jest.mock("fs/promises", () => ({
  readFile: mockReadFile,
}));

const home = require("./home");

const mockHomeRequest = () => ({
  app: {
    staticFilesDirectory: "/fake/path",
    cache: [],
  },
});

const mockResponse = function () {
  return {
    writeHead: jest.fn().mockReturnValue({ end: mockEnd }),
    write: jest.fn().mockReturnValue(this),
    end: mockEnd,
  };
};

describe("the home route handler", () => {
  beforeEach(() => {
    mockEnd.mockClear();
    mockReadFile.mockClear();
  });

  it("[5] should call read file properly", async () => {
    mockReadFile.mockResolvedValue("home-me");

    await home(mockHomeRequest(), mockResponse());

    expect(mockReadFile).toHaveBeenCalledTimes(1);
    expect(mockReadFile).toHaveBeenCalledWith("/fake/path/index.html");
  });

  it("[5] should send a 500 response", async () => {
    const response = mockResponse();
    mockReadFile.mockRejectedValue("SHIT");

    await home(mockHomeRequest(), response);

    expect(response.writeHead).toHaveBeenCalledWith(500);
    expect(response.end).toHaveBeenCalled();
  });

  it("[5] should send a 200 response with the contents", async () => {
    const response = mockResponse();
    const content = "home";
    mockReadFile.mockResolvedValue(content);

    await home(mockHomeRequest(), response);

    expect(response.write).toHaveBeenCalledWith(content);
    expect(response.writeHead).toHaveBeenCalledWith(200);
    expect(response.end).toHaveBeenCalled();
  });

  it("[5] should cache the response for home page", async () => {
    const request = mockHomeRequest();
    request.url = "home.html";
    const content = "home";
    mockReadFile.mockResolvedValue(content);

    await home(request, mockResponse());

    expect(request.app.cache["home.html"]).toBeDefined();
    expect(request.app.cache["home.html"]).toEqual(
      expect.objectContaining({
        result: content,
        cachedAtMs: expect.any(Number),
      })
    );
  });
});
