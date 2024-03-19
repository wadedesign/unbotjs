// utils/loadingAnimation.js

/**
 * Displays a standardized loading animation by editing a message repeatedly.
 * @param {Message} message - The initial message object to edit.
 */
async function showLoadingAnimation(message) {
    const loadingFrames = [
        '⠋',
        '⠙',
        '⠹',
        '⠸',
        '⠼',
        '⠴',
        '⠦',
        '⠧',
        '⠇',
        '⠏',
    ];
    const interval = 200; // Interval in milliseconds between each frame

    for (let i = 0; i < loadingFrames.length; i++) {
        await message.edit(`loading${loadingFrames[i]}`);
        await new Promise(resolve => setTimeout(resolve, interval));
    }
}

export default showLoadingAnimation;
