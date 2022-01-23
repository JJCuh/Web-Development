const chalk = require("chalk");
/**
 * NAME: Justin Li
 * STUDENT ID: 1404770
 * THINGS I'M NOT SURE ABOUT: How to do getRelatedPosts(id) function
 */

const IDCounter = function () {
  let idCounter = 0;
  return function () {
    idCounter++;
    return idCounter;
  };
};

const getNextPostID = IDCounter();

const InstagramPost = function (author, caption, url) {
  const post = {
    id: getNextPostID(),
    author: author,
    caption,
    // key === property === field
    // the field should be named photoURL
    photoURL: url,
    likes: 0,
    hashtags: [],
    comments: [],
  };

  return post
};

const postA = InstagramPost()
const postB = InstagramPost()

// HW part
const InstaGraph = function () {
  const posts = {};
  const hashtags = {};

  const getRandomElement = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  return {
    hashtags,
    posts,

    getAllPosts: function () {
      return Object.values(posts);
    },

    /**
     * @worth 6 POINTS
     * @function addPost
     * @description adds a post into the InstaGraph
     * @param {InstagramPost} post -a post with an ID
     * @returns {InstagramPost | null}
     *      return null if the post doesn't have an ID
     *      returns the same post passed in if the add was successful
     */
    addPost: function (post) {
      if (post.id === undefined) {
        // then post doesn't have the property id
        return null
      }
      posts[post.id] = post

      for (let i = 0; i < post.hashtags.length; i++) {
        if (!hashtags[post.hashtags[i]]) {
          hashtags[post.hashtags[i]] = []
        }
        hashtags[post.hashtags[i]].push(post)
      }

      return posts[post.id]
    },

    /**
     * @worth 8 POINTS
     * @function getRelatedPosts
     * @description For each hashtag in the given post id,
     *  get a random post with that same hashtag. The post
     *  passed in should never be included in the array of matches.
     *
     * @param {number} id - id of a post
     * @returns {Array<InstagramPost> | null}
     *      return null if the post was not found
     *      returns Array<InstagramPost> filled in according to the description
     *
     */
    getRelatedPosts: function (id) {
      if (posts[id] === undefined) {
        return null
      }
      const array = Object.values(posts)
      if (array.length <= 1){
        return null
      }
      const related = []
      let post
      let contains = false
      if (!posts[id].hashtags) {
        return null
      }
      for (let i = 0; i < posts[id].hashtags.length; i++) {
        if (hashtags[posts[id].hashtags[i]]) {
          if (hashtags[posts[id].hashtags[i]].length > 1) {
            post = getRandomElement(hashtags[posts[id].hashtags[i]])
            while (post === posts[id]) {
              post = getRandomElement(hashtags[posts[id].hashtags[i]])
            }
            related.push(post)
            contains = true
          }
        }
      }
      return related
    },

    /**
     * @worth 3 POINTS
     * @function removePost
     * @description removes a post from the graph
     * @param {number} id - id of the post to remove
     * @returns {InstagramPost | null}
     *      return null if the post with that ID doesn't exist
     *      returns the removed InstagramPost
     */
    removePost: function (id) {
      if (posts[id] === undefined) {
        return null;
      }
      
      let post = posts[id]
      posts[id] = null
      const array = Object.values(hashtags)
      for (let i = 0; i < array.length; i++) {
        if (array[i].includes(post.id)) {
          for (let j = 0; j < array[i].length; j++) {
            if (array[i][j] == post.id) {
              array[i][j].splice(j,1)
            }
          }
        }
      }

      return post
    },

  };
};

module.exports = {
  Graph: InstaGraph,
  Post: InstagramPost,
}
