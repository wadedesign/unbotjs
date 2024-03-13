import { createClient } from '@supabase/supabase-js';
import { EmbedBuilder } from 'discord.js';
import { getCustomEmoji } from '../../utils/importEmojis/emojiUtils'; // util func

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function execute(interaction) {

    const arrowOne = getCustomEmoji('arrowone');

  try {
    let { data, error } = await supabase
      .from('karma')
      .select('*')
      .order('karma_points', { ascending: false })
      .limit(15);
    if (error) throw error;

    const topThreeEmbed = new EmbedBuilder()
      .setColor('#FFA500')
      .setTitle(`${arrowOne} Karma Leaderboard: Top 3 Heroes ${arrowOne}`)
      .setDescription('Here are the champions standing at the podium:');
    data.slice(0, 3).forEach((user, index) => {
      const rankEmoji = ['🥇', '🥈', '🥉'][index];
      const username = `<@${user.user_id}>`; // Assuming fetching username was successful
      topThreeEmbed.addFields({ name: `${rankEmoji} Rank ${index + 1}`, value: `${username} - \`${user.karma_points} points\``, inline: true });
    });
    topThreeEmbed.setFooter({ text: '🌟 Shining bright at the top!' }).setTimestamp();

    // 2nd embed
    const restEmbed = new EmbedBuilder()
      .setColor('#FFA500')
      .setTitle('Karma Leaderboard: Honorable Mentions')
      .setDescription('Celebrating the pursuit of excellence:');
    data.slice(3).forEach((user, index) => {
      const rank = index + 4;
      const username = `<@${user.user_id}>`; // Assuming fetching username was successful
      restEmbed.addFields({ name: `Rank ${rank}`, value: `${username} - \`${user.karma_points} points\``, inline: false });
    });
    restEmbed.setFooter({ text: 'Leaderboard updated every 24 hours' }).setTimestamp();
    // we do this way as it can look clutered with 15 folks in one embed
    await interaction.reply({ embeds: [topThreeEmbed] });
    await interaction.followUp({ embeds: [restEmbed] });
  } catch (error) {
    console.error('Error fetching karma leaderboard:', error);
    await interaction.reply({ content: `❌ An error occurred while fetching the karma leaderboard: ${error.message}`, ephemeral: true });
  }
}

const command = {
  name: 'karmaleaderboard',
  description: 'Displays the top 15 users with the most karma, with special emphasis on the top performers.',
  options: [],
  execute,
};

export default command;


// would like to use canvas so if someone is god - tier go ahead and make a PR