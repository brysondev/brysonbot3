/* BrysonBot3
 * by bryson (github.com/brysondev)
 *
 */
const db = require("quick.db");
const logger = require("../functions/logger.js");
const client = require("../functions/client.js");
module.exports.run = async (message, stdin, stdout) => {
  let channel = message.mentions.channels.first();
  if (channel) channel = channel.id;
  else if (client.channels.cache.get(message.content))
    channel = client.channels.cache.get(message.content).id;
  else
    return message.channel.send(
      "Please # mention the channel or use the channel ID"
    );
  db.set(`welchannel_${message.guild.id}`, channel);
  channel = client.channels.cache.get(channel);
  message.channel.send(`Welcome channel is set to ${channel.name}.`);
  logger.info(
    `Welcome message channel set for "${message.member.guild.name}" in "${channel.name}"`
  );
};

module.exports.config = {
  name: "setwelcome",
  aliases: ["sw", "setw"],
  usage: "<channel name>",
  info: "Sets the welcome message channel",
  permissions: "KICK_MEMBERS",
  cooldown: 5,
};
