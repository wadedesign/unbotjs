// src/commands/karmaleaderboard.js
import { EmbedBuilder } from 'discord.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function execute(interaction) {
    try {
        let { data, error } = await supabase
            .from('karma')
            .select('*')
            .order('karma_points', { ascending: false })
            .limit(15);

        if (error) throw error;

        const leaderboard = data
            .map((user, index) => `${index + 1}. <@${user.user_id}> with ${user.karma_points} points`)
            .join('\n');

        const embed = new EmbedBuilder()
            .setTitle(`🌟 Karma Leaderboard`)
            .setDescription(leaderboard)
            .setColor(0x00FF00) 
            .setFooter({ text: 'Karma rankings are based on the total points each user has accumulated.' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error('Error fetching karma leaderboard:', error);
        await interaction.reply({ content: `❌ An error occurred while fetching the karma leaderboard: ${error.message}`, ephemeral: true });
    }
}

const command = {
    name: 'karmaleaderboard',
    description: 'Displays the top 15 users with the most karma.',
    options: [],
    execute,
};

export default command;


// still good with db change