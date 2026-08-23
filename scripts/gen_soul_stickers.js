import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'imagen-4.0-generate-001';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

const DECO_DIR = 'public/decorations';

const soulItems = [
  { name: 'jellyfish_sumida', prompt: 'A single, semi-transparent Moon Jellyfish (Aurelia aurita), soft watercolor style with glowing white and pale blue edges, floaty and ethereal, hand-drawn sticker on pure white background.' },
  { name: 'omikuji_tai', prompt: 'A cute red Japanese sea bream (Tai) fortune sticker, wooden texture with a small gold hook, watercolor hand-drawn style, traditional charm, pure white background.' },
  { name: 'toilet_auto', prompt: 'A cute, slightly anthropomorphic Japanese bidet toilet with the lid automatically opening, surprise rays or sparkles, soft watercolor hand-drawn sticker, pure white background.' },
  { name: 'fuji_bath', prompt: 'A traditional Japanese wooden bath bucket filled with vibrant "Stitch-blue" turquoise bath water, steam rising, watercolor hand-drawn style, pure white background.' },
  { name: 'paper_doll', prompt: 'A simple white Japanese Hitogata (paper doll) used for cleansing rituals, floating on soft watercolor blue water ripples, hand-drawn aesthetic, pure white background.' },
  { name: 'yatagarasu', prompt: 'A mystical three-legged crow (Yatagarasu) from Japanese mythology, black watercolor ink style, slightly cute but powerful, hand-drawn sticker, pure white background.' },
  { name: 'toki_no_kane', prompt: 'The iconic Toki no Kane (Clock Tower) of Kawagoe, old wooden structure, watercolor hand-drawn style, soft historical vibe, pure white background.' },
  { name: 'japanese_mailbox', prompt: 'A classic bright red Japanese street mailbox, iconic shape, watercolor hand-drawn style, travel journal sticker, pure white background.' }
];

async function generateSoulStickers() {
  console.log(`🎨 正在生成第一批「靈魂貼紙」素材 (${soulItems.length} 個)...`);
  
  if (!fs.existsSync(DECO_DIR)) fs.mkdirSync(DECO_DIR, { recursive: true });

  for (const item of soulItems) {
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
      console.error(`❌ 生成 ${item.name} 失敗:`, error.response?.data?.error?.message || error.message);
      if (error.response?.status === 400) {
        console.log('💡 偵測到配額限制，停止後續生成。請稍後再試。');
        break;
      }
    }
    // 增加延遲，讓 API 休息一下
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  console.log('\n✨ 第一批生成任務處理完畢！');
}

generateSoulStickers();
