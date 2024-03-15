// src/commands/admin/banuser.js
import { EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
import { handleError } from '../../utils/errorHandle/errorHandler'; // Adjust the import path as needed

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
        await interaction.guild.members.ban(user, { reason });

        const embed = new EmbedBuilder()
            .setTitle('🚫 User Banned')
            .setDescription(`User ${user.username} has been banned.`)
            .setColor(0xFF0000) // red
            .addFields(
                { name: 'User', value: user.tag, inline: true },
                { name: 'Reason', value: reason, inline: true }
            )
            .setFooter({ text: `Banned by ${interaction.user.username} • ${new Date().toISOString()} UTC`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });

        const logChannel = await interaction.guild.channels.fetch(logChannelId);
        if(logChannel) {
            await logChannel.send({ embeds: [embed] });
        } else {
            console.error('Log channel not found');
        }
    } catch (error) {
        console.error('Error banning user:', error);
        await handleError(error, interaction); // func errorhandler
    }
}

const command = {
    name: 'banuser',
    description: 'ban someone from the server with a reason option',
    options: [
        {
            name: 'user',
            description: 'The user to ban',
            type: 6, 
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason for banning the user',
            type: 3, 
            required: false,
        },
    ],
    execute,
};

export default command;
