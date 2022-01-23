const TaskResponse = function (task = null, errorMessage = null) {
  return {
    task,
    errorMessage,
  };
};

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
