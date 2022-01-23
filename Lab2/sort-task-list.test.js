const tasklist = require("./task-list");
const sortTaskList = require("./sort-task-list");

describe("sorting a task list", function () {
  it("[5] should sort tasks by created date", function () {
    const taskA = tasklist.Task("1", "Task A");
    const taskB = tasklist.Task("2", "Task B");

    taskA.createdDate = new Date("2020-03-01");
    taskB.createdDate = new Date("2019-03-01");

    expect(sortTaskList.sortByCreatedDate(taskA, taskB)).toBeGreaterThan(0);
  });

  describe("when sorting by completed date", function () {
    it("[1] should return 0 when neither task is completed", function () {
      const taskA = tasklist.Task("1", "Task A");
      const taskB = tasklist.Task("2", "Task B");

      expect(sortTaskList.sortByCompletedDate(taskA, taskB)).toEqual(0);
    });

    it("[1] should return -1 when Task B is incomplete but Task A is completed", function () {
      const taskA = tasklist.Task("1", "Task A");
      const taskB = tasklist.Task("2", "Task B");

      taskA.completedDate = new Date();

      expect(sortTaskList.sortByCompletedDate(taskA, taskB)).toEqual(-1);
    });

    it("[1] should return 1 when Task A is incomplete but Task B is completed", function () {
      const taskA = tasklist.Task("1", "Task A");
      const taskB = tasklist.Task("2", "Task B");

      taskB.completedDate = new Date();

      expect(sortTaskList.sortByCompletedDate(taskA, taskB)).toEqual(1);
    });

    it("[2] should sort tasks properly when both tasks have completed dates", function () {
      const taskA = tasklist.Task("1", "Task A");
      const taskB = tasklist.Task("2", "Task B");

      taskA.completedDate = new Date("2020-03-01");
      taskB.completedDate = new Date("2019-03-01");

      expect(sortTaskList.sortByCompletedDate(taskA, taskB)).toBeGreaterThan(0);
    });
  });
});
