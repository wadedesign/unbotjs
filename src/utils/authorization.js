// src/utils/authorization.js
import dotenv from 'dotenv';

dotenv.config();

const moderatorIds = process.env.MODERATOR_IDS.split(',');

export function isUserAuthorized(userId) {
  return moderatorIds.includes(userId);
}
