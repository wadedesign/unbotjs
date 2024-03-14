// src/clientInstance.js
import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
config(); 

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
    ],
});

export default client;
