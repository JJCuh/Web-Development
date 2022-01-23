const mockReadBody = jest.fn();
jest.mock("./utils/read-body", () => mockReadBody);

const mockWriteFile = jest.fn().mockResolvedValue();
jest.mock("fs/promises", function () {
  return {
    writeFile: mockWriteFile,
  };
});

const { TaskList } = require("./task-list/task-list");
const handleRequest = require("./server");

describe("server responses", function () {
  let handler, res, tl;

  const generateMockResponse = function () {
    return {
      write: jest.fn(),
      end: jest.fn(),
    };
  };

  const generateMockRequest = function (url, method = "GET") {
    return {
      url,
      method,
      on: jest.fn(),
    };
  };

  beforeEach(function () {
    tl = TaskList();

    for (let i = 0; i < 5; i++) {
      tl.createTask(`task ${i}`);
    }

    handler = handleRequest(tl, "tasks");
    res = generateMockResponse();
    mockReadBody.mockReset();
    mockWriteFile.mockReset();
    mockWriteFile.mockResolvedValue();
  });

  it("[5] should return a 404 when no route matches the url given", function () {
    const req = generateMockRequest("/random-route");
    handler(req, res);
    expect(res.statusCode).toEqual(404);
  });

  describe("when calling the /task endpoint", function () {
    it("[5] should return 405 if the method does not have a handler", function () {
      const req = generateMockRequest("/task", "HEAD");
      handler(req, res);
      expect(res.statusCode).toEqual(405);
    });

    describe("when the method is POST", function () {
      it("[5] should return with a 400 if task description has no body", function () {
        const req = generateMockRequest("/task", "POST");
        mockReadBody.mockResolvedValue("");
        return handler(req, res).then(function () {
          expect(res.statusCode).toEqual(400);
        });
      });

      it("[10] should create a new task with status code 201", function () {
        const req = generateMockRequest("/task", "POST");
        mockReadBody.mockResolvedValue("test task");
        return handler(req, res).then(function () {
          expect(res.statusCode).toEqual(201);
          expect(res.write).toHaveBeenCalledWith(
            expect.stringContaining("test task")
          );
        });
      });

      it("[5] should save the file on every new create", function () {
        const req = generateMockRequest("/task", "POST");
        mockReadBody.mockResolvedValue("test task");
        return handler(req, res).then(function () {
          expect(mockWriteFile).toHaveBeenCalled();
          const contentsWritten = mockWriteFile.mock.calls[0][1];
          const parsedContents = JSON.parse(contentsWritten);
          expect(Array.isArray(parsedContents)).toBe(true);
          expect(parsedContents.length).toBe(6);
        });
      });
    });

    describe("when the method is GET", function () {
      it("[1] should return 400 when no id is passed in", function () {
        const req = generateMockRequest("/task");
        handler(req, res);
        expect(res.statusCode).toEqual(400);
        expect(res.write).toHaveBeenCalled();
      });

      it("[4] should send a 404 if the specified ID couldn't be found", function () {
        const req = generateMockRequest("/task/42");
        handler(req, res);
        expect(res.statusCode).toEqual(404);
        expect(res.write).toHaveBeenCalled();
      });

      it("[5] should send a 200 response if the specified ID is found", function () {
        const task0 = tl.readTask(0).task;
        const req = generateMockRequest("/task/0");
        handler(req, res);
        expect(res.statusCode).toEqual(200);
        expect(res.write).toHaveBeenCalledWith(task0.toString());
      });
    });
  });

  describe("when the method is PUT", function () {
    it("[1] should return 400 when no id is passed in", function () {
      const req = generateMockRequest("/task", "PUT");
      handler(req, res);
      expect(res.statusCode).toEqual(400);
      expect(res.write).toHaveBeenCalled();
    });

    it("[4] should send a 404 if the specified ID couldn't be found", function () {
      const req = generateMockRequest("/task/42", "PUT");
      handler(req, res);
      expect(res.statusCode).toEqual(404);
      expect(res.write).toHaveBeenCalled();
    });

    it("[5] should send a 200 response if the specified ID is updated", function () {
      const task0 = tl.readTask(0).task;
      const req = generateMockRequest("/task/0", "PUT");
      return handler(req, res).then(function () {
        expect(res.statusCode).toEqual(200);
        expect(res.write).toHaveBeenCalledWith(task0.toString());
        expect(task0.completed).toBe(true);
      });
    });

    it("[5] should save the file on every complete", function () {
      const req = generateMockRequest("/task/0", "PUT");
      return handler(req, res).then(function () {
        expect(mockWriteFile).toHaveBeenCalled();
        const contentsWritten = mockWriteFile.mock.calls[0][1];
        const parsedContents = JSON.parse(contentsWritten);
        expect(Array.isArray(parsedContents)).toBe(true);
        expect(parsedContents.length).toBe(5);
        expect(parsedContents[0].completed).toBe(true);
      });
    });
  });

  describe("when the method is DELETE", function () {
    it("[1] should return 400 when no id is passed in", function () {
      const req = generateMockRequest("/task", "DELETE");
      handler(req, res);
      expect(res.statusCode).toEqual(400);
      expect(res.write).toHaveBeenCalled();
    });

    it("[4] should send a 404 if the specified ID couldn't be found", function () {
      const req = generateMockRequest("/task/42", "DELETE");
      handler(req, res);
      expect(res.statusCode).toEqual(404);
      expect(res.write).toHaveBeenCalled();
    });

    it("[5] should send a 204 response and delete the task with the given id", function () {
      tl.readTask(0).task;
      const req = generateMockRequest("/task/0", "DELETE");
      return handler(req, res).then(function () {
        expect(res.statusCode).toEqual(204);
        expect(tl.readTask(0).task).toBe(null);
      });
    });

    it("[5] should save the file on every complete", function () {
      const req = generateMockRequest("/task/0", "DELETE");
      return handler(req, res).then(function () {
        expect(mockWriteFile).toHaveBeenCalled();
        const contentsWritten = mockWriteFile.mock.calls[0][1];
        const parsedContents = JSON.parse(contentsWritten);
        expect(Array.isArray(parsedContents)).toBe(true);
        expect(parsedContents.length).toBe(4);
        expect(parsedContents[0].id).not.toBe(0);
      });
    });
  });

  describe("when calling the /tasks endpoint", function () {
    it("[5] should return a 405 with any method but GET", function () {
      const req = generateMockRequest("/tasks", "POST");
      handler(req, res);
      expect(res.statusCode).toEqual(405);
    });
  });
});
