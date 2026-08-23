import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';

const API_KEY = process.env.GEMINI_API_KEY;
// 嘗試使用 "Fast" 模型版本
const MODEL = 'imagen-4.0-fast-generate-001';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

async function tryFastModel() {
  console.log(`⚡ 嘗試使用 Fast 模型 (${MODEL}) 生成水母...`);
  const payload = {
    instances: [{ prompt: "A single, semi-transparent Moon Jellyfish, soft watercolor style, glowing edges, hand-drawn sticker on pure white background." }],
    parameters: { sampleCount: 1 }
  };

  try {
    const response = await axios.post(ENDPOINT, payload);
    if (response.data.predictions && response.data.predictions.length > 0) {
      const base64Image = response.data.predictions[0].bytesBase64Encoded;
      const buffer = Buffer.from(base64Image, 'base64');
      fs.writeFileSync('public/decorations/jellyfish_sumida.png', buffer);
      console.log('✅ Fast 模型生成成功！');
    }
  } catch (error) {
    console.error('❌ 依然失敗:', error.response?.data?.error?.message || error.message);
  }
}

tryFastModel();
