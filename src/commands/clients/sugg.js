import { EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const suggestionChannelId = process.env.SUGGESTION_CHANNEL_ID;
const successColor = '#00FF00';
const errorColor = '#FF0000';

const questions = [
  {
    embed: new EmbedBuilder().setColor('#FFA500').setTitle('Question 1').setDescription('What is your suggestion related to?'),
  },
  {
    embed: new EmbedBuilder().setColor('#FFA500').setTitle('Question 2').setDescription('Why do you think this suggestion would be beneficial?'),
  },
  {
    embed: new EmbedBuilder().setColor('#FFA500').setTitle('Question 3').setDescription('Is there anything else you would like to add to your suggestion?'),
  },
];

async function execute(_interaction_) {
  try {
    await _interaction_.deferReply({ ephemeral: true });
    let userResponses = [];
    let userMessages = [];

    for (let i = 0; i < questions.length; i++) {
      const { embed } = questions[i];

      await _interaction_.followUp({
        embeds: [embed],
        ephemeral: true,
      });

      const filter = (_response_) => _response_.author.id === _interaction_.user.id;
      const collected = await _interaction_.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
      const response = collected.first();
      userResponses.push(response.content);
      userMessages.push(response);
    }

    const suggestion = userResponses.join('\n\n');
    const user = _interaction_.user.tag;
    const userId = _interaction_.user.id;

    const successEmbed = new EmbedBuilder()
      .setTitle('New Suggestion 📝')
      .setDescription(suggestion)
      .setColor(successColor)
      .addFields({ name: 'Suggested by', value: `${user} (\`${userId}\`)` })
      .setTimestamp();

    const channel = await _interaction_.guild.channels.cache.get(suggestionChannelId);

    if (!channel) {
      await _interaction_.editReply({ content: 'Suggestion channel not found. Please contact an admin.', ephemeral: true });
      return;
    }

    await channel.send({ embeds: [successEmbed] });

    // Delete user messages
    await _interaction_.channel.bulkDelete(userMessages);

    const confirmationEmbed = new EmbedBuilder()
      .setTitle('Suggestion Submitted')
      .setDescription('Your suggestion has been submitted successfully!')
      .setColor(successColor);

    await _interaction_.editReply({ embeds: [confirmationEmbed], ephemeral: true });
  } catch (error) {
    console.error(error);
    const errorEmbed = new EmbedBuilder()
      .setTitle('Error')
      .setDescription('An error occurred while processing your suggestion.')
      .setColor(errorColor);
    await _interaction_.editReply({ embeds: [errorEmbed], ephemeral: true });
  }
}

const command = {
  name: 'suggest',
  description: 'Submit a suggestion for the server.',
  execute,
};

export default command;