/* BrysonBot3
 * by bryson (github.com/brysondev)
 *
 */
const Discord = require("discord.js");
const client = require("./functions/client.js");
const config = require("./config.json");
client.cmds = new Discord.Collection();
client.events = new Discord.Collection();
["cmdhandle", "eventhandle"].forEach((h) => {
  require(`./handlers/${h}`)(client, Discord);
});

client.servers = new Discord.Collection();
client.login(config.token);
