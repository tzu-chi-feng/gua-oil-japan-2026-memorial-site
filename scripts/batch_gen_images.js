import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'imagen-4.0-generate-001';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

const DECO_DIR = 'public/decorations';

const items = [
  { name: 'airplane_peach', prompt: 'A cute watercolor hand-drawn sticker of a pink Peach Aviation airplane, soft lines, pure white background, minimal journal style.' },
  { name: 'train_skyliner', prompt: 'A watercolor illustration of a Japanese Keisei Skyliner train, sleek design, hand-drawn aesthetic, pure white background, scrapbook sticker style.' },
  { name: 'food_unagi', prompt: 'A delicious Japanese unagi eel rice bowl in a traditional red/black lacquer box, watercolor hand-drawn style, pure white background, foodie sticker.' },
  { name: 'food_gyutan', prompt: 'A watercolor painting of a Japanese grilled beef tongue (Gyutan) set meal with a bowl of soup, soft textures, pure white background, journal sticker.' },
  { name: 'shrine_asakusa', prompt: 'A cute hand-drawn sticker of the big red Kaminarimon lantern from Asakusa Senso-ji, watercolor style, pure white background.' },
  { name: 'kawagoe_chiikawa', prompt: 'A cute surprise lucky bag (fukubukuro) inspired by Chiikawa characters, soft pastel colors, watercolor style, pure white background, sticker.' },
  { name: 'snack_dango', prompt: 'A watercolor hand-drawn sticker of Japanese Mitarashi Dango (rice dumplings) on a stick, glistening glaze, pure white background.' },
  { name: 'snack_strawberry', prompt: 'A beautiful bright red Japanese strawberry, watercolor hand-drawn style, soft details, pure white background.' },
  { name: 'daruma', prompt: 'A traditional red Japanese Daruma doll with a cute expression, watercolor hand-drawn sticker, pure white background.' }
];

async function generateAll() {
  console.log(`🎨 開始批次生成 ${items.length} 個手帳素材 (使用 ${MODEL})...`);
  
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
    
    // 稍微延遲一下，避免 API Rate Limit
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n✨ 所有素材生成任務完成！');
}

generateAll();
