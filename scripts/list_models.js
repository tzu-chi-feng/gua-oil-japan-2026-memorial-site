import 'dotenv/config';
import axios from 'axios';

const API_KEY = process.env.GEMINI_API_KEY;
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function listModels() {
  console.log('🔍 正在查詢您的 API Key 支援哪些模型...');
  try {
    const response = await axios.get(ENDPOINT);
    console.log('✅ 查詢成功！以下是可用的模型名稱：');
    response.data.models.forEach(model => {
      console.log(`- ${model.name}`);
    });
  } catch (error) {
    console.error('❌ 查詢失敗:');
    if (error.response) {
      console.error('狀態碼:', error.response.status);
      console.error('錯誤訊息:', JSON.stringify(error.response.data.error, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

listModels();
