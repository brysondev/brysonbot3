/* BrysonBot3
 * by bryson (github.com/brysondev)
 * (Thanks Tzlil for this :3)
 */
let esc = "\033[";
let red = "31";
let blue = "34";
let bold = "1";

let bold_blue = `${esc}${blue};${bold}m`;
let bold_red = `${esc}${red};${bold}m`;

let reset = `${esc}0m`;

module.exports.error = (text) => {
  console.log(`${bold_red}[ERROR]${reset} ${text}`);
};

module.exports.info = (text) => {
  console.log(`${bold_blue}[INFO]${reset} ${text}`);
};

module.exports.warn = (text) => {
  console.log(`${bold_red}[WARN]${reset} ${text}`);
};
