// scripts/registerCommands.js
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config();

const commands = [];
const commandsPath = path.join(process.cwd(), 'src', 'commands');

function readCommands(directory) {
    const files = fs.readdirSync(directory, { withFileTypes: true });

    for (const file of files) {
        const absolute = path.join(directory, file.name);
        if (file.isDirectory()) {
            readCommands(absolute);
        } else if (file.name.endsWith('.js')) {
            import(absolute).then(commandModule => {
                commands.push(commandModule.default);

                // Adjusted logging to include nested folder path
                const relativePath = path.relative(commandsPath, directory);
                console.log(`✔️ Loaded command: ${relativePath ? `${relativePath}/` : ''}${file.name} [${commands.length}/${commandsToLoad}]`);

                if (commands.length === commandsToLoad) {
                    registerCommands();
                }
            }).catch(error => {
                console.error(`❌ Error loading command ${file.name}:`, error);
            });
        }
    }
}

let commandsToLoad = 0;

function countCommandFiles(directory) {
    const files = fs.readdirSync(directory, { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) {
            countCommandFiles(path.join(directory, file.name));
        } else if (file.name.endsWith('.js')) {
            commandsToLoad++;
        }
    }
}

function registerCommands() {
    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
    (async () => {
        try {
            console.log('\n🔄 Starting to refresh application (/) commands...');
            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
            console.log('✅ Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error('❌ Error reloading application (/) commands:', error);
        }
    })();
}

// Count commands before reading them to ensure accurate progress logging
countCommandFiles(commandsPath);
readCommands(commandsPath);

