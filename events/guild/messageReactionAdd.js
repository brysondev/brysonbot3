/* BrysonBot3
 * by bryson (github.com/brysondev)
 *
 */
const logger = require("../../functions/logger");
const db = require("quick.db");

module.exports = async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return;
  if (!reaction.message.guild) return;
  const rolecheck = db.get(`ruleacceptrole_${reaction.message.guild.id}`);
  const channelcheck = db.get(`ruleacceptchannel_${reaction.message.guild.id}`);
  const roleEmoji = "🚩";
  if (reaction.message.channel.id === channelcheck) {
    if (reaction.emoji.name === roleEmoji) {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.add(rolecheck);
    } else return;
  }
  logger.info(
    `${user.username} has accepted the rules in "${
      reaction.message.guild.name
    }" and recieved the role "${
      reaction.message.guild.roles.cache.get(rolecheck).name
    }"`
  );
};
