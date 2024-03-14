// utils/errorHandler.js
import { EmbedBuilder } from 'discord.js';

/**
 * Handles errors and informs the user.
 * @param {Error} error The error that occurred.
 * @param {Interaction} interaction The interaction from which the error originated.
 */
export async function handleError(error, interaction) {
    console.error('Error:', error);

    // Optionally, log the error using a custom logging utility
    // await logError(error);

    const embed = new EmbedBuilder()
        .setTitle('Oops! Something went wrong 😢')
        .setDescription('There was an issue processing your request. Please try again later.')
        .setColor(0xFF0000); // Red color for error

    // Check if the interaction has already been replied to
    if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [embed], ephemeral: true }).catch(console.error);
    } else {
        await interaction.reply({ embeds: [embed], ephemeral: true }).catch(console.error);
    }
}
