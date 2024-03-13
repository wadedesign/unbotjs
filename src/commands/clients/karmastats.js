import { EmbedBuilder } from 'discord.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function execute(interaction) {
    try {
        let { data: karmaData, error } = await supabase
            .from('karma')
            .select('*');

        if (error) throw error;

        if (!karmaData.length) {
            await interaction.reply({ content: 'No karma data available.', ephemeral: true });
            return;
        }

        let totalKarma = 0;
        let highestKarma = { points: 0, user_id: '' };
        karmaData.forEach(karmaEntry => {
            totalKarma += karmaEntry.karma_points;
            if (karmaEntry.karma_points > highestKarma.points) {
                highestKarma = { points: karmaEntry.karma_points, user_id: karmaEntry.user_id };
            }
        });

        const averageKarma = totalKarma / karmaData.length;

        const user = await interaction.client.users.fetch(highestKarma.user_id).catch(console.error);

        const embed = new EmbedBuilder()
            .setTitle('🌟 Karma Statistics')
            .setColor(0x00FF00)
            .addFields(
                { name: 'Total Karma Awarded', value: `${totalKarma} points`, inline: true },
                { name: 'Average Karma per User', value: `${averageKarma.toFixed(2)} points`, inline: true },
                { name: 'Highest Karma User', value: `${user ? user.username : 'User not found'} (${highestKarma.points} points)`, inline: false }
            )
            .setFooter({ text: `Stats requested by ${interaction.user.username} • ${new Date().toISOString()} UTC`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error('Error fetching karma statistics:', error);
        await interaction.reply({ content: `❌ An error occurred: ${error.message}`, ephemeral: true });
    }
}

const command = {
    name: 'karmastats',
    description: 'Displays statistics about the karma points awarded within the community.',
    execute,
};

export default command;
