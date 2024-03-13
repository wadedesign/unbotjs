// src/commands/admin/purge.js

import { EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const moderatorIds = process.env.MODERATOR_IDS.split(',');

async function execute(interaction) {
  const amount = interaction.options.getInteger('amount');
  const reason = interaction.options.getString('reason') || 'No reason provided';

  if (!moderatorIds.includes(interaction.user.id)) {
    await interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
    return;
  }

  try {
    const messages = await interaction.channel.messages.fetch({ limit: amount });
    await interaction.channel.bulkDelete(messages, true);

    const embed = new EmbedBuilder()
      .setTitle('🗑️ Messages Purged')
      .setDescription(`${messages.size} messages have been deleted.`)
      .setColor(0xFFFF00) // yellow
      .addFields(
        { name: 'Channel', value: interaction.channel.name, inline: true },
        { name: 'Reason', value: reason, inline: true }
      )
      .setFooter({ text: `Purged by ${interaction.user.username} • ${new Date().toISOString()} UTC`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error('Error purging messages:', error);
    await interaction.reply({ content: `❌ An error occurred: ${error.message}`, ephemeral: true });
  }
}

const command = {
  name: 'purge',
  description: 'Delete a specified number of messages from the channel',
  options: [
    {
      name: 'amount',
      description: 'The number of messages to delete (max 100)',
      type: 4, 
      required: true,
    },
    {
      name: 'reason',
      description: 'The reason for deleting the messages',
      type: 3, 
      required: false,
    },
  ],
  execute,
};

export default command;