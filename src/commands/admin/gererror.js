import dotenv from 'dotenv';
import { EmbedBuilder } from 'discord.js';
import { getErrorLogEntry } from '../../utils/errorlog/errorUtils';

dotenv.config();

const adminIds = process.env.ME ? process.env.ME.split(',') : [];

async function execute(_interaction_) {
  if (!adminIds.includes(_interaction_.user.id.toString())) {
    await _interaction_.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    return;
  }

  const logId = _interaction_.options.getInteger('id');
  const logEntry = getErrorLogEntry(logId);

  if (!logEntry) {
    await _interaction_.reply({ content: 'No error log entry found with the provided ID.', ephemeral: true });
    return;
  }

  const { id, message, stack, timestamp } = logEntry;

  const embed = new EmbedBuilder()
    .setTitle(`Error Log Entry #${id}`)
    .setDescription(`\`\`\`yaml\n${message}\`\`\``)
    .addFields(
      { name: 'Stack Trace', value: `\`\`\`\n${stack}\`\`\``, inline: true },
      { name: 'Timestamp', value: `${timestamp}`, inline: true }
    )
    .setColor('#ff0000');

  await _interaction_.reply({ embeds: [embed], ephemeral: true });
}

const command = {
  name: 'get-error-log',
  description: 'Retrieve an error log entry by ID',
  options: [
    {
      name: 'id',
      description: 'The ID of the error log entry',
      type: 4,
      required: true,
    },
  ],
  execute,
};

export default command;