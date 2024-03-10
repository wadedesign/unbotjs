// src/commands/unbotchat.js
import { EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
import OpenAI from "openai";
import fs from 'fs';
import path from 'path';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function execute(interaction) {
    const query = interaction.options.getString('askme');

    // Load server information from the JSON file
    const serverInfoPath = path.join(__dirname, '..', 'server.json'); // could be the path unless changed
    const serverData = JSON.parse(fs.readFileSync(serverInfoPath, 'utf8'));

    await interaction.deferReply({ ephemeral: true });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": `You are george strait providing information about the Discord server. Here is some information about the server: ${JSON.stringify(serverData, null, 2)}`
                },
                {"role": "user", "content": query}
            ],
        });

        const response = completion.choices[0].message.content;

        const embed = new EmbedBuilder()
            .setTitle(`AI Response`)
            .setDescription(response)
            .setColor(0x00FF00) // A green color for messages
            .setFooter({ text: `Response for ${interaction.user.username}.`}) 
            .setTimestamp();

        await interaction.followUp({ embeds: [embed], ephemeral: true });
    } catch (error) {
        console.error(`Error fetching response from OpenAI:`, error);
        await interaction.followUp({ content: '❌ Error fetching response from AI. Please try again later.', ephemeral: true });
    }
}

const command = {
    name: 'unbotchat',
    description: 'have questions answered by an AI.',
    options: [
        {
            name: 'askme',
            description: 'Your question or statement for the AI.',
            type: 3, // Type 3 corresponds to STRING
            required: true,
        },
    ],
    execute,
};

export default command;

