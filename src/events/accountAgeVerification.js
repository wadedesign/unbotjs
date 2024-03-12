/**
 * - Written by: Wade5
 * 
 * Please do not remove this header/credit when sharing this code with others.
 */


// src/events/accountAgeVerification.js
//NOTE - havent tested this yet but should work just fine (the user will styill have access to channels with eveyrone has access tag)
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const APPROVAL_CHANNEL_ID = process.env.APPROVAL_CHANNEL_ID;
const APPROVED_ROLE_ID = process.env.APPROVED_ROLE_ID; 

export function setupAccountAgeVerification(client) {
    client.on('guildMemberAdd', async member => {
        if (member.user.bot) return; // ignore those bots

        const accountCreationDate = member.user.createdAt;
        const accountAge = Date.now() - accountCreationDate.getTime();
        const fiveDaysInMilliseconds = 5 * 24 * 60 * 60 * 1000; // 5 days

        if (accountAge < fiveDaysInMilliseconds) {
            // Account is newer than 5 days
            const approvalChannel = await client.channels.fetch(APPROVAL_CHANNEL_ID);
            if (!approvalChannel) return;

            const embed = new EmbedBuilder()
                .setTitle("New Account Verification Needed")
                .setDescription(`A new member, ${member.toString()}, has joined but their account is less than 5 days old.`)
                .addField("Account Age", `${Math.floor(accountAge / (1000 * 60 * 60 * 24))} days old`)
                .setColor(0xFFFF00); // yellow color

            const approveButton = new ButtonBuilder()
                .setCustomId('approve_access')
                .setLabel('Approve')
                .setStyle(ButtonStyle.Success);

            const denyButton = new ButtonBuilder()
                .setCustomId('deny_access')
                .setLabel('Deny')
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder().addComponents(approveButton, denyButton);

            const message = await approvalChannel.send({ embeds: [embed], components: [row] });

            const filter = (interaction) => interaction.user.id !== member.id && (interaction.customId === 'approve_access' || interaction.customId === 'deny_access');
            const collector = message.createMessageComponentCollector({ filter, max: 1, time: 24 * 60 * 60 * 1000 }); // 24 hours to respond

            collector.on('collect', async (interaction) => {
                if (interaction.customId === 'approve_access') {
                    const role = member.guild.roles.cache.get(APPROVED_ROLE_ID);
                    if (role) {
                        await member.roles.add(role).catch(console.error); // Add the approved role to the member
                        await member.send('Your access to the server has been approved. You have been granted a role.');
                    } else {
                        console.log(`Role with ID ${APPROVED_ROLE_ID} not found.`);
                    }
                    await interaction.update({ content: `${member.toString()} has been approved for access and granted the role.`, components: [] });
                } else if (interaction.customId === 'deny_access') {
                    await member.send('Your access to the server has been denied.');
                    await member.kick('Access denied by an administrator.');
                    await interaction.update({ content: `${member.toString()} has been denied access and removed from the server.`, components: [] });
                }
            });
        }
    });
}
