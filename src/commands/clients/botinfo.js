import { EmbedBuilder, version as discordJsVersion } from 'discord.js';
import { cpus, totalmem, platform } from 'os';
import { getCustomEmoji } from '../../utils/importEmojis/emojiUtils'; // util func

import dotenv from 'dotenv';

dotenv.config();

function addEmoji(_key_, _value_) {
  const emojiId = process.env[_key_];
  return emojiId ? `${emojiId} ${_value_}` : _value_;
}

const logo = getCustomEmoji('logo');

const bunVersion = process.env.BUN;
const successColor = '#00FF00';
const nodeVersion = process.version;
const successEmoji = process.env.EMOJI_SUCCESS;

async function execute(_interaction_) {
  const cpuModel = cpus()[0].model;
  const totalMemory = (totalmem() / 1024 / 1024 / 1024).toFixed(2);
  const osType = platform();
  const botUptime = (process.uptime() / 60 / 60).toFixed(2);

  const embed = new EmbedBuilder()
    .setTitle(`${logo} Unbot Information`)
    .setColor(successColor)
    .setThumbnail('https://i.imgur.com/AfFp7pu.png')
    .addFields(
      {
        name: `${addEmoji('BUN_VERSION', 'Bun Version')}`,
        value: `\`\`\`yaml\n${bunVersion}\`\`\``,
        inline: true,
      },
      {
        name: `${addEmoji('DISCORD_JS', 'Discord.js')}`,
        value: `\`\`\`yaml\n${discordJsVersion}\`\`\``,
        inline: true,
      },
      {
        name: `${addEmoji('NODE_JS', 'Node.js')}`,
        value: `\`\`\`yaml\n${nodeVersion}\`\`\``,
        inline: true,
      },
      {
        name: `${addEmoji('OS', 'System')}`,
        value: `\`\`\`yaml\n${osType}\`\`\``,
        inline: true,
      },
      {
        name: `${addEmoji('CPU', 'CPU')}`,
        value: `\`\`\`yaml\n${cpuModel}\`\`\``,
        inline: true,
      },
      {
        name: `${addEmoji('MEMORY', 'Memory')}`,
        value: `\`\`\`yaml\n${totalMemory} GB\`\`\``,
        inline: true,
      },
      {
        name: `${addEmoji('UPTIME', 'Uptime')}`,
        value: `\`\`\`yaml\n${botUptime} hours\`\`\``,
        inline: true,
      },
    )
    .setFooter({ text: 'Unbot' })
    .setTimestamp();

  await _interaction_.reply({ embeds: [embed] });
}

const command = {
  name: 'botinfo',
  description: 'Displays information about the bot.',
  options: [],
  execute,
};

export default command;


/**
 * @upgraded final version
 * 
 * @written by @wadder12
 * 
 */