const path = require("path");
const fs = require("fs/promises");

/**
 * @function serveFolder
 * @description Retrieves any file in the staticFilesDirectory. If it
 *              doesn't exist, returns a NOT_FOUND or else it returns an
 *              INTERNAL_ERROR
 */

const serveFolder = function (req, res) {
    // setting the page to staticFilesDirectory followed by the request's pathname
    const page = req.app.staticFilesDirectory + req.pathname
    return fs.readFile(page).then(function(data) {
        // storing data and time in cache
        req.app.cache[req.url] = {
            result: data,
            cachedAtMs: Date.now(),
        }
        res.write(data)
        res.writeHead(200)
        res.end()
    }).catch(function(err) {
        console.log(err)
        // return 404 error if path not found
        if (err.code === 'ENOENT') {
            res.writeHead(404)
        }
        // else return 500 error
        else {
            res.writeHead(500)
        }
        res.end()
    })
};

module.exports = serveFolder;
