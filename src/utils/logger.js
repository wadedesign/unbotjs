// logger.js in your events folder or an appropriate location
import client from '../clientInstance'; // Adjust the import path as needed
import dotenv from 'dotenv';
dotenv.config();

const logCommandUsage = async (commandName, user) => {
    const logChannelId = process.env.LOG_CHANNEL_ID;
    if (!logChannelId) {
        console.error('LOG_CHANNEL_ID is not defined in your .env file.');
        return;
    }

    const logChannel = await client.channels.fetch(logChannelId);
    if (!logChannel) {
        console.error(`The channel with ID ${logChannelId} could not be found.`);
        return;
    }

    const message = `Command: /${commandName} was executed by ${user.tag}`;
    await logChannel.send(message);
};

export default logCommandUsage;
