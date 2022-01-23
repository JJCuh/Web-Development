/**
 * @function TaskResponse
 * @description wrapper object to return a task and possibly an errorMessage
 */
const TaskResponse = function (task = null, errorMessage = null) {
  return {
    task,
    errorMessage,
  };
};

/**
 * @function ListResponse
 * @description wrapper object to return a list of tasks and possibly an errorMessage
 */
const ListResponse = function (tasks = null, errorMessage = null) {
  return {
    tasks,
    errorMessage,
  };
};

module.exports = {
  TaskResponse,
  ListResponse,
};
