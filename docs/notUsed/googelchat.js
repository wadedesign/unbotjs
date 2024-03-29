import { EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import logCommandUsage from '../../src/utils/logger';
import { handleError } from '../../src/utils/errorHandle/errorHandler';

dotenv.config();

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = process.env.GOOGLE_AI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function checkUserAsks(userId) {
  const today = new Date().toISOString().slice(0, 10);
  let { data, error, status } = await supabase
    .from('user_daily_asks')
    .select('ask_count')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (error && status !== 406) {
    throw error;
  }

  if (data && data.ask_count >= 5) {
    return false;
  }

  if (data) {
    await supabase
      .from('user_daily_asks')
      .update({ ask_count: data.ask_count + 1 })
      .match({ user_id: userId, date: today });
  } else {
    await supabase
      .from('user_daily_asks')
      .insert([{ user_id: userId, date: today, ask_count: 1 }]);
  }

  return true;
}

async function execute(interaction) {
  await logCommandUsage(command.name, interaction.user);

  const userId = interaction.user.id;
  const isAllowedToAsk = await checkUserAsks(userId);

  if (!isAllowedToAsk) {
    await interaction.reply({
      content: 'You have reached your daily limit of 5 questions. Please try again tomorrow.',
      ephemeral: true
    });
    return;
  }

  const query = interaction.options.getString('askme');
  const serverInfoPath = path.join(__dirname, '..', '..', 'utils', 'chatData', 'server.yaml');
  const serverData = yaml.load(fs.readFileSync(serverInfoPath, 'utf8'));
  await interaction.deferReply({ ephemeral: true });

  try {
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [{
        role: "system",
        content: `You are Elon Musk. Be witty and mean, and keep your responses short while providing information about the Discord server. Here is some information about the server: ${JSON.stringify(serverData, null, 2)}`
      }, {
        role: "user",
        content: query
      }],
    });

    const result = await chat.sendMessage(query);
    const response = result.response.text();

    const embed = new EmbedBuilder()
      .setTitle('AI Response')
      .setDescription(`\`\`\`${response}\`\`\``)
      .setColor(0x00FF00)
      .setFooter({ text: `Response for @${interaction.user.username}` })
      .setTimestamp();

    await interaction.followUp({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error('Error fetching response from Google Generative AI:', error);
    await handleError(error, interaction);
  }
}

const command = {
    name: 'unbot',
    description: 'Have questions answered by an AI.',
    options: [{
      name: 'askme',
      description: 'Your question or statement for the AI.',
      type: 3,
      required: true,
    }],
    execute,
  };
  
  export default command;
  