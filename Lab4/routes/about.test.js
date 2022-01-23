const mockEnd = jest.fn();
const mockReadFile = jest.fn();

jest.mock("fs/promises", () => ({
  readFile: mockReadFile,
}));

const about = require("./about");

const mockAboutRequest = () => ({
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

describe("the about route handler", () => {
  beforeEach(() => {
    mockEnd.mockClear();
    mockReadFile.mockClear();
  });

  it("[5] should call read file properly", async () => {
    mockReadFile.mockResolvedValue("about me");

    await about(mockAboutRequest(), mockResponse());

    expect(mockReadFile).toHaveBeenCalledTimes(1);
    expect(mockReadFile).toHaveBeenCalledWith("/fake/path/about.html");
  });

  it("[5] should send a 500 response", async () => {
    const response = mockResponse();
    mockReadFile.mockRejectedValue("SHIT");

    await about(mockAboutRequest(), response);

    expect(response.writeHead).toHaveBeenCalledWith(500);
    expect(response.end).toHaveBeenCalled();
  });

  it("[5] should send a 200 response with the contents", async () => {
    const response = mockResponse();
    const content = "about";
    mockReadFile.mockResolvedValue(content);

    await about(mockAboutRequest(), response);

    expect(response.write).toHaveBeenCalledWith(content);
    expect(response.writeHead).toHaveBeenCalledWith(200);
    expect(response.end).toHaveBeenCalled();
  });

  it("[5] should cache the response for about page", async () => {
    const request = mockAboutRequest();
    request.url = "about.html";
    const content = "about";
    mockReadFile.mockResolvedValue(content);

    await about(request, mockResponse());

    expect(request.app.cache["about.html"]).toBeDefined();
    expect(request.app.cache["about.html"]).toEqual(
      expect.objectContaining({
        result: content,
        cachedAtMs: expect.any(Number),
      })
    );
  });
});
