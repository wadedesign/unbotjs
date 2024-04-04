import { Canvas, loadImage } from '@napi-rs/canvas';
import { AttachmentBuilder } from 'discord.js';
import dotenv from 'dotenv';

import { cropImage } from 'cropify';
dotenv.config();

const WELCOME_CHANNEL_ID = process.env.WELCOME_CHANNEL_ID;
// Function to draw a rounded rectangle
function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}
async function generateWelcomeImage(member) {
    const canvas = new Canvas(700, 250);
    const ctx = canvas.getContext('2d');

    const background = await cropImage({
        imagePath: 'docs/public/backgd.png',
        borderRadius: 100,
        cropCenter: true,
        width: 700,
        height: 250
    });
    ctx.drawImage(await loadImage(background), 0, 0, canvas.width, canvas.height);

    const avatarX = 50;
    const avatarY = canvas.height / 2 - 64;
    const avatarSize = 128;

    const avatar = await loadImage(member.user.displayAvatarURL({ format: 'jpg', size: 128 }));
    ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);

    ctx.fillStyle = '#00FF9E';
    ctx.font = '30px "PlusJakartaSans Extrabold"';
    ctx.fillText(`Welcome, ${member.displayName}!`, 190, 100);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px "PlusJakartaSans Light"';
    ctx.fillText(`Member #${member.guild.memberCount}`, 190, 130);

    const progressBarHeight = 20;
    const radius = progressBarHeight / 2;
    ctx.fillStyle = '#555';
    drawRoundedRect(ctx, 190, 160, 500, progressBarHeight, radius);
    ctx.fill();

    const progressWidth = (member.guild.memberCount / 1000) * 500;
    ctx.fillStyle = '#00FF9E'; 
    const adjustedWidth = Math.max(progressWidth, progressBarHeight);
    drawRoundedRect(ctx, 190, 160, adjustedWidth, progressBarHeight, radius);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '15px "PlusJakartaSans Light"';
    ctx.fillText(`${member.guild.memberCount} / 1000`, 340, 175); 


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



