const path = require("path");
const fs = require("fs/promises");

/**
 * @function serveIndex
 * @description Retrieves the index.html page from the staticFieldsDirectory
 *              and sends it back. If there was any issue, it returns an INTERNAL SERVER ERROR.
 * @returns void but sends back a response.
 */

const serveIndex = function (req, res) {
    // setting the page to index.html in the staticFilesDirectory
    const page = req.app.staticFilesDirectory + '/index.html'
    return fs.readFile(page).then(function(data) {
        // storing data and time in cache
        req.app.cache[req.url] = {
            result: data,
            cachedAtMs: Date.now(),
        }
        res.write(data)
        res.writeHead(200)
        res.end()
        // return 500 error if couldn't read file
    }).catch(function(err) {
        console.log(err)
        res.writeHead(500)
        res.end()
    })
};

module.exports = serveIndex;
