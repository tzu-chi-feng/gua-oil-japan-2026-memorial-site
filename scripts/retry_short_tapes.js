import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'imagen-4.0-generate-001';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

const DECO_DIR = 'public/decorations';

const items = [
  { name: 'tape_short_stripes', prompt: 'Small torn piece of washi tape with watercolor stripes, horizontal strip, hand-torn ends on both sides, semi-transparent paper texture, pure white background.' },
  { name: 'tape_short_stars', prompt: 'Tiny scrap of blue washi tape with small white stars pattern, hand-drawn aesthetic, rough torn edges on both ends, isolated on pure white background.' },
  { name: 'tape_short_mint', prompt: 'A small rectangular scrap of mint green paper tape, roughly torn on both left and right sides, watercolor texture, pure white background.' }
];

async function retryShortTapes() {
  console.log(`🎨 重新嘗試生成失敗的短截紙膠帶素材...`);
  
  for (const item of items) {
    console.log(`➡️ 正在生成: ${item.name}...`);
    const payload = { instances: [{ prompt: item.prompt }], parameters: { sampleCount: 1 } };
    try {
      const response = await axios.post(ENDPOINT, payload);
      if (response.data.predictions && response.data.predictions.length > 0) {
        const base64Image = response.data.predictions[0].bytesBase64Encoded;
        const buffer = Buffer.from(base64Image, 'base64');
        fs.writeFileSync(path.join(DECO_DIR, `${item.name}.png`), buffer);
        console.log(`✅ 已儲存: ${item.name}.png`);
      }
    } catch (error) {
      console.error(`❌ 生成 ${item.name} 失敗:`, error.response?.data || error.message);
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

retryShortTapes();
