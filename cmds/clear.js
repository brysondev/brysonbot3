/* BrysonBot3
 * by bryson (github.com/brysondev)
 *
 */
const logger = require("../functions/logger.js");
module.exports.run = async (message, stdin, stdout) => {
  const args = message.content;
  if (!args || args < 1 || args > 100 || isNaN(args))
    return stdout.end(
      "Please define how many messages you want cleared(Max 100)"
    );
  if (!message.member.guild.me.hasPermission("MANAGE_MESSAGES")) {
    logger.error(
      `I do not have permission to perform clear in "${message.member.guild.name}"`
    );
    return stdout.end(`I do not have permission to perform this action.`);
  }

  await message.channel.messages.fetch({ limit: args }).then((messages) => {
    message.channel.bulkDelete(messages, true);
  });
  logger.info(`Cleared ${args} messages in "${message.member.guild.name}"`);
};

module.exports.config = {
  name: "clear",
  aliases: ["c", "cl"],
  usage: "<num of msgs>",
  info: "Clear chat",
  permissions: "MANAGE_MESSAGES",
};
