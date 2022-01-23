const chalk = require("chalk");
const responses = require("./response");
const sortTaskList = require("./sort-task-list");
const fs = require("fs/promises");

const TaskListOrder = {
  CreatedDate: Symbol("CreatedDate"),
  CompletedDate: Symbol("CompletedDate"),
};

const Task = function (id, description, completed = false) {
  return {
    id,
    description,
    completed,
    createdDate: new Date(),
    completedDate: null,
    toString: function () {
      const icon = this.completed ? "[✓]" : "[ ]";
      const desc = this.completed
        ? chalk.strikethrough(description)
        : description;
      return `${icon} (${id}) ${desc}`;
    },
  };
};

const TaskList = function () {
  let taskCounter = 0;
  const tasks = {};

  const createTask = function (description) {
    const id = taskCounter++;
    const task = Task(id, description);
    tasks[id] = task;
    return responses.TaskResponse(task);
  };

  const readTask = function (id) {
    const task = tasks[id];
    if (!task) {
      return responses.TaskResponse(null, `Task with ${id} does not exist`);
    }
    return responses.TaskResponse(task);
  };

  const isTask = function (id) {
    const task = tasks[id];
    if (!task) {
      return false
    }
    return true
  };

  const completeTask = function (id) {
    const task = tasks[id];
    if (!task) {
      return responses.TaskResponse(null, `Task with ${id} does not exist`);
    }

    task.completed = true;
    task.completedDate = new Date();
    return responses.TaskResponse(task);
  };

  const deleteTask = function (id) {
    const task = tasks[id];
    if (!task) {
      return responses.TaskResponse(null, `Task with ${id} does not exist`);
    }

    delete tasks[id];
    return responses.TaskResponse(null, null);
  };

  const readAllTasks = function (order = TaskListOrder.CreatedDate) {
    let sortFn = sortTaskList.sortByCreatedDate;

    if (order === TaskListOrder.CompletedDate) {
      sortFn = sortTaskList.sortByCompletedDate;
    }

    const allTasks = Object.values(tasks);
    allTasks.sort(sortFn);

    return responses.ListResponse(allTasks, null);
  };

  /**
   * @function serializeTasks
   * @description returns a JSON array of tasks, filtering out any deleted tasks
   * @returns {string} string containing JSON-ified array of tasks
   */
  const serializeTasks = function () {
    // get array of all tasks, then turn into a string and return
    const tasks = readAllTasks(TaskListOrder.CompletedDate)
    return JSON.stringify(tasks.tasks) 
  };

  /**
   * @function loadTasks
   * @description loads tasks
   * @param {Array<Task>} loadedTasks an array of tasks (like the output of serializeTasks)
   * @returns {void}
   */
  const loadTasks = function (loadedTasks) {
    // for each task in the loadedTasks array
    for (let i = 0; i < loadedTasks.length; i++) {
      // get id of each task
      const id = loadedTasks[i].id
      const task = loadedTasks[i]
      // add to the tasks object using id as the key
      tasks[id] = task
    }
  };

  return {
    createTask,
    completeTask,
    deleteTask,
    readAllTasks,
    readTask,
    isTask,
    serializeTasks,
    loadTasks,
  };
};

module.exports = {
  Task,
  TaskList,
  TaskListOrder,
};
