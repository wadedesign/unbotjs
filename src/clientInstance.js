// src/clientInstance.js
import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
config(); // Ensure dotenv config is called if your environment variables are needed immediately

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
    ],
});

export default client;
