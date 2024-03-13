import { EmbedBuilder } from 'discord.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (amount <= 0) {
        await interaction.reply({ content: '❌ Amount must be greater than 0.', ephemeral: true });
        return;
    }

    try {
        let { data, error } = await supabase
            .from('karma')
            .select('*')
            .eq('user_id', user.id);

        if (error) throw error;

        let current_points = 0;

        if (data.length > 0) {
            current_points = data[0].karma_points;
        }

        const { error: karmaUpdateError } = await supabase
            .from('karma')
            .upsert({
                user_id: user.id,
                karma_points: current_points + amount,
            });

        if (karmaUpdateError) throw karmaUpdateError;

        const { error: transactionError } = await supabase
            .from('karma_transactions')
            .insert([{
                user_id: user.id,
                karma_points_change: amount,
                reason: reason,
                transaction_date: new Date().toISOString(), 
            }]);

        if (transactionError) throw transactionError;

        const embed = new EmbedBuilder()
            .setTitle('🌟 Karma Update')
            .setDescription(`🎉 Karma has been bestowed upon ${user.username}!`)
            .setColor(amount >= 100 ? 0xFFD700 : 0x00FF00)
            .addFields(
                { name: '🎁 Karma Gifted', value: `+${amount} points`, inline: true },
                { name: '📊 New Total', value: `${current_points + amount} points`, inline: true },
                { name: '📝 Reason', value: reason, inline: false }
            )
            .setFooter({ text: `Granted by ${interaction.user.username} • ${new Date().toISOString()} UTC`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error('Error updating karma:', error);
        await interaction.reply({ content: `❌ An error occurred: ${error.message}`, ephemeral: true });
    }
}

const command = {
    name: 'givekarma',
    description: 'Give karma points to a user with an optional reason.',
    options: [
        {
            name: 'user',
            description: 'The user to give karma to',
            type: 6, 
            required: true,
        },
        {
            name: 'amount',
            description: 'The amount of karma points to give',
            type: 4, 
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason for giving karma',
            type: 3, 
            required: false,
        },
    ],
    execute,
};

export default command;
