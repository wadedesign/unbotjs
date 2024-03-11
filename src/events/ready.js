// src/events/ready.js
import { ActivityType } from 'discord.js';
import chalk from 'chalk';

export const setupReady = (client) => {
    client.once('ready', () => {
        console.log(chalk.green('Unbot is now ready!'));
        console.log(chalk.blue('Logged in as: ') + chalk.yellow(`${client.user.tag}`));
        console.log(chalk.magenta(`Watching status set to: "${client.user.presence.activities[0]?.name || 'something interesting'}"`));
        client.user.setActivity('uninbox.com', { type: ActivityType.Watching });
    });
};

