import { EmbedBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import logCommandUsage from '../../utils/logger';
import { handleError } from '../../utils/errorHandle/errorHandler';
import fetch from 'node-fetch';

async function generateResponseFromLLaMA2(prompt) {
  try {
    const response = await fetch('http://ip:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2-uncensored',
        prompt: prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    const jsonResponseParts = responseText.trim().split('\n').filter(Boolean);

    let fullResponse = jsonResponseParts.map(part => JSON.parse(part).response).join('');
    console.log("fullResponse:", fullResponse);
    return fullResponse;
  } catch (error) {
    console.error('Error fetching response from LLaMA2:', error);
    throw error;
  }
}

async function execute(interaction) {
  await logCommandUsage(command.name, interaction.user);

  const query = interaction.options.getString('askme');
  const serverInfoPath = path.join(__dirname, '..', '..', 'utils', 'chatData', 'server.yaml');
  const serverData = yaml.load(fs.readFileSync(serverInfoPath, 'utf8'));
  await interaction.deferReply({ ephemeral: true });

  try {
    const response = await generateResponseFromLLaMA2(`Here is some information about the server: ${JSON.stringify(serverData, null, 2)} ${query}`);

    const embed = new EmbedBuilder()
        .setTitle('AI Response')
        .setDescription(`\`\`\`${response}\`\`\``)
        .setColor(0x00FF00)
        .setFooter({ text: `Response for @${interaction.user.username}` })
        .setTimestamp();

    await interaction.followUp({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error('Error processing AI response:', error);
    await handleError(error, interaction);
  }
}

const command = {
  name: 'unbot',
  description: 'Have questions answered by an AI.',
  options: [{
    name: 'askme',
    description: 'Your question or statement for the AI.',
    type: 3,
    required: true,
  }],
  execute,
};

export default command;
