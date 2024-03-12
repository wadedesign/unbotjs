// src/index.js
import { config } from 'dotenv';
import { Client, GatewayIntentBits, Collection, DefaultWebSocketManagerOptions } from 'discord.js';
import { setupWelcome } from './events/welcome';
import { setupReady } from './events/ready';
import { startLoading, finishLoading } from './utils/logUtility'; // log for the command loading time
import { setupInteractionCreate } from './events/interactionCreate'; 
import { customizeWebSocket } from './utils/customizeWebSocket'; 
import fs from 'fs';
import path from 'path';
config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, 
    ],
});

customizeWebSocket(); // utils/customizeWebSocket.js

client.commands = new Collection();

const commandsPath = path.join(path.resolve(), 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const commandName = file.replace('.js', ''); 
    startLoading(commandName);
    import(path.join(commandsPath, file)).then(commandModule => {
        client.commands.set(commandModule.default.name, commandModule.default);
        finishLoading(commandModule.default.name);
    });
}

setupReady(client); // events/ready.js
setupWelcome(client); // events/welcome.js
setupInteractionCreate(client); // events/interactionCreate.js will cretae diff folder for events

client.login(process.env.DISCORD_TOKEN);
