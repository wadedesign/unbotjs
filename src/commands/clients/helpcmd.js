import commandsList from '../../utils/helpCmds/cmds.json';
import { getCustomEmoji } from '../../utils/importEmojis/emojiUtils'; // util func
import { EmbedBuilder } from 'discord.js';

async function execute(interaction) {
    // Using custom emoji function
    const arrowOne = getCustomEmoji('arrowone');
    const arrowTwo = getCustomEmoji('arrowtwo');
    const arrowThree = getCustomEmoji('arrowthree');
    const arrowFour = getCustomEmoji('arrowfour');
    
    const embed = new EmbedBuilder()
    .setTitle(`${arrowOne} Help - Available Commands`)
    .setColor(0x9a32cd) 
    .setDescription('Here are the commands you can use:');

    commandsList.forEach(command => {
        const formattedExample = "```yaml\n" + command.example + "\n```";

        embed.addFields({ 
            name: `${arrowTwo} /${command.name}`, 
            value: `${arrowThree} ${command.description}\n**Example${arrowFour}**\n${formattedExample}`, 
            inline: false 
        });
    });

    await interaction.reply({
        embeds: [embed],
    });
}

const command = {
    name: 'helpme',
    description: 'Displays a list of available commands.',
    execute,
};

export default command;
