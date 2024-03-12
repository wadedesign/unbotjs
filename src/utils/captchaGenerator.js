// src/utils/captchaGenerator.js

//REVIEW - so this is not being used as of now but it is a good example of how to use sharp and svg-captcha

import svgCaptcha from 'svg-captcha';
import sharp from 'sharp';

export async function generateCaptcha() {
    const captcha = svgCaptcha.create({
        size: 6, 
        noise: 2, 
        color: true, 
        background: '#cc9966'
    });

    // Convert SVG captcha to PNG using sharp
    const buffer = await sharp(Buffer.from(captcha.data))
        .png()
        .toBuffer();

    return {
        text: captcha.text,
        buffer 
    };
}
