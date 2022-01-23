const Heap = function () {
  // This will be the underlying type for your Heap ADT.
  // You'll definitely want to use some functions from
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
  const heap = [];
  heap[0] = null;
  
  /**
   * @function swap
   * @description swaps two values in heap
   * @param {int, int} indexes in the array to be swapped
   */
   const swap = function (ind1, ind2) {
    let temp = heap[ind1]
    heap[ind1] = heap[ind2]
    heap[ind2] = temp
   };

  /**
   * @function getMin
   * @returns {integer | null} the minimum value in the Heap but doesn't remove it.
   *                           if there are no elements, this function returns null
   */
  const getMin = function () {
    // TODO: Fill this in
    // if heap has at least one element, return the first element (min)
    if (heap.length > 1) {
      return heap[1]
    }
    // if heap doesn't have an element, return null
    else {
      return heap[0]
    }
  };

  /**
   * @function insert
   * @description inserts
   * @param {int} value to be inserted into the heap
   * @returns {void}
   */
  const insert = function (value) {
    // TODO: Fill this in
    // add element to end of heap
    heap.push(value);
    let n = heap.length - 1
    // maintain correct order of min heap
    while (n > 1 && heap[n] < heap[Math.floor(n/2)]) {
      // move up newly added value in heap until in correct position
      swap(Math.floor(n/2), n)
      n = Math.floor(n/2)
    }
    /* Used for testing insert(), printing out each heap element in order 
    console.log('insert:')
    for (let i = 1; i < heap.length; i++) {
      console.log(heap[i])
    }
    console.log()
    */
  };

  /**
   * @function popMin
   * @returns {integer | null} the minimum value in the Heap and removes it
   *                           if there are no elements, this function returns null
   */
  const popMin = function () {
    // TODO: Fill in
    // if heap doesn't have an element, return null
    if (heap.length <= 1) {
      return heap[0]
    }
    let k = 1
    // remove min and replace with last element in heap
    swap(k, heap.length-1)
    const min = heap.pop()
    // maintain correct order of min heap
    while (2 * k <= heap.length-1) {
      // move down swapped element until in correct position in min heap
      let j = 2 * k;
      // find lower value child element and swap
      if (j < heap.length-1 && heap[j] > heap[j+1]) {
        j++;
      } 
      if (heap[k] <= heap[j]){
        break;
      }
      swap(k, j)
      k = j;
    }
    /* Used for testing popMin(), printing out each heap element in order 
    console.log('pop:')
    for (let i = 1; i < heap.length; i++) {
      console.log(heap[i])
    }
    console.log()
    */
    return min;
  };

  /**
   * Don't worry about anything after here. Just focus on filling in the functions above
   */
  return {
    getMin,
    popMin,
    insert,
  };
};

module.exports = Heap;
