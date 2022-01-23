const responses = require("./response");
const sortTaskList = require("./sort-task-list");

/**
 * @const TaskListOrder
 * @description The different ways that a task list can be ordered by
 */
const TaskListOrder = {
  CreatedDate: Symbol("CreatedDate"),
  CompletedDate: Symbol("CompletedDate"),
};

/**
 * @function Task
 * @description Creates a task.
 */
const Task = function (id, description, completed = false) {
  return {
    id,
    description,
    completed,
    createdDate: new Date(),
    completedDate: null,
    toString: function () {
      // checked only when task is completed
      let check = '[ ]';
      if (completed) {
        check = '[✓]';
      }
      // following string format:
      return check + ' ' + id + ' ' + description;
    },
  };
};

const TaskList = function () {
  let taskCounter = 0;
  const tasks = {};

  /**
   * @function createTask
   * @description adds a new task into the tasks object with an autoincrementing id
   * @param {String} description the task to be completed
   * @returns {responses.TaskResponse} the newly created task
   */
  const createTask = function (description) {
    // create a new task with ID as current taskCounter, which is then incremented
    tasks[taskCounter] = Task(taskCounter, description);
    taskCounter++;
    // after incrementing, taskCounter - 1 = ID
    return responses.TaskResponse(tasks[taskCounter - 1]);
  };

  /**
   * @function readTask
   * @description returns the task that corresponds to the given ID
   * @param {String | number} id the id of the task to retrieve
   * @returns {responses.TaskResponse}
   *    errorMessage is filled in if the id isn't found
   *    task is filled in if a task with the given id exists
   */
  const readTask = function (id) {
    // check to see if task[id] is a falsy value, in which case errorMessage is returned 
    if (!tasks[id]) {
      return responses.TaskResponse(null, "Task " + id + " does not exist");
    }
    // else return the task with id
    return responses.TaskResponse(tasks[id]);
  };

  /**
   * @function completeTask
   * @description completes the task with the given ID, setting the completedDate and the completed field
   * @param {String | number} id the id of the task to retrieve
   * @returns {responses.TaskResponse}
   *    errorMessage is filled in if the id isn't found
   *    task is filled in with the newly completed task
   */
  const completeTask = function (id) {
    // check to see if task[id] is a falsy value, in which case errorMessage is returned 
    if (!tasks[id]) {
      return responses.TaskResponse(null, "Task " + id + " does not exist");
    }
    // else update completedDate and completed
    tasks[id].completedDate = new Date();
    tasks[id].completed = true;
    return responses.TaskResponse(tasks[id]);
  };

  /**
   * @function deleteTask
   * @description removes the task with the given ID (think about how to delete keys from an object)
   * @param {String | number} id the id of the task to retrieve
   * @returns {responses.TaskResponse}
   *    errorMessage is filled in if the id isn't found
   *    both errorMessage and task should be null if deleted successfully
   */
  const deleteTask = function (id) {
    // check to see if task[id] is a falsy value, in which case errorMessage is returned 
    if (!tasks[id]) {
      return responses.TaskResponse(null, "Task " + id + " does not exist");
    }
    // else set delete task[id] and return null TaskResponse
    tasks[id] = null;
    return responses.TaskResponse(tasks[id]);
  };

  /**
   * @function readAllTasks
   * @description returns all the tasks available, sorting them by the specified order
   * @param {TaskListOrder} order (defaults to TaskListOrder.CreatedDate) the order in which to return tasks in
   * @returns {responses.ListResponse}
   *    tasks is filled in with all the tasks listed in the given order
   */
  const readAllTasks = function (order = TaskListOrder.CreatedDate) {
    // convert tasks into an array
    const array = Object.values(tasks);
    // return array sorted by provided order
    if (order = TaskListOrder.CreatedDate) {
      return responses.ListResponse(array.sort(sortTaskList.sortByCreatedDate));
    }
    return responses.ListResponse(array.sort(sortTaskList.sortByCompletedDate));
  };

  /**
   * NOTE: Don't change this return statement.
   * It returns a bunch of functions to work with a TaskList.
   */
  return {
    createTask,
    completeTask,
    deleteTask,
    readAllTasks,
    readTask,
  };
};

/**
 * NOTE: Do not change this
 * All these exports are used to grade this assignment.
 */
module.exports = {
  Task,
  TaskList,
  TaskListOrder,
};