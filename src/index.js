// src/index.js
import { config } from 'dotenv';
import { Client, GatewayIntentBits, Collection, DefaultWebSocketManagerOptions } from 'discord.js';
import { setupWelcome } from './events/welcome';
import fs from 'fs';
import path from 'path';

config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, // Make sure to request this intent
    ],
});
DefaultWebSocketManagerOptions.identifyProperties.browser = 'Discord iOS'; 


client.commands = new Collection();

const commandsPath = path.join(path.resolve(), 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    import(path.join(commandsPath, file)).then(commandModule => {
        client.commands.set(commandModule.default.name, commandModule.default);
        console.log(`Loading command: ${commandModule.default.name}`); // remove this in PROD
    });
}


client.once('ready', () => { // make this better later
  console.log('Ready!');
});

setupWelcome(client);

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);
