import { EmbedBuilder } from 'discord.js';
import { createClient } from '@supabase/supabase-js';
import { handleError } from '../../utils/errorHandle/errorHandler';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function execute(_interaction_) {
  const user = _interaction_.options.getUser('user');

  try {
    let { data, error } = await supabase
      .from('karma')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    if (data.length === 0) {
      await _interaction_.reply({
        content: `${user.username} has no karma points.`,
        ephemeral: true,
      });
      return;
    }

    const userData = data[0];

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle(`🌟 Karma Status for ${user.username}`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        {
          name: '📊 Total Karma Points',
          value: `\`\`\`yaml\n${userData.karma_points} points\`\`\``,
          inline: true,
        },
        {
          name: '📝 Reasons',
          value: `\`\`\`yaml\n${
            userData.reasons?.join('\n') || 'No reasons provided'
          }\`\`\``,
          inline: true,
        }
      )
      .setFooter({
        text: `Checked by ${_interaction_.user.username} • ${new Date().toISOString()} UTC`,
        iconURL: _interaction_.user.displayAvatarURL(),
      })
      .setTimestamp();

    await _interaction_.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error('Error in checkkarma command:', error);
    await handleError(error, _interaction_);
  }
}

const command = {
  name: 'checkkarma',
  description: 'Check the karma points and reasons for a user.',
  options: [
    {
      name: 'user',
      description: 'The user to check karma for',
      type: 6,
      required: true,
    },
  ],
  execute,
};

export default command;