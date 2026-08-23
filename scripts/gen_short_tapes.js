import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'imagen-4.0-generate-001';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

const DECO_DIR = 'public/decorations';

const items = [
  { name: 'tape_short_dots', prompt: 'A small, short rectangular piece of semi-transparent washi tape, roughly torn edges on both left and right ends, cute watercolor polka dot pattern, top-down view, isolated on pure white background, scrapbook asset.' },
  { name: 'tape_short_stripes', prompt: 'A short horizontal strip of hand-drawn washi tape, jagged torn edges, simple watercolor stripes, semi-transparent paper texture, pure white background, high resolution.' },
  { name: 'tape_short_stars', prompt: 'A tiny piece of torn washi tape, irregular hand-torn ends, delicate gold star pattern on pale blue, semi-transparent, isolated on pure white background.' },
  { name: 'tape_short_mint', prompt: 'A small scrap of mint green washi tape, messy torn edges, realistic paper fiber texture, semi-transparent, top-down view, pure white background.' }
];

async function generateShortTapes() {
  console.log(`🎨 正在生成「手撕感」短截紙膠帶素材...`);
  
  if (!fs.existsSync(DECO_DIR)) fs.mkdirSync(DECO_DIR, { recursive: true });

  for (const item of items) {
    console.log(`➡️ 正在生成: ${item.name}...`);
    
    const payload = {
      instances: [{ prompt: item.prompt }],
      parameters: { sampleCount: 1 }
    };

    try {
      const response = await axios.post(ENDPOINT, payload);
      if (response.data.predictions && response.data.predictions.length > 0) {
        const base64Image = response.data.predictions[0].bytesBase64Encoded;
        const buffer = Buffer.from(base64Image, 'base64');
        const fileName = `${item.name}.png`;
        fs.writeFileSync(path.join(DECO_DIR, fileName), buffer);
        console.log(`✅ 已儲存: ${fileName}`);
      }
    } catch (error) {
      console.error(`❌ 生成 ${item.name} 失敗:`, error.message);
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  console.log('\n✨ 短截紙膠帶素材生成完成！');
}

generateShortTapes();
