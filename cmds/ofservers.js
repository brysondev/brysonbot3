/* BrysonBot3
 * by bryson (github.com/brysondev)
 *
 */
const vmsq = require("vmsq");
const fs = require("fs");
const gameDig = require("gamedig");
const Discord = require("discord.js");
const logger = require("../functions/logger.js");

module.exports.run = async (message, stdin, stdout) => {
  let msg = await message.channel.send("Collecting IPs...");
  const stream = vmsq("hl2master.steampowered.com:27011", 0xff, {
    gamedir: "open_fortress",
    empty: 1,
  });
  const servers = [];
  const datalist = [];

  stream.on("data", (ip) => {
    servers.push(ip);
  });
  stream.on("error", (err) => {
    logger.error(err);
  });
  stream.on("end", async () => {
    for (const ip of servers) {
      const port = ip.split(":")[1];
      const ipaddr = ip.split(":")[0];
      await gameDig
        .query({
          type: "tf2",
          host: ipaddr,
          port: port,
        })
        .then((state) => {
          datalist.push(state);
        })
        .catch((error) => {
          // I don't care about your errors Karen.
        });
    }

    let embed = new Discord.MessageEmbed()
      .setTitle("Active Open Fortress Servers")
      .setTimestamp()
      .setFooter(
        "Server query by bryson#1337",
        "https://i.imgur.com/z1fqM6a.png"
      );

    if (datalist.length !== 0) {
      for (const data of datalist) {
        embed.addFields(
          { name: "Server Name:", value: data.name, inline: true },
          { name: "Server IP:", value: `steam://connect/${data.connect}`, inline: true },
          {
            name: "Players:",
            value: `${data.players.length} / ${data.maxplayers}`,
            inline: true,
          }
        );
      }
      embed.setColor(3066993);
    } else {
      embed.setDescription("No servers are active at this time.");
      embed.setColor(15158332);
    }
    message.channel.send(embed);
    msg.delete();
  });
};

module.exports.config = {
  name: "ofservers",
  aliases: ["serverlist", "servers", "isanyoneplaying"],
  info: "List all of the active Open Fortress Servers.",
  cooldown: 10,
};
