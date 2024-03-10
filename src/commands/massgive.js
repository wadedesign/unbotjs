// src/commands/massgive.js
//NOTE - if a problem with types go to (docs/types/optiontypes.md) and check the type you need
import { EmbedBuilder, ChannelType } from 'discord.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const successEmoji = process.env.SUCCESS_EMOJI; 
const channelEmoji = process.env.CHANNEL_EMOJI;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const amount = interaction.options.getInteger('amount');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (amount <= 0) {
        await interaction.reply({ content: '❌ Amount must be greater than 0.', ephemeral: true });
        return;
    }

    if (channel.type !== ChannelType.GuildText) {
        await interaction.reply({ content: '❌ Please select a text channel.', ephemeral: true });
        return;
    }

    const members = channel.guild.members.cache.filter(member => !member.user.bot && channel.permissionsFor(member).has("ViewChannel"));

    await interaction.reply({ content: `🔄 Updating karma for members in ${channel.name}...`, ephemeral: true });

    for (const [memberId, member] of members) {
        try {
            let { data, error } = await supabase
                .from('karma')
                .select('*')
                .eq('user_id', memberId)
                .single();

            let current_points = data ? data.karma_points : 0;
            let new_reasons = data && data.reasons ? [...data.reasons, reason] : [reason];

            const { error: upsertError } = await supabase
                .from('karma')
                .upsert({
                    user_id: memberId,
                    karma_points: current_points + amount,
                    reasons: new_reasons
                });

            if (error || upsertError) throw (error || upsertError);

        } catch (error) {
            console.error(`Error updating karma for member ${member.user.username}:`, error);
            // Consider logging failed updates for follow-up
        }
    }

        const embed = new EmbedBuilder()
        .setTitle(`${successEmoji} Karma Update Complete`)
        .setDescription(`Karma points have been successfully updated for all members in ${channelEmoji} ${channel.name}.`)
        .setColor(0x00FF00) // A green color for success messages
        .setFooter({ text: `Karma updates processed.`}) 
        .setTimestamp();

    await interaction.followUp({ embeds: [embed], ephemeral: true });
}

const command = {
    name: 'massgivekarma',
    description: 'Give karma points to all users in a specified channel.',
    options: [
        {
            name: 'channel',
            description: 'The channel whose members will receive karma',
            type: 7,// Updated to use ChannelType enum for specifying channel type
            required: true,
        },
        {
            name: 'amount',
            description: 'The amount of karma points to give',
            type: 4, // Type 4 corresponds to INTEGER
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason for giving karma',
            type: 3, // Type 3 corresponds to STRING
            required: false,
        },
    ],
    execute,
};

export default command;
