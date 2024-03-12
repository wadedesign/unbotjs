import { TextChannel, EmbedBuilder } from 'discord.js'; 
import { getCustomEmoji } from '../utils/importEmojis/emojiUtils'; // util func
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
dotenv.config();

const CHANNEL_ID = process.env.MESSAGE_CHANNEL_ID;
const messagesPath = path.join(__dirname, '..', 'utils', 'botMessages', 'messages.yml');

function getRandomMessage() {
    const fileContents = fs.readFileSync(messagesPath, 'utf8');
    const data = yaml.load(fileContents);
    const messages = data.messages;
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex]; 
}

export const setupPeriodicMessage = (client) => {
    const sendMessage = async () => {
        const channel = await client.channels.fetch(CHANNEL_ID);
        if (!channel || !(channel instanceof TextChannel)) {
            console.error('The channel specified does not exist or is not a text channel.');
            return;
        }
    
        // Use the utility function to get emojis by name
        const arrowOne = getCustomEmoji('arrowone');
        const arrowTwo = getCustomEmoji('arrowtwo');
    
        const randomMessage = getRandomMessage(); 
        const messageText = `${randomMessage.text}\n\n` +
                            `🔗 Website: ${randomMessage.website}\n` +
                            `📖 Docs: ${randomMessage.docs}\n` +
                            `ℹ️ Info: ${randomMessage.info}`;
    
        const embed = new EmbedBuilder()
            .setDescription(`${arrowTwo} ${messageText}`)
            .setColor(0x3498db)
            .setTitle(`${arrowOne} Hey, look at this!`) 
            .setFooter({ text: `Provided by Unbot` }) 
            .setTimestamp();
    
        await channel.send({
            content: `${arrowTwo} Gental Reminder:`,
            embeds: [embed]
        });
    };
    

    setInterval(sendMessage, 10000); // do for 7 hours = 25200000
};

