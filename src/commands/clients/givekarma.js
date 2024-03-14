import { EmbedBuilder } from 'discord.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function execute(interaction) {
    const giver = interaction.user; // The Discord user giving karma
    const recipient = interaction.options.getUser('user'); // The recipient of the karma
    const amount = interaction.options.getInteger('amount');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (amount <= 0) {
        await interaction.reply({ content: '❌ Amount must be greater than 0.', ephemeral: true });
        return;
    }

    try {
        // Date range for today's transactions
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Check giver's transactions for today
        let { data: transactionsToday, error: transactionsTodayError } = await supabase
            .from('karma_transactions')
            .select('karma_points_change')
            .eq('giver_id', giver.id)
            .gte('transaction_date', todayStart.toISOString())
            .lte('transaction_date', todayEnd.toISOString());

        if (transactionsTodayError) throw transactionsTodayError;

        const timesGivenToday = transactionsToday.length;
        const totalKarmaGivenToday = transactionsToday.reduce((acc, transaction) => acc + transaction.karma_points_change, 0);

        if (timesGivenToday >= 2 || totalKarmaGivenToday + amount > 100) {
            await interaction.reply({ content: '❌ You can only give up to 100 karma points twice a day.', ephemeral: true });
            return;
        }

        // Proceed with updating the recipient's karma
        let { data, error } = await supabase
            .from('karma')
            .select('*')
            .eq('user_id', recipient.id);

        if (error) throw error;

        let current_points = 0;
        if (data.length > 0) {
            current_points = data[0].karma_points;
        }

        const { error: karmaUpdateError } = await supabase
            .from('karma')
            .upsert({
                user_id: recipient.id,
                karma_points: current_points + amount,
            });

        if (karmaUpdateError) throw karmaUpdateError;

        // Insert transaction for giver
        const { error: transactionError } = await supabase
            .from('karma_transactions')
            .insert([{
                user_id: recipient.id,
                giver_id: giver.id,
                karma_points_change: amount,
                reason: reason,
                transaction_date: new Date().toISOString(), 
            }]);

        if (transactionError) throw transactionError;

        // Reply with success message
        const embed = new EmbedBuilder()
            .setTitle('🌟 Karma Update')
            .setDescription(`🎉 Karma has been bestowed upon ${recipient.username}!`)
            .setColor(amount >= 100 ? 0xFFD700 : 0x00FF00)
            .addFields(
                { name: '🎁 Karma Gifted', value: `+${amount} points`, inline: true },
                { name: '📊 New Total', value: `${current_points + amount} points`, inline: true },
                { name: '📝 Reason', value: reason, inline: false }
            )
            .setFooter({ text: `Granted by ${giver.username} • ${new Date().toISOString()} UTC`, iconURL: giver.displayAvatarURL() })
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
