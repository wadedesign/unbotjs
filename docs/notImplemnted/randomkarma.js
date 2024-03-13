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
            .select('*');

        if (error) throw error;

        if (data.length === 0) {
            await interaction.reply({ content: 'No karma data available.', ephemeral: true });
            return;
        }

        const randomIndex = Math.floor(Math.random() * data.length);
        const selectedKarma = data[randomIndex];

        const user = await interaction.client.users.fetch(selectedKarma.user_id).catch(console.error);
        if (!user) {
            await interaction.reply({ content: 'User not found.', ephemeral: true });
            return;
        }

        const reason = selectedKarma.reasons && selectedKarma.reasons.length > 0
            ? selectedKarma.reasons[Math.floor(Math.random() * selectedKarma.reasons.length)]
            : 'No reason provided';

        const embed = new EmbedBuilder()
            .setTitle(`🌟 Random Karma Highlight`)
            .setDescription(`${user.username} has been highlighted!`)
            .setColor(0x00FF00)
            .addFields(
                { name: 'Karma Points', value: `${selectedKarma.karma_points} points`, inline: true },
                { name: 'Random Reason', value: reason, inline: false }
            )
            .setFooter({ text: `Highlighted by ${interaction.user.username} • ${new Date().toISOString()} UTC`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error('Error selecting random karma:', error);
        await interaction.reply({ content: `❌ An error occurred: ${error.message}`, ephemeral: true });
    }
}

const command = {
    name: 'randomkarma',
    description: 'Randomly selects a user to showcase their karma points and a reason they were awarded karma.',
    execute,
};

export default command;
