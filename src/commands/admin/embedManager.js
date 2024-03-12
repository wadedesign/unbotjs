// src/commands/embedManager.js
import { EmbedBuilder, ChannelType } from 'discord.js';
import { config } from 'dotenv';
config();

export default {
    name: 'embedmanager',
    description: 'Sends or updates an embed in a specified channel based on JSON input.',
    options: [
        {
            name: 'channel',
            description: 'The channel to send or update the embed in',
            type: 7, 
            required: true,
        },
        {
            name: 'json',
            description: 'The JSON string of the embed',
            type: 3, 
            required: true,
        },
        {
            name: 'messageid',
            description: 'The ID of the message to update (leave empty to send new)',
            type: 3, 
            required: false,
        },
    ],
    execute: async (interaction) => {
        const channel = interaction.options.getChannel('channel');
        const jsonString = interaction.options.getString('json');
        const messageId = interaction.options.getString('messageid');
    
        try {
            const data = JSON.parse(jsonString);
    
            // Extract message content and embeds array from the parsed JSON
            const messageContent = data.content || ''; 
            const embedsData = data.embeds || [];
    
            if (embedsData.length === 0) {
                throw new Error('No embeds found in the JSON. Ensure the JSON includes an "embeds" array with at least one embed object.');
            }
            const embeds = embedsData.map(embedData => new EmbedBuilder(embedData));
    
            if (messageId) {
                const message = await channel.messages.fetch(messageId);
                await message.edit({ content: messageContent, embeds });
                await interaction.reply({ content: `Embed updated successfully in ${channel.name}.`, ephemeral: true });
            } else {
                await channel.send({ content: messageContent, embeds });
                await interaction.reply({ content: `Embed sent successfully to ${channel.name}.`, ephemeral: true });
            }
        } catch (error) {
            console.error(`Error in embedManager command: ${error}`);
            await interaction.reply({ content: `Failed to parse JSON or send/update the embed. Error: ${error.message}`, ephemeral: true });
        }
    },
};

// andrew how do i get the json to use? go to https://discohook.org & fill everything out and copy the json 