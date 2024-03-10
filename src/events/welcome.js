import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const WELCOME_CHANNEL_ID = process.env.WELCOME_CHANNEL_ID;
const EMOJI_WELCOME = process.env.EMOJI_WELCOME || '👋'; 
const EMOJI_WAVE = process.env.EMOJI_WAVE || '🌊';

const TWITTER_URL = 'https://twitter.com/yourcommunity';
const FACEBOOK_URL = 'https://facebook.com/yourcommunity';
const INSTAGRAM_URL = 'https://instagram.com/yourcommunity';

export function setupWelcome(client) {
    client.on('guildMemberAdd', async member => {
        const welcomeChannel = await client.channels.fetch(WELCOME_CHANNEL_ID);
        if (!welcomeChannel) return console.error('Welcome channel not found.');

        const memberCount = member.guild.memberCount;
        const welcomeMessage = `${EMOJI_WELCOME} Welcome ${member.displayName} to **${member.guild.name}**! You are member #${memberCount}. Feel free to introduce yourself in the channels below. ${EMOJI_WAVE}`;

        const welcomeEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Welcome to ${member.guild.name}!`)
            .setDescription(welcomeMessage)
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                { name: 'Get Started', value: 'Check out our rules and introduce yourself!' },
                { name: 'Stay Connected', value: 'Join our discussions and participate in events.' }
            )
            .setFooter({ text: 'We are happy to have you with us. Enjoy your stay!' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Twitter')
                    .setStyle(ButtonStyle.Link)
                    .setURL(TWITTER_URL),
                new ButtonBuilder()
                    .setLabel('Facebook')
                    .setStyle(ButtonStyle.Link)
                    .setURL(FACEBOOK_URL),
                new ButtonBuilder()
                    .setLabel('Instagram')
                    .setStyle(ButtonStyle.Link)
                    .setURL(INSTAGRAM_URL),
            );

        welcomeChannel.send({ embeds: [welcomeEmbed], components: [row] });
    });
}


//TODO - wanted to use canvas to create a welcome image but bun doesnt support canvas :()