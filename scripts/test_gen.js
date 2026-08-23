import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
// 注意：模型名稱不需要 models/ 前綴在 URL 中
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`;

async function testGeneration() {
  console.log('🚀 開始使用 Imagen 4.0 試跑生圖...');
  
  const payload = {
    instances: [
      {
        prompt: "A beautiful watercolor hand-drawn sticker of Mount Fuji with a small cherry blossom branch, soft colors, pure white background, minimal scrapbooking style, high resolution."
      }
    ],
    parameters: {
      sampleCount: 1
    }
  };

  try {
    const response = await axios.post(ENDPOINT, payload);
    
    if (response.data.predictions && response.data.predictions.length > 0) {
      const base64Image = response.data.predictions[0].bytesBase64Encoded;
      const buffer = Buffer.from(base64Image, 'base64');
      
      const filePath = path.join('public/decorations', 'test_fuji_v4.png');
      fs.writeFileSync(filePath, buffer);
      
      console.log(`✅ 成功生成圖片！版本: Imagen 4.0`);
      console.log(`存檔路徑: ${filePath}`);
    } else {
      console.log('❌ API 回傳成功但沒有包含圖片預測結果。');
    }
  } catch (error) {
    console.error('❌ 呼叫 API 失敗:');
    if (error.response) {
      console.error('狀態碼:', error.response.status);
      console.error('錯誤訊息:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

testGeneration();
