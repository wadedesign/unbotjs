import client from '../clientInstance'; // Adjust the import path as needed
import dotenv from 'dotenv';
import { EmbedBuilder } from 'discord.js';

dotenv.config();

const logCommandUsage = async (commandName, user) => {
  const logChannelId = process.env.LOG_CHANNEL_ID;

  if (!logChannelId) {
    console.error('LOG_CHANNEL_ID is not defined in your .env file.');
    return;
  }

  const logChannel = await client.channels.fetch(logChannelId);

  if (!logChannel) {
    console.error(`The channel with ID ${logChannelId} could not be found.`);
    return;
  }

  const randomColor = Math.floor(Math.random() * 0xFFFFFF); // Generates a random color
  const embed = new EmbedBuilder()
    .setColor(randomColor) // Sets the color of the embed
    .setTitle('Command Usage')
    .setDescription(`Command: \`/${commandName}\` was executed by <@${user.id}>`); // Uses user mention format for clickable mention

  await logChannel.send({ embeds: [embed] });
};

export default logCommandUsage;
