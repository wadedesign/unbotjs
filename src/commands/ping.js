// src/commands/ping.js

async function execute(interaction) {
    await interaction.reply('Pong!');
}

const command = {
    name: 'ping',
    description: 'Replies with Pong!',
    options: [], 
    execute, 
};

export default command;
