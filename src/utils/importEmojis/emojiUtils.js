// src/utils/importEmojis/emojiUtils.js
import fs from 'fs';
import path from 'path';


const emojiFilePath = path.join(__dirname, 'emojis.json');
const emojiData = JSON.parse(fs.readFileSync(emojiFilePath, 'utf8'));

/**
 * Fetches a custom emoji string from a JSON file by name.
 * @param {string} name - The name of the emoji to fetch.
 * @returns {string} The emoji string if found, otherwise an empty string.
 */
export function getCustomEmoji(name) {
    return emojiData[name.toLowerCase()] || '';
}
