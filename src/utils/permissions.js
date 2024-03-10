import dotenv from 'dotenv';
dotenv.config();

async function hasPermission(interaction) {
  const allowedUserIds = process.env.UNBOT_SPECI.split(','); 
  const userId = interaction.user.id;

  if (!allowedUserIds.includes(userId)) {
    await interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
    return false; 
  }

  return true; 
}

export { hasPermission };
