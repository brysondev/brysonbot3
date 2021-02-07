/* BrysonBot3
 * by bryson (github.com/brysondev)
 *
 */
const db = require("quick.db");
const Discord = require("discord.js");
const logger = require("../functions/logger.js");
const client = require("../functions/client.js");
module.exports.run = async (message, stdin, stdout) => {
  if (!message.member.guild.me.hasPermission("MANAGE_ROLES", "ADMINISTRATOR")) {
    logger.error(
      `I do not have permission to perform acceptrules in "${message.member.guild.name}"`
    );
    return message.channel.send(
      `I do not have permission to perform this action. Required Permissions: "MANAGE_ROLES"`
    );
  }

  const rolecheck = db.get(`ruleacceptrole_${message.guild.id}`);
  const channelcheck = db.get(`ruleacceptchannel_${message.guild.id}`);

  if (
    rolecheck === null ||
    message.mentions.roles.first() ||
    message.member.guild.roles.cache.get(message.content)
  ) {
    let role = message.mentions.roles.first();
    if (role) role = role.id;
    else if (message.member.guild.roles.cache.get(message.content))
      role = message.member.guild.roles.cache.get(message.content).id;
    else
      return message.channel.send(
        "Please mention the role to be given to users (or use the ID)"
      );
    db.set(`ruleacceptrole_${message.guild.id}`, role);
    role = message.member.guild.roles.cache.get(role);
    return message.channel.send(`Role set to "${role.name}"`);
  }

  if (
    channelcheck === null ||
    message.mentions.channels.first() ||
    client.channels.cache.get(message.content)
  ) {
    let channel = message.mentions.channels.first();
    if (channel) channel = channel.id;
    else if (client.channels.cache.get(message.content))
      channel = client.channels.cache.get(message.content).id;
    else
      return message.channel.send(
        "Please mention the channel used for this role check (or use the ID)"
      );
    db.set(`ruleacceptchannel_${message.guild.id}`, channel);
    channel = client.channels.cache.get(message.content);
    return message.channel.send(`Channel set to "${channel.name}"`);
  }

  if (message.channel.id === channelcheck) {
    const roleEmoji = "🚩";
    let embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Please read the rules of the server.")
      .setDescription(
        "Once read, kindly click the 🚩 reaction to gain access to the rest of the server."
      );

    let messageEmbed = await message.channel.send(embed);
    messageEmbed.react(roleEmoji);
  } else
    return message.channel.send(
      "This command can only be used in the special channel specified"
    );
};

module.exports.config = {
  name: "acceptrules",
  aliases: ["ar"],
  usage: "[role]/[channel]",
  info: "Sets Embed to confirm rules have been read",
  permissions: "ADMINISTRATOR",
};
