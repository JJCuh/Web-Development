const mockEnd = jest.fn();
const mockReadFile = jest.fn();

jest.mock("fs/promises", () => ({
  readFile: mockReadFile,
}));

const publicRoute = require("./public");

const mockPublicRequest = () => ({
  pathname: "/assets/base.css",
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

describe("the public route handler", () => {
  beforeEach(() => {
    mockEnd.mockClear();
    mockReadFile.mockClear();
  });

  it("[5] should send attempt to read a file in a subdirectory", async () => {
    const response = mockResponse();
    response.url = "/assets/base.css";
    const content = "public";

    mockReadFile.mockResolvedValue(content);

    await publicRoute(mockPublicRequest(), response);

    expect(mockReadFile).toHaveBeenCalledWith("/fake/path/assets/base.css");
  });

  it("[5] should send a 404 response when there's an ENOENT", async () => {
    const response = mockResponse();
    mockReadFile.mockRejectedValue({ code: "ENOENT" });

    await publicRoute(mockPublicRequest(), response);

    expect(response.writeHead).toHaveBeenCalledWith(404);
    expect(response.end).toHaveBeenCalled();
  });

  it("[5] should send a 500 response when there's some other weird issue", async () => {
    const response = mockResponse();
    mockReadFile.mockRejectedValue({ code: "SHIT" });

    await publicRoute(mockPublicRequest(), response);

    expect(response.writeHead).toHaveBeenCalledWith(500);
    expect(response.end).toHaveBeenCalled();
  });

  it("[5] should send a 200 response with the contents of a file in a folder", async () => {
    const response = mockResponse();
    response.url = "/assets/base.css";
    const content = "public";

    mockReadFile.mockResolvedValue(content);

    await publicRoute(mockPublicRequest(), response);

    expect(response.write).toHaveBeenCalledWith(content);
    expect(response.writeHead).toHaveBeenCalledWith(200);
    expect(response.end).toHaveBeenCalled();
  });

  it("[5] should cache the response for the page", async () => {
    const request = mockPublicRequest();
    request.url = "public.html";
    const content = "public";
    mockReadFile.mockResolvedValue(content);

    await publicRoute(request, mockResponse());

    expect(request.app.cache["public.html"]).toBeDefined();
    expect(request.app.cache["public.html"]).toEqual(
      expect.objectContaining({
        result: content,
        cachedAtMs: expect.any(Number),
      })
    );
  });
});
