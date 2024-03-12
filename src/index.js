// src/index.js
import { config } from 'dotenv';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { setupWelcome } from './events/welcome';
import { setupReady } from './events/ready';
import { startLoading, finishLoading } from './utils/logUtility'; // log for the command loading time
import { setupInteractionCreate } from './events/interactionCreate'; 
import { customizeWebSocket } from './utils/customizeWebSocket'; 
import { setupAccountAgeVerification } from './events/accountAgeVerification';
import { setupPeriodicMessage } from './events/periodicMessage'; // Adjust the path as necessary
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

/// LOADS COMMANDS ON START
const commandsPath = path.join(path.resolve(), 'src', 'commands');
async function loadCommands(directory) {
    const items = fs.readdirSync(directory, { withFileTypes: true });
    for (const item of items) {
        const absolutePath = path.join(directory, item.name);
        if (item.isDirectory()) {
            await loadCommands(absolutePath); 
        } else if (item.isFile() && item.name.endsWith('.js')) {
            import(absolutePath).then(commandModule => {
                const commandName = item.name.replace('.js', '');
                startLoading(commandName);
                client.commands.set(commandModule.default.name, commandModule.default);
                finishLoading(commandModule.default.name);
                console.log(`Loaded command: ${commandModule.default.name}`);
            }).catch(error => {
                console.error(`Error loading command in file ${item.name}:`, error);
            });
        }
    }
}
loadCommands(commandsPath).then(() => {
    console.log('All commands loaded');
}).catch(error => {
    console.error('Error loading commands:', error);
});

setupReady(client); // events/ready.js
setupWelcome(client); // events/welcome.js
setupInteractionCreate(client); // events/interactionCreate.js will cretae diff folder for events
setupAccountAgeVerification(client); // events/captchaVerification.js
setupPeriodicMessage(client); // events/periodicMessage.js

client.login(process.env.DISCORD_TOKEN);
