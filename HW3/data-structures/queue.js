const Queue = function () {
  const queue = [];

  return {
    enqueue: function (animal) {
      queue.unshift(animal);
    },

    dequeue: function () {
      return queue.pop();
    },

    size: function () {
      return queue.length;
    },

    peek: function () {
      if (queue.length > 0) {
        return queue[0];
      }
    },
  };
};

module.exports = Queue;
