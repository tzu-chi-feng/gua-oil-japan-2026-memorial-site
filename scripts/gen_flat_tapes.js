import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'imagen-4.0-generate-001';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

const items = [
  { name: 'tape_flat_fuji', prompt: 'A short, flat rectangular fragment of Japanese washi tape with blue wave pattern, top-down view, horizontal orientation, roughly hand-torn edges on both ends, no spool, no roll, pure white background, watercolor style.' },
  { name: 'tape_flat_sakura', prompt: 'A tiny flat scrap of washi tape with pink cherry blossom pattern, horizontal strip, hand-torn jagged ends, top-down view, isolated on pure white background, no roll, semi-transparent texture.' },
  { name: 'tape_flat_grid', prompt: 'A small rectangular piece of washi tape with hand-drawn grid pattern, flat on surface, top-down view, messy torn edges on both sides, pure white background, scrapbook asset.' }
];

async function generateFlatTapes() {
  console.log(`🎨 正在重新生成「真正的平貼手撕」紙膠帶...`);
  for (const item of items) {
    console.log(`➡️ 正在生成: ${item.name}...`);
    const payload = { instances: [{ prompt: item.prompt }], parameters: { sampleCount: 1 } };
    try {
      const response = await axios.post(ENDPOINT, payload);
      if (response.data.predictions && response.data.predictions.length > 0) {
        const base64Image = response.data.predictions[0].bytesBase64Encoded;
        const buffer = Buffer.from(base64Image, 'base64');
        fs.writeFileSync(`public/decorations/${item.name}.png`, buffer);
        console.log(`✅ 已儲存: ${item.name}.png`);
      }
    } catch (error) {
      console.error(`❌ 生成失敗:`, error.response?.data?.error?.message || error.message);
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

generateFlatTapes();
