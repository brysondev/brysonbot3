/* BrysonBot3
 * by bryson (github.com/brysondev)
 *
 */
const logger = require("../../functions/logger.js");
const client = require("../../functions/client.js");
const config = require("../../config.json");
module.exports = () => {
  logger.info(`Bot disconnected`);
  client.login(config.token);
};
