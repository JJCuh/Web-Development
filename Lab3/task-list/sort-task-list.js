const dateFns = require("date-fns");

module.exports = {
  // Encourage Students to use the date-fns library
  // Students should search for the function, but should find
  // it relatively quickly: https://date-fns.org/v2.23.0/docs/compareAsc
  sortByCreatedDate: function (taskA, taskB) {
    return dateFns.compareAsc(
      new Date(taskA.createdDate),
      new Date(taskB.createdDate)
    );
  },

  sortByCompletedDate: function (taskA, taskB) {
    const taskACompleted = taskA.completedDate;
    const taskBCompleted = taskB.completedDate;

    if (taskACompleted === null && taskBCompleted === null) {
      return 0;
    } else if (taskACompleted === null && taskBCompleted !== null) {
      return 1;
    } else if (taskBCompleted === null && taskACompleted !== null) {
      return -1;
    }

    return dateFns.compareAsc(
      new Date(taskACompleted),
      new Date(taskBCompleted)
    );
  },
};
