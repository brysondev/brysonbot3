/* BrysonBot3
 * by bryson (github.com/brysondev)
 *
 */
const logger = require("../functions/logger.js");
const fs = require("fs");

module.exports = (client, Discord) => {
  const loaddir = (dir) => {
    const eventFiles = fs
      .readdirSync(`./events/${dir}`)
      .filter((f) => f.endsWith(".js"));
    for (const file of eventFiles) {
      const eventType = require(`../events/${dir}/${file}`);
      const event = file.split(".")[0];
      client.on(event, eventType.bind(null));
      logger.info(`Loaded ${dir}/${file}`);
    }
  };
  ["client", "guild"].forEach((eDirs) => loaddir(eDirs));
};
