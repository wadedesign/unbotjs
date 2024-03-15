import { EmbedBuilder, AttachmentBuilder } from 'discord.js';
import logCommandUsage from '../../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const customEmoji = process.env.PINGME;
const successColor = '#FF9F1C'; // Bright orange color
const loadingFrames = [
  '⠋',
  '⠙',
  '⠹',
  '⠸',
  '⠼',
  '⠴',
  '⠦',
  '⠧',
  '⠇',
  '⠏',
];

async function execute(_interaction_) {
  await logCommandUsage(command.name, _interaction_.user);

  const loadingMessage = await _interaction_.reply(`Pinging ${loadingFrames[0]}`);

  for (let i = 1; i < loadingFrames.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 200));
    await loadingMessage.edit(`Pinging ${loadingFrames[i]}`);
  }


  const embed = new EmbedBuilder()
    .setTitle(`${customEmoji} Pong!`)
    .setDescription('I\'m alive and ready to rock your world!')
    .setColor(successColor)
    .addFields(
      { name: '⏱️ Latency', value: `\`${Date.now() - _interaction_.createdTimestamp}ms\``, inline: true },
      { name: '⚡ API Latency', value: `\`${Math.round(_interaction_.client.ws.ping)}ms\``, inline: true }
    )
    .setTimestamp();

  await loadingMessage.edit({ content: ' ', embeds: [embed],});
}

const command = {
  name: 'ping',
  description: 'Replies with Pong!',
  options: [],
  execute,
};

export default command;