import { EmbedBuilder } from 'discord.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function execute(interaction) {
    const user = interaction.options.getUser('user');

    try {
        let { data, error } = await supabase
            .from('karma')
            .select('*')
            .eq('user_id', user.id);

        if (error) throw error;

        if (data.length === 0) {
            await interaction.reply({ content: `${user.username} has no karma points.`, ephemeral: true });
            return;
        }

        const userData = data[0];
        const embed = new EmbedBuilder()
            .setTitle(`🌟 Karma Status for ${user.username}`)
            .setColor(0x00FF00)
            .addFields(
                { name: '📊 Total Karma Points', value: `${userData.karma_points} points`, inline: false },
                { name: '📝 Reasons', value: userData.reasons.join('\n') || 'No reasons provided', inline: false }
            )
            .setFooter({ text: `Checked by ${interaction.user.username} • ${new Date().toISOString()} UTC`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
        console.error('Error fetching karma:', error);
        await interaction.reply({ content: `❌ An error occurred: ${error.message}`, ephemeral: true });
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
