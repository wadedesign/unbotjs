// src/events/antiSpamMonitoring.js
require('dotenv').config();

const usersMap = new Map();
const messagesMap = new Map(); 
const LIMIT = 5;
const TIME = 7000; 
const COOLDOWN = 2000; 
const TIMEOUT_DURATION = 60 * 1000; 

export function setupAntiSpamMonitoring(client) {
  client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    const { author, guild } = message;
    const timestamp = Date.now();
    const userRecord = usersMap.get(author.id) || { msgCount: 0, lastMessage: 0, messages: [] };

    const timePassed = timestamp - userRecord.lastMessage;
    if (timePassed < COOLDOWN) {
      // Increment message count if the message is sent in quick succession
      userRecord.msgCount += 1;
      userRecord.messages.push(message.id); 

      if (userRecord.msgCount >= LIMIT) {
        // Trigger spam action
        // Delete the user's spam messages
        userRecord.messages.forEach(async (msgId) => {
          try {
            const msg = await message.channel.messages.fetch(msgId);
            await msg.delete();
          } catch (error) {
            console.error(`Failed to delete spam message: ${error}`);
          }
        });

        const warningMsg = `⚠️ **${author.username}**, you have been muted for spamming.`;
        message.channel.send(warningMsg);

        // Apply a 1-minute timeout to the user
        try {
          await message.member.timeout(TIMEOUT_DURATION, "Spamming messages");
        } catch (error) {
          console.error(`Failed to timeout member: ${error}`);
        }

        userRecord.msgCount = 0;
        userRecord.messages = [];
      }
    } else {
      userRecord.msgCount = 1;
      userRecord.lastMessage = timestamp;
      userRecord.messages = [message.id]; // Start tracking new message period
    }

    usersMap.set(author.id, userRecord);

    setTimeout(() => {
      usersMap.delete(author.id);
      messagesMap.delete(author.id); 
    }, TIME);
  });
}
