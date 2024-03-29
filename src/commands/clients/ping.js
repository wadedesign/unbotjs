import { EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
import logCommandUsage from '../../utils/logger';
import showLoadingAnimation from '../../utils/loaderAnime/loadingAnimation';

dotenv.config();

const customEmoji = process.env.PINGME;
const successColor = '#FF9F1C';

async function execute(_interaction_) {
  await logCommandUsage(command.name, _interaction_.user);

  const loadingMessage = await _interaction_.reply('Looking for the best ping...');
  await showLoadingAnimation(loadingMessage); // loading animation

  const latency = Date.now() - _interaction_.createdTimestamp;
  const apiLatency = Math.round(_interaction_.client.ws.ping);

  const embed = new EmbedBuilder()
    .setColor(successColor)
    .setTitle(`${customEmoji} Pong!`)
    .setDescription('I\'m alive and ready to rock your world!')
    .addFields(
      { name: 'Latency', value: `\`\`\`yaml\n${latency} ms\`\`\``, inline: true },
      { name: 'API Latency', value: `\`\`\`yaml\n${apiLatency} ms\`\`\``, inline: true }
    )
    .setFooter({ text: `Requested by ${_interaction_.user.username}`, iconURL: _interaction_.user.displayAvatarURL() })
    .setTimestamp();

  await _interaction_.editReply({ content: ' ', embeds: [embed] });
}

const command = {
  name: 'ping',
  description: 'responds with the bot\'s latency',
  execute,
};

export default command;