import fs from 'fs';
import path from 'path';

const logFilePath = path.join('src', 'logs', 'errorLog.json');

export function getErrorLog() {
  try {
    const logData = fs.readFileSync(logFilePath, 'utf8');
    return JSON.parse(logData);
  } catch (err) {
    console.error('Error reading error log:', err);
    return [];
  }
}

export function getErrorLogEntry(id) {
  const errorLog = getErrorLog();
  return errorLog.find((entry) => entry.id === id);
}