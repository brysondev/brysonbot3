/* BrysonBot3
 * by bryson (github.com/brysondev)
 *
 */
const Discord = require("discord.js");
const logger = require("../../functions/logger.js");
const db = require("quick.db");
const client = require("../../functions/client.js");
module.exports = (member) => {
  const welcomeCheck = db.get(`welchannel_${member.guild.id}`);

  if (welcomeCheck === null) return;

  const embed = new Discord.MessageEmbed()
    .setColor(3447003)
    .addField("User:", member.user.username)
    .setDescription("User has joined the server.")
    .setTimestamp()
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }));

  client.channels.cache.get(welcomeCheck).send(embed);

  logger.info(`${member.user.username} has joined ${member.guild.name}`);
};
