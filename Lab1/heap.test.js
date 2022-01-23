const assert = require("assert");
const Heap = require("./heap");

/**
 * @function testHeap
 * @description tests your implementation of the Binary Heap
 */
const testHeap = function () {
  it(10, "[pop]", function () {
    const heap = Heap();
    assert(heap.getMin() === null);
    assert(heap.popMin() === null);
  });

  it(10, "[32]", function () {
    const heap = Heap();
    heap.insert(32);
    assert(heap.getMin() === 32);
  });

  it(10, "[32, 16]", function () {
    const heap = Heap();
    heap.insert(32);
    heap.insert(16);

    assert(heap.getMin() === 16);
    assert(heap.popMin() === 16);
    assert(heap.getMin() === 32);
  });

  it(10, "[32, 24, 16 pop]", function () {
    const heap = Heap();
    heap.insert(32);
    heap.insert(24);
    heap.insert(16);
    const min = heap.popMin();

    assert(min === 16);
    assert(heap.getMin() === 24);
  });

  it(10, "[1 pop pop]", function () {
    const heap = Heap();
    heap.insert(1);
    assert(heap.popMin() === 1);
    assert(heap.popMin() === null);
  });

  it(20, "[1 2 3 4 5 6 (7x pops)]", function () {
    const heap = Heap();
    heap.insert(1);
    heap.insert(2);
    heap.insert(3);
    heap.insert(4);
    heap.insert(5);
    heap.insert(6);

    assert(heap.popMin() === 1);
    assert(heap.popMin() === 2);
    assert(heap.popMin() === 3);
    assert(heap.popMin() === 4);
    assert(heap.popMin() === 5);
    assert(heap.popMin() === 6);
    assert(heap.popMin() === null);
  });

  it(20, "[50 24 64 pop 35 78 pop pop 15 pop 40 27 pop]", function () {
    const heap = Heap();
    heap.insert(50);
    heap.insert(24);
    heap.insert(64);

    assert(heap.popMin() === 24);
    heap.insert(35);
    heap.insert(78);

    assert(heap.popMin() === 35);
    assert(heap.popMin() === 50);

    heap.insert(15);
    assert(heap.popMin() === 15);

    heap.insert(40);
    heap.insert(27);

    assert(heap.popMin() === 27);
  });
};

/**
 * @const results
 * @description An array containing of TestResults for each executed test
 */
const results = [];
/**
 * @function TestResult
 * @description creates a test result
 */
const TestResult = function (worth = 0, name = "", err = "") {
  return { worth, name, err };
};

/**
 * @function it
 * @description wraps a test to display nicely in the console and catch errors
 *
 * @example it('should be ok', function() { assert.ok(true) })
 */
const it = function (worth, name, fn) {
  try {
    fn();
    results.push(TestResult(worth, name));
  } catch (err) {
    if (err.code === "ERR_ASSERTION") {
      const errorMessage = err.message + "\n" + err.stack;
      results.push(TestResult(worth, name, errorMessage));
    } else {
      results.push(
        TestResult(worth, name, `${err.message}\n${err.stackTrace}`)
      );
    }
  }
};

/**
 * https://nodejs.org/docs/latest-v14.x/api/modules.html#modules_accessing_the_main_module
 * require.main blocks are only run when this is directly invoked as the node main module
 */
if (require.main === module) {
  testHeap();

  const stats = {
    pass: 0,
    fail: 0,
    total: 0,
    points: 0,
    possible: 0,
  };

  for (const result of results) {
    stats.total++;
    stats.possible += result.worth;
    if (result.err) {
      stats.fail++;
      console.log(`❌ ${result.name}\n  >${result.err}`);
    } else {
      stats.pass++;
      stats.points += result.worth;
      console.log(`✅ ${result.name}`);
    }
  }

  console.log("Results\n---");
  console.log(
    `TOTAL: ${stats.total}\n✅ PASS: ${stats.pass}\n❌ FAIL: ${stats.fail}\n`,
    `POINTS: ${stats.points} / ${stats.possible}`
  );
}
