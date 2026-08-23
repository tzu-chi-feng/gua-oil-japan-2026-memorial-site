import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'imagen-4.0-generate-001';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

async function generateOne(name, prompt) {
  console.log(`➡️ 正在單獨生成: ${name}...`);
  const payload = { instances: [{ prompt }], parameters: { sampleCount: 1 } };
  try {
    const response = await axios.post(ENDPOINT, payload);
    if (response.data.predictions && response.data.predictions.length > 0) {
      const base64Image = response.data.predictions[0].bytesBase64Encoded;
      const buffer = Buffer.from(base64Image, 'base64');
      fs.writeFileSync(`public/decorations/${name}.png`, buffer);
      console.log(`✅ 成功儲存: ${name}.png`);
      return true;
    }
  } catch (error) {
    console.error(`❌ 生成失敗:`, error.response?.data?.error?.message || error.message);
    return false;
  }
}

async function run() {
  // 先跑一款
  await generateOne('tape_short_stripes', 'A small rectangular piece of semi-transparent washi tape, blue watercolor stripes pattern, roughly hand-torn edges on both ends, pure white background.');
}

run();
