// src/commands/timeoutuser.js
import { EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const moderatorIds = process.env.MODERATOR_IDS.split(',');
const logChannelId = process.env.LOG_CHANNEL_ID;

async function execute(interaction) {
    const user = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('duration'); // Duration in minutes
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!moderatorIds.includes(interaction.user.id)) {
        await interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
        return;
    }

    try {
        const member = await interaction.guild.members.fetch(user.id);
        await member.timeout(duration * 60 * 1000, reason);

        try {
            await user.send(`You have been placed in timeout for ${duration} minutes. Reason: ${reason}`);
        } catch (error) {
            console.error('Could not send DM to user:', error);
        }

        const embed = new EmbedBuilder()
            .setTitle('⏳ User Timed Out')
            .setDescription(`User ${user.username} has been placed in timeout for ${duration} minutes.`)
            .setColor(0xFFA500) // Using orange color for timeout indication
            .addFields(
                { name: 'User', value: user.tag, inline: true },
                { name: 'Duration', value: `${duration} minutes`, inline: true },
                { name: 'Reason', value: reason, inline: true }
            )
            .setFooter({ text: `Timed out by ${interaction.user.username} • ${new Date().toISOString()} UTC`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });

        const logChannel = await interaction.guild.channels.fetch(logChannelId);
        if(logChannel) {
            await logChannel.send({ embeds: [embed] });
        } else {
            console.error('Log channel not found');
        }
    } catch (error) {
        console.error('Error applying timeout:', error);
        await interaction.reply({ content: `❌ An error occurred: ${error.message}`, ephemeral: true });
    }
}

const command = {
    name: 'timeoutuser',
    description: 'Place a user in timeout with an optional reason and log the action.',
    options: [
        {
            name: 'user',
            description: 'The user to place in timeout',
            type: 6, 
            required: true,
        },
        {
            name: 'duration',
            description: 'The duration of the timeout in minutes',
            type: 4, 
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason for the timeout',
            type: 3, 
            required: false,
        },
    ],
    execute,
};

export default command;
