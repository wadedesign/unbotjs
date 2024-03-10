// scripts/registerCommands.js
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config();

const commandsPath = path.join(process.cwd(), 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = [];
let loadedCommands = 0;

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    import(filePath).then(commandModule => {
        commands.push(commandModule.default);
        loadedCommands++;
        console.log(`✔️ Loaded command: ${file} [${loadedCommands}/${commandFiles.length}]`);

        // Once all commands are loaded, register them with Discord
        if (commands.length === commandFiles.length) {
            const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

            (async () => {
                try {
                    console.log('\n🔄 Starting to refresh application (/) commands...');

                    await rest.put(
                        Routes.applicationCommands(process.env.CLIENT_ID),
                        { body: commands },
                    );

                    console.log('✅ Successfully reloaded application (/) commands.');
                } catch (error) {
                    console.error('❌ Error reloading application (/) commands:', error);
                }
            })();
        }
    }).catch(error => {
        console.error(`❌ Error loading command ${file}:`, error);
    });
}
