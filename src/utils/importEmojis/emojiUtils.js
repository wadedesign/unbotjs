// src/utils/emojiUtils.js
import dotenv from 'dotenv';
dotenv.config();

/**
 * Fetches a custom emoji string from environment variables by name.
 * @param {string} name - The name of the emoji to fetch.
 * @returns {string} The emoji string if found, otherwise an empty string.
 */

export function getCustomEmoji(name) {
    const emoji = process.env[`${name.toUpperCase()}_EMOJI`];
    return emoji || '';
}
