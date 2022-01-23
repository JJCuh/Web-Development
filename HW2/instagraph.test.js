const chalk = require("chalk");
const assert = require("assert");
const ig = require("./instagraph");

const createMockGraphWithData = function () {
  const graph = ig.Graph();
  const schoolPost = ig.Post();
  schoolPost.hashtags = ["fml", "coen161", "fuck"];
  const napaPost = ig.Post();
  napaPost.hashtags = ["napa", "wineanddineme", "adulting"];
  const italyPost = ig.Post();
  italyPost.hashtags = ["wineanddineme", "italy", "graduated"];
  const workingPost = ig.Post();
  workingPost.hashtags = ["graduated", "fml", "adulting"];

  graph.addPost(schoolPost);
  graph.addPost(napaPost);
  graph.addPost(italyPost);
  graph.addPost(workingPost);

  return {
    graph,
    schoolPost,
    napaPost,
    italyPost,
    workingPost,
  };
};

const testIG = function () {
  it(3, "runs test using chalk", function () {
    assert(chalk.green);
  });

  it(1, "return null when the post doesnt have an ID", function () {
    const graph = ig.Graph();
    const post = graph.addPost({});
    assert(post === null);
  });

  it(1, "returns the given post", function () {
    const graph = ig.Graph();
    const post = ig.Post("Arman", "chillin", "");
    assert(graph.addPost(post) === post);
  });

  it(1, "adds the post into the posts object", function () {
    const graph = ig.Graph();
    const post = graph.addPost(ig.Post());
    assert(graph.posts[post.id] === post);
  });

  it(3, "adds multiple posts into the hashtags object", function () {
    const mockData = createMockGraphWithData();
    const posts = mockData.graph.posts;
    assert(posts[mockData.schoolPost.id] === mockData.schoolPost);
    assert(posts[mockData.napaPost.id] === mockData.napaPost);
    assert(posts[mockData.italyPost.id] === mockData.italyPost);
    assert(posts[mockData.workingPost.id] === mockData.workingPost);
  });

  it(
    1,
    "should return null when there is no matching post for getRelatedPost",
    function () {
      const graph = ig.Graph();
      assert(graph.getRelatedPosts(1) === null);
    }
  );

  it(3, "should return an empty array if no related posts found", function () {
    const graph = ig.Graph();
    const schoolPost = ig.Post();
    schoolPost.hashtags = ["fml", "coen161", "fuck"];
    const napaPost = ig.Post();
    napaPost.hashtags = ["napa", "win"];

    graph.addPost(schoolPost);
    graph.addPost(napaPost);
    assert(graph.getRelatedPosts(schoolPost.id).length === 0);
  });

  it(1, "should return related posts related to the school post", function () {
    const mockData = createMockGraphWithData();

    const relatedToSchoolPost = mockData.graph.getRelatedPosts(
      mockData.schoolPost.id
    );

    assert(relatedToSchoolPost.length === 1);
    assert(relatedToSchoolPost.includes(mockData.workingPost));
  });

  it(1, "should return related posts related to the italy post", function () {
    const mockData = createMockGraphWithData();

    const relatedToNapaPost = mockData.graph.getRelatedPosts(
      mockData.napaPost.id
    );

    assert(relatedToNapaPost.length === 2);
    assert(relatedToNapaPost.includes(mockData.workingPost));
    assert(relatedToNapaPost.includes(mockData.italyPost));
  });

  it(1, "should return related posts related to the italy post", function () {
    const mockData = createMockGraphWithData();

    const relatedToItalyPost = mockData.graph.getRelatedPosts(
      mockData.italyPost.id
    );

    assert(relatedToItalyPost.length === 2);
    assert(relatedToItalyPost.includes(mockData.workingPost));
    assert(relatedToItalyPost.includes(mockData.napaPost));
  });

  it(1, "should return related posts related to the working post", function () {
    const mockData = createMockGraphWithData();

    const relatedToWorkingPost = mockData.graph.getRelatedPosts(
      mockData.workingPost.id
    );

    assert(relatedToWorkingPost.length === 3);
    assert(relatedToWorkingPost.includes(mockData.napaPost));
    assert(relatedToWorkingPost.includes(mockData.italyPost));
    assert(relatedToWorkingPost.includes(mockData.schoolPost));
  });

  it(
    1,
    "should return null if the post being deleted doesn't exist",
    function () {
      const graph = ig.Graph();
      const post = graph.removePost(6);
      assert(post === null);
    }
  );

  it(2, "should set the post id to null when deleting a post", function () {
    const graph = ig.Graph();
    let addedPost = graph.addPost(ig.Post("Arman"));

    assert(graph.removePost(addedPost.id) === addedPost);
    assert(!graph[addedPost.id]);
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
  testIG();

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
      console.log(`❌ ${chalk.red(`${result.name}\n  >${result.err}`)}`);
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
