// utils/errorHandler.js
import { EmbedBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';

const generateErrorId = () => Date.now();

const logErrorToFile = (errorId, error) => {
    const logFilePath = path.join(__dirname, '../../logs/errorLog.json');
    const errorLog = {
        id: errorId,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
    };

    fs.readFile(logFilePath, (readErr, data) => {
        let logs = [];
        if (!readErr) {
            try {
                logs = JSON.parse(data.toString());
            } catch {
            }
        }
        logs.push(errorLog);

        fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), writeErr => {
            if (writeErr) {
                console.error('Error writing to error log file:', writeErr);
            }
        });
    });
};

/**
 * Handles errors and informs the user with a visually improved embed message.
 * @param {Error} error The error that occurred.
 * @param {Interaction} interaction The interaction from which the error originated.
 */
export async function handleError(error, interaction) {
    console.error('Error:', error);

    const errorId = generateErrorId();
    logErrorToFile(errorId, error);

    const embed = new EmbedBuilder()
    .setTitle('🚨 An Error Occurred 🚨')
    .setDescription('Oops! Something didnt work as expected. But dont worry, were on it.')
    .addFields(
        { name: 'Error ID', value: `\`${errorId}\``, inline: true },
        { name: '\u200B', value: '\u200B', inline: true }, // This adds an empty field for spacing, if needed
        { name: 'Immediate Steps', value: 'Please try again later. If the issue persists, reach out to our support team with the Error ID.', inline: false }
    )
    .setColor(0xDD2E44) // A more specific shade of red for errors
    .setFooter({ text: 'Thank you for your patience!' })
    .setTimestamp();

    // Send the embed based on the interaction state
    if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [embed], ephemeral: true }).catch(console.error);
    } else {
        await interaction.reply({ embeds: [embed], ephemeral: true }).catch(console.error);
    }
}
