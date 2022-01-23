const readBody = function (req) {
  return new Promise(function (resolve) {
    let body = [];
    req
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        resolve(Buffer.concat(body).toString());
      });
  });
};

module.exports = readBody;
