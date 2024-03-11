import { Canvas, loadImage } from '@napi-rs/canvas';
import { AttachmentBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const WELCOME_CHANNEL_ID = process.env.WELCOME_CHANNEL_ID;

async function generateWelcomeImage(member) {
    const canvas = new Canvas(700, 250);
    const ctx = canvas.getContext('2d');

    const background = await loadImage('docs/public/backgd.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    const avatarX = 50; 
    const avatarY = canvas.height / 2 - 64; 
    const avatarSize = 128;

    ctx.save(); 
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await loadImage(member.user.displayAvatarURL({ format: 'jpg', size: 128 }));
    ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);

    ctx.restore(); 

    ctx.font = '30px Arial';
    ctx.fillStyle = '#FFFFFF'; 
    ctx.fillText(`Welcome, ${member.displayName}!`, 190, 100); 

    ctx.font = '20px Arial';
    ctx.fillText(`Member #${member.guild.memberCount}`, 190, 130); 

    const buffer = canvas.toBuffer('image/png');
    const attachment = new AttachmentBuilder(buffer, { name: 'welcome-image.png' });

    return attachment;
}

export function setupWelcome(client) {
    client.on('guildMemberAdd', async member => {
        const welcomeChannel = await client.channels.fetch(WELCOME_CHANNEL_ID);
        if (!welcomeChannel) {
            console.error('Welcome channel not found.');
            return;
        }

        const welcomeImage = await generateWelcomeImage(member);
        await welcomeChannel.send({ files: [welcomeImage] });
    });
}



//TODO - make the alignment of the text dynamic based on the length of the member's name
//TODO - add a border to the avatar
//TODO - add footer (signature)