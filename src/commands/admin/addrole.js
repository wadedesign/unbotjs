import { EmbedBuilder, ActionRowBuilder, RoleSelectMenuBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const moderatorIds = process.env.MODERATOR_IDS.split(',');
const logChannelId = process.env.LOG_CHANNEL_ID;

async function execute(interaction) {
  if (!moderatorIds.includes(interaction.user.id)) {
    await interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
    return;
  }

  try {

    const selectMenu = new RoleSelectMenuBuilder()
      .setCustomId('selectRole')
      .setPlaceholder('Select a role')
      .setDefaultRoles(); 

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({ components: [row] });

    const filter = i => i.customId === 'selectRole' && i.user.id === interaction.user.id;
    const collectedInteraction = await interaction.channel.awaitMessageComponent({ filter, time: 60000 });

    if (!collectedInteraction) {
      await interaction.editReply({ content: '❌ Time ran out, please try again.', components: [] });
      return;
    }

    const selectedRoleId = collectedInteraction.values[0];
    const role = interaction.guild.roles.cache.get(selectedRoleId);
    const member = await interaction.guild.members.fetch(interaction.options.getUser('user').id);

    await member.roles.add(role);

    const embed = new EmbedBuilder()
      .setTitle('✅ Role Added')
      .setDescription(`The role ${role.name} has been added to ${member.user.username}.`)
      .setColor(0x00FF00)
      .addFields(
        { name: 'User', value: member.user.tag, inline: true },
        { name: 'Role', value: role.name, inline: true }
      )
      .setFooter({ text: `Role added by ${interaction.user.username} • ${new Date().toISOString()} UTC`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed], components: [] });

    const logChannel = await interaction.guild.channels.fetch(logChannelId);
    if (logChannel) {
      await logChannel.send({ embeds: [embed] });
    } else {
      console.error('Log channel not found');
    }
  } catch (error) {
    console.error('Error adding role:', error);
    await interaction.reply({ content: `❌ An error occurred: ${error.message}`, ephemeral: true });
  }
}

const command = {
  name: 'addrole',
  description: 'Add a role to a user.',
  options: [
    {
      name: 'user',
      description: 'The user to add the role to',
      type: 6, 
      required: true,
    },
  ],
  execute,
};

export default command;
