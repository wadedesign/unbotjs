import { EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml'; // Import the js-yaml module
import logCommandUsage from '../../utils/logger'; // Adjust the import path as needed
import { handleError } from '../../utils/errorHandle/errorHandler'; // Adjust the import path as needed

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function execute(interaction) {
    await logCommandUsage(command.name, interaction.user);

    const query = interaction.options.getString('askme');
    const serverInfoPath = path.join(__dirname, '..', '..', 'utils', 'chatData', 'server.yaml');
    const serverData = yaml.load(fs.readFileSync(serverInfoPath, 'utf8'));
    await interaction.deferReply({ ephemeral: true });
    const startTime = Date.now();

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                {
                    role: "system",
                    content: `You are Elon Musk. Be witty and mean, and keep your responses short while providing information about the Discord server. Here is some information about the server: ${JSON.stringify(serverData, null, 2)}`
                },
                { role: "user", content: query }
            ],
        });

        const response = completion.choices[0].message.content;
        const endTime = Date.now();
        const responseTime = (endTime - startTime) / 1000;

        const embed = new EmbedBuilder()
            .setTitle('AI Response')
            .setDescription(`\`\`\`${response}\`\`\``)
            .setColor(0x00FF00)
            .addFields({ name: 'Response Time', value: `\`${responseTime} seconds\``, inline: true })
            .setFooter({ text: `Response for @${interaction.user.username}` })
            .setTimestamp();

        await interaction.followUp({ embeds: [embed], ephemeral: true });
    } catch (error) {
        console.error('Error fetching response from OpenAI:', error);
        await handleError(error, interaction); // func errorhandler
    }
}

const command = {
    name: 'unbotchat',
    description: 'Have questions answered by an AI.',
    options: [
        {
            name: 'askme',
            description: 'Your question or statement for the AI.',
            type: 3, 
            required: true,
        },
    ],
    execute,
};

export default command;
