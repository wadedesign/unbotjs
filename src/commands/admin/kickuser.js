// src/commands/admin/kickuser.js
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
        // Kick the user instead of banning
        const member = await interaction.guild.members.fetch(user.id);
        await member.kick(reason);

        const embed = new EmbedBuilder()
            .setTitle('👟 User Kicked')
            .setDescription(`User ${user.username} has been kicked.`)
            .setColor(0xFFA500) // Using orange color for kick indication
            .addFields(
                { name: 'User', value: user.tag, inline: true },
                { name: 'Reason', value: reason, inline: true }
            )
            .setFooter({ text: `Kicked by ${interaction.user.username} • ${new Date().toISOString()} UTC`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });

        const logChannel = await interaction.guild.channels.fetch(logChannelId);
        if(logChannel) {
            await logChannel.send({ embeds: [embed] });
        } else {
            console.error('Log channel not found');
        }
    } catch (error) {
        console.error('Error kicking user:', error);
        await interaction.reply({ content: `❌ An error occurred: ${error.message}`, ephemeral: true });
    }
}

const command = {
    name: 'kickuser',
    description: 'Kick a user from the server with an optional reason.',
    options: [
        {
            name: 'user',
            description: 'The user to kick',
            type: 6, 
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason for kicking the user',
            type: 3, 
            required: false,
        },
    ],
    execute,
};

export default command;
