import { EmbedBuilder } from 'discord.js';

async function createThreadFromMessages(interaction) {
  try {
    await interaction.reply({ content: 'Please provide the ID of the first message, the ID of the last message, and the desired name for the thread, separated by spaces.', ephemeral: true });

    const filter = m => m.author.id === interaction.user.id;
    const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
    const setupResponse = collected.first();

    if (!setupResponse) {
      return await interaction.followUp({ content: 'No response received. Operation cancelled.', ephemeral: true });
    }

    const [startMessageId, endMessageId, threadName] = setupResponse.content.split(' ');

    const messages = await interaction.channel.messages.fetch({ after: startMessageId, before: endMessageId });

    const relevantMessages = messages.filter(msg => msg.id !== setupResponse.id);

    if (relevantMessages.size === 0) {
      return await interaction.followUp({ content: 'No messages found in the specified range.', ephemeral: true });
    }

    console.log(`Fetched ${relevantMessages.size} messages between start and end IDs.`);

    const thread = await interaction.channel.threads.create({
      name: threadName || `Thread - ${new Date().toLocaleString()}`,
      autoArchiveDuration: 60,
      reason: 'Created a new thread for a range of messages.',
    });

    for (const message of relevantMessages.values()) {
      await sendEmbedInThread(message, thread);
    }

    await interaction.followUp({ content: `Thread created successfully! Check out the new thread: ${thread.name}`, ephemeral: true });
  } catch (error) {
    console.error('Error creating thread from messages:', error);
    await interaction.followUp({ content: `❌ An error occurred while creating the thread: ${error.message}`, ephemeral: true });
  }
}

async function sendEmbedInThread(message, thread) {
  const embed = new EmbedBuilder()
    .setColor('#00ff00')
    .setAuthor({ name: `Message by: ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
    .addFields(
      { name: 'Content', value: `\`\`\`${message.content.substring(0, 1014)}\`\`\``, inline: false }
    );

  if (message.attachments.size > 0) {
    embed.addFields(
      { name: 'Attachments', value: `This message contains ${message.attachments.size} attachments.`, inline: true }
    )
    .setImage(message.attachments.first().url); // Show the first attachment if it's an image
  }
  embed.setFooter({ text: `Sent: ${message.createdAt.toUTCString()}` });
  await thread.send({ embeds: [embed] });
}

const command = {
  name: 'createthread',
  description: 'Create a thread from a range of messages by providing the first and last message IDs and the desired thread name.',
  execute: createThreadFromMessages,
};

export default command;
