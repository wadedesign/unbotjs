// src/events/antiRaidProtection.js
require('dotenv').config();

const joinLog = new Map();

// Settings
const threshold = 7; // Number of joins to consider it a potential raid
const timeFrame = 60000; // Time frame in milliseconds to watch for rapid joins
const timeoutDuration = 10 * 60 * 1000; // 10 minutes in milliseconds

export function setupAntiRaidProtection(client) {
    client.on('guildMemberAdd', async member => {
        const currentTime = Date.now();
        const joins = joinLog.get(member.guild.id) || [];
        joins.push(currentTime);
        joinLog.set(member.guild.id, joins.filter(joinTime => currentTime - joinTime <= timeFrame));

        if (joins.length >= threshold) {
            console.warn(`Raid detected in ${member.guild.name}.`);

            const logChannelId = process.env.LOG_CHANNEL_ID;
            const logChannel = await client.channels.fetch(logChannelId);
            if (logChannel) {
                logChannel.send('🚨 Potential raid detected. Applying temporary timeouts to recent joins.');
            }

            const adminIds = process.env.MODERATOR_IDS.split(',');
            for (const adminId of adminIds) {
                try {
                    const adminUser = await client.users.fetch(adminId.trim());
                    adminUser.send(`🚨 Alert: Potential raid detected in ${member.guild.name}. Please check the server.`);
                } catch (error) {
                    console.error(`Failed to send DM to admin ${adminId}:`, error);
                }
            }

            for (const joinTime of joins) {
                if (currentTime - joinTime <= timeFrame) {
                    try {
                        await member.timeout(timeoutDuration, 'Automatic timeout due to raid detection');
                    } catch (error) {
                        console.error(`Failed to timeout member ${member.user.tag}:`, error);
                        if (logChannel) {
                            logChannel.send(`Failed to apply timeout to ${member.user.tag}.`);
                        }
                    }
                }
            }

            joinLog.set(member.guild.id, []);
        }
    });
}


/**
 *  - built by wade5
 * Anti-Raid Protection Event Handler for Discord.js Bots
 * 
 * This module is designed to monitor and mitigate potential raid activities on a Discord server. 
 * It tracks the rate of new member joins within a specified time frame and applies temporary 
 * timeouts to all new members if the threshold is exceeded, indicating a possible raid.
 * 
 * Configuration Settings:
 * - `threshold`: The number of new members joining within the `timeFrame` considered to be a potential raid (Default: 7 members).
 * - `timeFrame`: The duration in milliseconds to monitor for rapid joins (Default: 60000ms or 1 minute).
 * - `timeoutDuration`: The duration in milliseconds for which new members will be timed out if a raid is detected (Default: 600000ms or 10 minutes).
 * 
 * Environment Variables:
 * - `LOG_CHANNEL_ID`: The ID of the Discord channel where notifications about potential raids will be sent.
 * - `MODERATOR_IDS`: A comma-separated list of user IDs for moderators who will receive direct message alerts in case of a raid.
 * 
 * This script requires the `discord.js` library and is intended to be used with a Discord bot that has appropriate permissions
 * to monitor guild member additions and apply member timeouts.
 * 
 * Ensure your bot has the `GUILD_MEMBERS` intent enabled and possesses the 'Moderate Members' permission on the server.
 */