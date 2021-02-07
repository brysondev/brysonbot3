/* BrysonBot3
 * by bryson (github.com/brysondev)
 *
 */
const logger = require("../functions/logger.js");
const fs = require("fs");

module.exports = (client, Discord) => {
  const cmdFiles = fs.readdirSync("./cmds/").filter((f) => f.endsWith(".js"));
  for (const file of cmdFiles) {
    const cmd = require(`../cmds/${file}`);
    if (cmd.config.name) {
      client.cmds.set(cmd.config.name, cmd);
      logger.info(`Loaded ${cmd.config.name}`);
    } else {
      continue;
    }
  }
  if (cmdFiles.length > 0) {
    logger.info(`Loaded ${cmdFiles.length} commands`);
  } else {
    logger.warn("No commands loaded! This might be a problem...");
  }
};
