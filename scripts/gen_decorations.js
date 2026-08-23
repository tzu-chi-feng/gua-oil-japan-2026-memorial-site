import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'imagen-4.0-generate-001';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

const DECO_DIR = 'public/decorations';

const items = [
  // 紙膠帶類
  { name: 'tape_sakura', prompt: 'A long horizontal strip of Japanese washi tape, semi-transparent, delicate watercolor cherry blossom pattern, rough torn edges on both ends, pure white background.' },
  { name: 'tape_fuji', prompt: 'A long horizontal strip of blue washi tape, Japanese minimal wave pattern, semi-transparent paper texture, torn edges, watercolor style, pure white background.' },
  { name: 'tape_grid', prompt: 'A strip of beige washi tape with simple hand-drawn grid pattern, warm colors, semi-transparent, torn edges, scrapbook style, pure white background.' },
  
  // 相框類
  { name: 'frame_polaroid', prompt: 'A hand-drawn vintage polaroid photo frame, creamy paper texture, slightly irregular edges, watercolor style, empty center, pure white background.' },
  { name: 'frame_torn', prompt: 'A rectangular piece of paper with rough torn edges, handmade paper texture, watercolor wash on edges, empty center, pure white background, scrapbook element.' }
];

async function generateDecos() {
  console.log(`🎨 正在生成裝飾素材 (紙膠帶與相框)...`);
  
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
  console.log('\n✨ 裝飾素材生成完成！');
}

generateDecos();
