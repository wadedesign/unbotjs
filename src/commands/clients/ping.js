import { EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
import logCommandUsage from '../../utils/logger';
import showLoadingAnimation from '../../utils/loaderAnime/loadingAnimation';

dotenv.config();

const customEmoji = process.env.PINGME;
const successColor = '#FF9F1C';

async function execute(interaction) {
    await logCommandUsage(command.name, interaction.user);

    const loadingMessage = await interaction.reply('looking for the best ping...');
    await showLoadingAnimation(loadingMessage); // loading animation

    const latency = Date.now() - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    const embed = new EmbedBuilder()
        .setTitle(`${customEmoji} Pong!`)
        .setDescription("I'm alive and ready to rock your world!")
        .setColor(successColor)
        .addFields(
            { name: '⏱️ Latency', value: `\`${latency}ms\``, inline: true },
            { name: '⚡ API Latency', value: `\`${apiLatency}ms\``, inline: true }
        )
        .setTimestamp();

    await interaction.editReply({ content: ' ', embeds: [embed] });
}

const command = {
    name: 'ping',
    description: 'Replies with Pong!',
    execute,
};

export default command;
