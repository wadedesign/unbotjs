import { EmbedBuilder } from 'discord.js';

async function execute(interaction) {
  try {
    await interaction.reply({ content: 'Please provide the ID of the first message, the ID of the last message, and the desired name for the thread, separated by spaces.', ephemeral: true });

    const filter = (m) => m.author.id === interaction.user.id;
    const response = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000 }).then(collected => collected.first());

    if (!response) {
      return interaction.followUp({ content: 'No response received. Operation cancelled.', ephemeral: true });
    }

    const [startMessageId, endMessageId, threadName] = response.content.split(' ');

    const messages = await interaction.channel.messages.fetch({ after: startMessageId, before: endMessageId }).catch(console.error);
    console.log(`Fetched ${messages.size} messages between start and end IDs.`);

    let thread = await interaction.channel.threads.create({
      name: threadName || `Thread - ${new Date().toLocaleString()}`, 
      autoArchiveDuration: 60,
      reason: 'Created a new thread for a range of messages.',
    }).catch(console.error);

    for (const message of messages.values()) {
      const author = message.author;
      const embed = new EmbedBuilder();

      if (message.content.trim().length > 0) {
        embed.setDescription(message.content);
      }

      embed.setAuthor({ name: author.username, iconURL: author.displayAvatarURL() })
        .setColor('#00ff00'); 

      if (message.embeds.length > 0) {
        embed.addFields({ name: 'Embeds', value: 'This message contains embeds.' });
      }

      if (message.attachments.size > 0) {
        embed.setImage(message.attachments.first().url);
      }

      await thread.send({ embeds: [embed] }).catch(console.error);
    }

    await interaction.followUp({ content: `Thread created successfully! Check out the new thread: ${thread.name}`, ephemeral: true });
  } catch (error) {
    console.error('Error creating thread from messages:', error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: `❌ An error occurred while creating the thread: ${error.message}`, ephemeral: true }).catch(console.error);
    } else {
      await interaction.reply({ content: `❌ An error occurred while creating the thread: ${error.message}`, ephemeral: true }).catch(console.error);
    }
  }
}

const command = {
  name: 'createthread',
  description: 'Create a thread from a range of messages by providing the first and last message IDs and the desired thread name.',
  options: [],
  execute,
};

export default command;