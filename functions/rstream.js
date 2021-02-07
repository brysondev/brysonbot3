/* BrysonBot3
 * by bryson (github.com/brysondev)
 * (Tzlil code)
 */

module.exports.stdin = function (stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let t;
    stream.once("data", (type) => {
      t = type.toString();
      stream.on("data", (chunk) => {
        chunks.push(chunk);
      });
    });
    stream.once("end", () => {
      resolve({ data: Buffer.concat(chunks), type: t });
    });
  });
};

module.exports.stream = function (stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => {
      chunks.push(chunk);
    });
    stream.once("end", () => {
      resolve(Buffer.concat(chunks));
    });
  });
};
