// src/commands/ping.js
import { EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const customEmoji = process.env.PINGME; 
const successColor = '#00FF00'; 

async function execute(interaction) {
    const embed = new EmbedBuilder()
        .setTitle(`${customEmoji} Pong!`)
        .setDescription('im alive, lol!')
        .setColor(successColor)
        .addFields(
            { name: 'Latency', value: `\`${Date.now() - interaction.createdTimestamp}ms\``, inline: true },
            { name: 'API Latency', value: `\`${Math.round(interaction.client.ws.ping)}ms\``, inline: true }
        )
        .setFooter({ text: 'Pingerme' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

const command = {
    name: 'ping',
    description: 'Replies with Pong!',
    options: [], 
    execute, 
};

export default command;
