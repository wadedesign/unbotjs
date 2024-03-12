import { EmbedBuilder, version as discordJsVersion } from 'discord.js';
import { cpus, totalmem, platform } from 'os';
import dotenv from 'dotenv';
dotenv.config();

function addEmoji(key, value) {
  const emojiId = process.env[key];
  return emojiId ? `${emojiId} ${value}` : value;
}

const bunVersion = process.env.BUN;
const successColor = '#00FF00';
const nodeVersion = process.version;
const successEmoji = process.env.EMOJI_SUCCESS; 

async function execute(interaction) {
    const cpuModel = cpus()[0].model;
    const totalMemory = (totalmem() / 1024 / 1024 / 1024).toFixed(2); 
    const osType = platform(); 
    const botUptime = (process.uptime() / 60 / 60).toFixed(2); 

    const embed = new EmbedBuilder()
        .setTitle(`${successEmoji ? `${successEmoji} ` : ''}Unbot Information`)
        .setColor(successColor)
        .addFields(
            { name: 'Bun Version', value: addEmoji('BUN_VERSION', bunVersion), inline: true },
            { name: 'Discord.js', value: addEmoji('DISCORD_JS', discordJsVersion), inline: true },
            { name: 'Node.js', value: addEmoji('NODE_JS', nodeVersion), inline: true },
            { name: 'System', value: addEmoji('OS', osType), inline: true },
            { name: 'CPU', value: addEmoji('CPU', cpuModel), inline: true },
            { name: 'Memory', value: addEmoji('MEMORY', `${totalMemory} GB`), inline: true },
            { name: 'Uptime', value: addEmoji('UPTIME', `${botUptime} hours`), inline: true }
        )
        .setFooter({ text: 'Unbot' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

const command = {
    name: 'botinfo',
    description: 'Displays information about the bot.',
    options: [], 
    execute, 
};

export default command;
