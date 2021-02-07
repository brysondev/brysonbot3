/* BrysonBot3
 * by bryson (github.com/brysondev)
 *
 */
const client = require("../functions/client.js");
const config = require("../config.json");
module.exports.run = async (message, stdin, stdout) => {
  const data = [];

  if (message.content) {
    const name = message.content.toLowerCase();
    const command =
      client.cmds.get(name) ||
      client.cmds.find(
        (c) => c.config.aliases && c.config.aliases.includes(name)
      );

    if (!command) {
      return message.channel.send("that's not a valid command!");
    }

    data.push(`**Name:** ${command.config.name}`);

    if (command.config.aliases)
      data.push(`**Aliases:** ${command.config.aliases.join(", ")}`);
    if (command.config.info)
      data.push(`**Description:** ${command.config.info}`);
    if (command.config.usage)
      data.push(
        `**Usage:** ${config.prefix}${command.config.name} ${command.config.usage}`
      );
    if (command.config.cooldown)
      data.push(`**Cooldown:** ${command.config.cooldown} second(s)`);
  } else {
    data.push("Here's a list of all my commands:");
    data.push(client.cmds.map((command) => command.config.name).join(", "));
    data.push(
      `\nYou can send \`${config.prefix}help [command name]\` to get info on a specific command!`
    );
  }

  message.channel.send(data, { split: true });
};

module.exports.config = {
  name: "help",
  aliases: ["commands", "h"],
  usage: "[command]",
  info: "List all of my commands or info about a specific command.",
  cooldown: 5,
};
