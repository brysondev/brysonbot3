/* BrysonBot3
 * by bryson (github.com/brysondev)
 *
 */
const Discord = require("discord.js");
const logger = require("../../functions/logger");
const db = require("quick.db");
const client = require("../../functions/client.js");
module.exports = (member) => {
  const leaveCheck = db.get(`welchannel_${member.guild.id}`);
  logger.info(leaveCheck);
  if (leaveCheck === null) return;

  const embed = new Discord.MessageEmbed()
    .setColor(10038562)
    .addField("User:", member.user.username)
    .setDescription("User has left the server.")
    .setTimestamp()
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }));

  client.channels.cache.get(leaveCheck).send(embed);

  logger.info(`${member.user.username} has left ${member.guild.name}`);
};
