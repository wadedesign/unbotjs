// src/commands/pingweb.js
import { EmbedBuilder } from 'discord.js';
import { config } from 'dotenv';
config();
const targetUrl = process.env.TARGET_URL;

export default {
  name: 'pingweb',
  description: 'Pings a predefined website to check if it is online',
  options: [],
  execute: async (_interaction_) => {
    try {
      const startTime = Date.now();
      const response = await fetch(targetUrl, { method: 'HEAD' });
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const embed = new EmbedBuilder()
        .setTitle('🌐 Website Status')
        .setThumbnail('https://i.imgur.com/YbYTNzf.png') 
        .addFields(
          { name: '🌍 URL', value: `\`\`\`yaml\n${targetUrl}\`\`\``, inline: true },
          {
            name: '⚡ Response Time',
            value: `\`\`\`yaml\n${responseTime} ms\`\`\``,
            inline: true,
          }
        );

      if (response.ok) {
        embed
          .setColor('#00FF00') 
          .addFields({
            name: '✅ Status',
            value: `\`\`\`yaml\nOnline\`\`\``,
            inline: true,
          });
      } else {
        embed
          .setColor('#FFA500')
          .addFields({
            name: '⚠️ Status',
            value: `\`\`\`yaml\nOnline but returned a status of ${response.status}\`\`\``,
            inline: true,
          });
      }

      await _interaction_.reply({ embeds: [embed] });
    } catch (error) {
      const embed = new EmbedBuilder()
        .setTitle('🌐 Website Status')
        .setColor('#FF0000') 
        .setThumbnail('https://i.imgur.com/YbYTNzf.png') 
        .addFields(
          { name: '🌍 URL', value: `\`\`\`yaml\n${targetUrl}\`\`\``, inline: true },
          {
            name: '❌ Status',
            value: '```yaml\nFailed to reach the website. It might be offline or the URL is incorrect.```',
            inline: true,
          }
        );

      await _interaction_.reply({ embeds: [embed] });
    }
  },
};


/**
 * @todo need to add custom emojis for the status
 * @todo find better picture
 * 
 */