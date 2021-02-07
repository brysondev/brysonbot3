/* BrysonBot3
 * by bryson (github.com/brysondev)
 *
 */
const Discord = require("discord.js");
const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

module.exports = client;
