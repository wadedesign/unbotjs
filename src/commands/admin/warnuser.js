// src/commands/admin/warnuser.js
import { EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const moderatorIds = process.env.MODERATOR_IDS.split(',');
const logChannelId = process.env.LOG_CHANNEL_ID;

async function execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!moderatorIds.includes(interaction.user.id)) {
        await interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
        return;
    }

    try {
        try {
            await user.send(`You have been warned for: ${reason}`);
        } catch (error) {
            console.error('Could not send DM to user:', error);
        }

        const embed = new EmbedBuilder()
            .setTitle('⚠️ User Warned')
            .setDescription(`User ${user.username} has been warned.`)
            .setColor(0xFFA500) // Using orange color for warning indication
            .addFields(
                { name: 'User', value: user.tag, inline: true },
                { name: 'Reason', value: reason, inline: true }
            )
            .setFooter({ text: `Warned by ${interaction.user.username} • ${new Date().toISOString()} UTC`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });

        const logChannel = await interaction.guild.channels.fetch(logChannelId);
        if(logChannel) {
            await logChannel.send({ embeds: [embed] });
        } else {
            console.error('Log channel not found');
        }
    } catch (error) {
        console.error('Error warning user:', error);
        await interaction.reply({ content: `❌ An error occurred: ${error.message}`, ephemeral: true });
    }
}

const command = {
    name: 'warnuser',
    description: 'Warn a user with an optional reason and log the action.',
    options: [
        {
            name: 'user',
            description: 'The user to warn',
            type: 6, 
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason for warning the user',
            type: 3, 
            required: false,
        },
    ],
    execute,
};

export default command;
