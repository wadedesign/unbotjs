// src/utils/customizeWebSocket.js
import { DefaultWebSocketManagerOptions } from 'discord.js';

export function customizeWebSocket() {
    DefaultWebSocketManagerOptions.identifyProperties.browser = 'Discord iOS';
}
