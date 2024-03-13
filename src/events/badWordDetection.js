require('dotenv').config();

import { EmbedBuilder } from 'discord.js';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export function setupBadWordDetection(client) {
  client.on('messageCreate', async message => {
    if (message.author.bot) return; // Ignore bots

    try {
      const moderation = await openai.moderations.create({ input: message.content });
      console.log("Moderation response:", moderation);
      const containsBadWords = moderation.results.some(result => result.flagged);

      if (containsBadWords) {
        console.log(`Message flagged for moderation. Banning user: ${message.author.tag}`);
        const banReason = 'Using offensive language';
        const member = message.member;

        await member.ban({ reason: banReason });
        await message.delete();
        console.log(`Message deleted and user banned: ${member.user.tag}`);

        const modLogsChannelId = process.env.LOG_CHANNEL_ID;
        const logChannel = await client.channels.fetch(modLogsChannelId);

        if (logChannel) {
          const embed = new EmbedBuilder()
            .setTitle('🚫 User Banned')
            .setDescription(`${member.user.tag} has been banned.`)
            .addFields({ name: 'Reason', value: banReason })
            .setColor(0xFF0000)
            .setTimestamp();

          await logChannel.send({ embeds: [embed] });
          console.log("Ban logged in mod-logs channel.");
        } else {        }
      } else {
        console.log("Message is clean. No action taken.");
      }
    } catch (error) {
      console.error("Failed to check message for moderation. Error:", error);
    }
  });
}
