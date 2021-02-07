/* BrysonBot3
 * by bryson (github.com/brysondev)
 *
 */
const config = require("../../config.json");
const logger = require("../../functions/logger.js");
const client = require("../../functions/client.js");

module.exports = () => {
  logger.info(`Started in ${client.guilds.cache.size} guilds`);
  client.user.setActivity(`${config.prefix}help`, { type: "LISTENING" });
};
