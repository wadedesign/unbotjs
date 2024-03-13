// this is a command that is not implemented yet
// dont see a need for it at the momemnt

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
            .select('reasons')
            .eq('user_id', user.id);

        if (error) throw error;

        if (!data.length || !data[0].reasons || data[0].reasons.length === 0) {
            await interaction.reply({ content: `${user.username} has no karma reasons recorded.`, ephemeral: true });
            return;
        }

        const reasonsCount = data[0].reasons.reduce((acc, reason) => {
            acc[reason] = (acc[reason] || 0) + 1;
            return acc;
        }, {});

        const sortedReasons = Object.entries(reasonsCount).sort((a, b) => b[1] - a[1]);

        let reasonsMessage = sortedReasons.slice(0, 5).map((item, index) => `${index + 1}. ${item[0]} (${item[1]} times)`).join('\n');
        if (reasonsMessage.length === 0) reasonsMessage = "No reasons provided.";

        const embed = new EmbedBuilder()
            .setTitle(`🌟 Top Karma Reasons for ${user.username}`)
            .setDescription(reasonsMessage)
            .setColor(0x00FF00)
            .setFooter({ text: `Requested by ${interaction.user.username} • ${new Date().toISOString()} UTC`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
        console.error('Error fetching top karma reasons:', error);
        await interaction.reply({ content: `❌ An error occurred: ${error.message}`, ephemeral: true });
    }
}

const command = {
    name: 'karmatopreasons',
    description: 'Displays the top reasons why a user was awarded karma points.',
    options: [
        {
            name: 'user',
            description: 'The user to check the top karma reasons for',
            type: 6, // Type 6 corresponds to USER
            required: true,
        },
    ],
    execute,
};

export default command;
