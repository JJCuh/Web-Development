const tasklist = require("./task-list");

describe("tasklist", function () {
  let tl;

  beforeEach(function () {
    tl = tasklist.TaskList();
  });

  it("should have the correct api", function () {
    expect(typeof tl.createTask).toEqual("function");
    expect(typeof tl.completeTask).toEqual("function");
    expect(typeof tl.deleteTask).toEqual("function");
    expect(typeof tl.readTask).toEqual("function");
    expect(typeof tl.serializeTasks).toEqual("function");
    expect(typeof tl.loadTasks).toEqual("function");
  });

  it("[5] should serialize as an array", function () {
    const t0 = tl.createTask("task 0").task;
    const t1 = tl.createTask("task 1").task;

    expect(tl.serializeTasks()).toEqual(JSON.stringify([t0, t1]));
  });

  it("[5] should load extra tasks into the existing tasklist", function () {
    tl.createTask("task 0").task;
    const loadedTasks = [
      tasklist.Task(42, "task 42"),
      tasklist.Task(101, "task 101"),
    ];
    tl.loadTasks(loadedTasks);

    expect(tl.readTask(42).task).not.toBeNull();
    expect(tl.readTask(101).task).not.toBeNull();
  });

  describe("printing a task as a string", function () {
    it("should print an completed task with a check", function () {
      const task = tasklist.Task(1, "COEN 161 Lab 2", true);
      expect(task.toString()).toEqual(expect.stringMatching(/^\[✓\]/));
      expect(task.toString()).toEqual(
        expect.stringContaining(task.id.toString())
      );
      expect(task.toString()).toEqual(
        expect.stringContaining(task.description)
      );
    });

    it("should print an incomplete task with no check", function () {
      const task = tasklist.Task(1, "COEN 161 Lab 2", false);
      expect(task.toString()).toEqual(expect.stringMatching(/^\[ \]/));
      expect(task.toString()).toEqual(
        expect.stringContaining(task.id.toString())
      );
      expect(task.toString()).toEqual(
        expect.stringContaining(task.description)
      );
    });
  });

  describe("creating a task in the task list", function () {
    it("should create an unfinished task", function () {
      const description = "task 1";
      const { task, errorMessage } = tl.createTask(description);
      expect(errorMessage).toBeNull();
      expect(task.description).toEqual(description);
      expect(task.id).toEqual(0);
    });

    it("should auto increment IDs", function () {
      const { task: task0 } = tl.createTask("task 0");
      const { task: task1 } = tl.createTask("task 1");

      expect(task0.id).toEqual(0);
      expect(task1.id).toEqual(1);
    });
  });

  describe("reading a task", function () {
    it("should send an error message when task doesn't exist", function () {
      const { task, errorMessage } = tl.readTask(42);
      expect(task).toBeNull();
      expect(errorMessage).toEqual(expect.stringContaining("does not exist"));
    });

    it("should retrieve the task", function () {
      tl.createTask("task 0");
      const { task, errorMessage } = tl.readTask(0);
      expect(errorMessage).toBeNull();
      expect(task.id).toEqual(0);
    });
  });

  describe("completing a task", function () {
    it("should send an error message when task doesn't exist", function () {
      const { task, errorMessage } = tl.completeTask(42);
      expect(task).toBeNull();
      expect(errorMessage).toEqual(expect.stringContaining("does not exist"));
    });

    it("should complete the task", function () {
      tl.createTask("task 0");
      const { task, errorMessage } = tl.completeTask(0);
      expect(errorMessage).toBeNull();
      expect(task.completed).toBe(true);
      expect(task.completedDate).not.toBe(null);

      const { task: completedTask } = tl.readTask(0);
      expect(completedTask.completed).toBe(true);
    });
  });

  describe("deleting a task", function () {
    it("should send an error message when task doesn't exist", function () {
      const { task, errorMessage } = tl.deleteTask(42);
      expect(task).toBe(null);
      expect(errorMessage).toEqual(expect.stringContaining("does not exist"));
    });

    it("should delete the task", function () {
      tl.createTask("task 0");
      const { task, errorMessage } = tl.deleteTask(0);
      expect(task).toBeNull();
      expect(errorMessage).toBeNull();

      const { deletedTask, errorMessage: readTaskErrorMessage } =
        tl.readTask(0);
      expect(deletedTask).toBe(undefined);
      expect(readTaskErrorMessage).toEqual(
        expect.stringContaining("does not exist")
      );
    });
  });

  describe("reading all tasks", function () {
    it("should list all created tasks in order of created date", function () {
      const { task: t0 } = tl.createTask("task 0");
      const { task: t1 } = tl.createTask("task 1");
      const { task: t2 } = tl.createTask("task 2");

      t0.createdDate = new Date("01/01/2019");
      t1.createdDate = new Date("05/04/2020");
      t2.createdDate = new Date("11/11/2011");

      const { tasks } = tl.readAllTasks();

      expect(tasks[0]).toBe(t2);
      expect(tasks[1]).toBe(t0);
      expect(tasks[2]).toBe(t1);
    });

    it("should list all tasks in order of completed date", function () {
      const { task: t0 } = tl.createTask("task 0");
      const { task: t1 } = tl.createTask("task 1");
      const { task: t2 } = tl.createTask("task 2");

      t0.completedDate = new Date("01/01/2019");
      t1.completedDate = new Date("05/04/2020");

      const { tasks } = tl.readAllTasks(tasklist.TaskListOrder.CompletedDate);
      expect(tasks[0]).toBe(t0);
      expect(tasks[1]).toBe(t1);
      expect(tasks[2]).toBe(t2);
    });
  });
});
