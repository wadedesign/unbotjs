// src/commands/pingweb.js
import { EmbedBuilder } from 'discord.js';
import { config } from 'dotenv';
config();
const targetUrl = process.env.TARGET_URL; 

export default {
    name: 'pingweb',
    description: 'Pings a predefined website to check if it is online',
    options: [], 
    execute: async (interaction) => {
        try {
            const startTime = Date.now();
            const response = await fetch(targetUrl, { method: 'HEAD' });
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            const embed = new EmbedBuilder();

            if (response.ok) {
                embed.setTitle('Website Status')
                    .setColor(0x00FF00) // A green color for success
                    .addFields(
                        { name: 'URL', value: targetUrl },
                        { name: 'Status', value: 'Online', inline: true },
                        { name: 'Response Time', value: `${responseTime} ms`, inline: true },
                    );
            } else {
                embed.setTitle('Website Status')
                    .setColor(0xFFA500) // An orange color for warning
                    .addFields(
                        { name: 'URL', value: targetUrl },
                        { name: 'Status', value: `Online but returned a status of ${response.status}`, inline: true },
                        { name: 'Response Time', value: `${responseTime} ms`, inline: true },
                    );
            }
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            const embed = new EmbedBuilder()
                .setTitle('Website Status')
                .setColor(0xFF0000) // A red color for error
                .addFields(
                    { name: 'URL', value: targetUrl },
                    { name: 'Status', value: 'Failed to reach the website. It might be offline or the URL is incorrect.' },
                );
            await interaction.reply({ embeds: [embed] });
        }
    }
};


