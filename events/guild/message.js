/* BrysonBot3
 * by bryson (github.com/brysondev)
 * (This is mostly Tzlil code)
 */
const stream = require("stream");
const config = require("../../config.json");
const client = require("../../functions/client.js");
const logger = require("../../functions/logger");
const Discord = require("discord.js");
const cooldowns = new Discord.Collection();
module.exports = async (message) => {
  let f = message.mentions.users.first();
  if (f) {
    if (f.id == client.user.id)
      message.reply(`Please use ${config.prefix}help`);
  }
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;
  let pipes = message.content.slice(config.prefix.length).split("|");
  let buffer;

  let time = process.hrtime();

  for (let i = 0; i < pipes.length; i++) {
    let cmd = pipes[i].trim();
    let s = cmd.split(" ");

    let commandHandler =
      client.cmds.get(s[0].toLowerCase()) ||
      client.cmds.find(
        (cmd) => cmd.config.aliases && cmd.config.aliases.includes(s[0])
      );
    if (!commandHandler) {
      buffer = null;
      break;
    }

    let stdin = new stream.PassThrough();
    let stdout = new stream.PassThrough();
    if (i > 0) {
      buffer.pipe(stdin);
      buffer.on("end", () => {
        stdin.end();
      });
    } else {
      stdin.end();
    }

    buffer = stdout;
    if (i == 0 && commandHandler.config.stdinRequired) {
      stdout.write("text/plain");
      stdout.end(
        `\`${commandHandler.config.name}\` is meant to be piped into from other commands.`
      );
      break;
    }

    if (commandHandler.config.permissions) {
      const authorPerms = message.channel.permissionsFor(message.author);
      if (!authorPerms || !authorPerms.has(commandHandler.config.permissions)) {
        return;
      }
    }

    if (commandHandler.config.cooldown != null) {
      if (!cooldowns.has(commandHandler.config.name)) {
        cooldowns.set(commandHandler.config.name, new Discord.Collection());
      }
      const now = Date.now();
      const timestamps = cooldowns.get(commandHandler.config.name);
      const cooldownAmount = (commandHandler.config.cooldown || 3) * 1000;

      if (timestamps.has(message.author.id)) {
        const expirationTime =
          timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          stdout.write("text/plain");
          stdout.end(
            `please wait ${timeLeft.toFixed(
              1
            )} more second(s) before reusing the \`${
              commandHandler.config.name
            }\` command.`
          );
        }
      } else {
        commandHandler
          .run(
            {
              channel: message.channel,
              member: message.member,
              author: message.author,
              mentions: message.mentions,
              guild: { id: message.guild.id },
              content: s.slice(1).join(" "),
            },
            stdin,
            stdout
          )
          .catch((reason) => {
            stdout.end(
              `\`${commandHandler.config.name}\` has encountered an error`
            );
            logger.error(
              `Error at command ${commandHandler.config.name}, reason: ${reason}`
            );
          });
      }
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    } else {
      commandHandler
        .run(
          {
            channel: message.channel,
            member: message.member,
            author: message.author,
            mentions: message.mentions,
            guild: { id: message.guild ? message.guild.id : null },
            content: s.slice(1).join(" "),
          },
          stdin,
          stdout
        )
        .catch((reason) => {
          stdout.end(
            `\`${commandHandler.config.name}\` has encountered an error`
          );
          logger.error(
            `Error at command ${commandHandler.config.name}, reason: ${reason}`
          );
        });
    }
  }

  if (!buffer) {
    logger.error(
      `Unknown command sent by ${message.author.tag} in ${message.guild.name}`
    );
    return;
  }

  let elapsed = process.hrtime(time)[1] / 1000000;

  buffer.once("data", (type) => {
    type = type.toString();
    if (type == "text/plain") {
      buffer.on("data", (data) => {
        if (data.length > 2000) {
          message.channel.send("Output is larger than character limit");
        } else {
          message.channel.send(sanitize(data.toString()));
        }
      });

      buffer.on("end", () => {
        logger.info(
          process.hrtime(time)[0] + " s, " + elapsed.toFixed(3) + " ms"
        );
      });
    } else {
      let chunks = [];
      buffer.on("data", (chunk) => {
        chunks.push(chunk);
      });
      buffer.on("end", () => {
        logger.info(
          process.hrtime(time)[0] + " s, " + elapsed.toFixed(3) + " ms"
        );

        let data = Buffer.concat(chunks);
        switch (type) {
          case "text/embed":
            message.channel.send(JSON.parse(data.toString()));
            break;

          case "image/png":
            message.channel.send({
              files: [{ attachment: data, name: "image.png" }],
            });
            break;

          case "image/jpeg":
            message.channel.send({
              files: [{ attachment: data, name: "image.jpg" }],
            });
            break;

          case "image/gif":
            message.channel.send({
              files: [{ attachment: data, name: "image.gif" }],
            });
            break;

          default:
            message.channel.send("Unknown type: " + type);
            break;
        }
      });
    }
  });
};
function sanitize(text) {
  return text.replace("@everyone", "@/everyone").replace("@here", "@/here");
}
