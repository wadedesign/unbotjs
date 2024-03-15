import client from '../clientInstance'; 
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

  const randomColor = Math.floor(Math.random() * 0xFFFFFF); 
  const embed = new EmbedBuilder()
    .setColor(randomColor) 
    .setTitle('🔧 Command Usage 🔧') 
    .setDescription(`A command has been used! Details below:`)
    .addFields(
      { name: 'Command', value: `\`/${commandName}\``, inline: true },
      { name: 'Executed By', value: `<@${user.id}>`, inline: true },
      { name: 'Timestamp', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false } // Using Discord's Timestamp Styles for better readability
    )
    .setThumbnail(user.displayAvatarURL()) 
    .setTimestamp(); 

  await logChannel.send({ embeds: [embed] });
};

export default logCommandUsage;

