import 'dotenv/config';
import axios from 'axios';

const API_KEY = process.env.GEMINI_API_KEY;
const ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

async function testText() {
  console.log('📝 開始測試文字 API (Gemini 1.5 Flash)...');
  
  const payload = {
    contents: [{ parts: [{ text: "請用中文跟我說：你好，我準備好幫你做手帳了！" }] }]
  };

  try {
    const response = await axios.post(ENDPOINT, payload);
    const text = response.data.candidates[0].content.parts[0].text;
    console.log('✅ 文字 API 呼叫成功！Gemini 說：', text);
  } catch (error) {
    console.error('❌ 文字 API 呼叫失敗:');
    if (error.response) {
      console.error('狀態碼:', error.response.status);
      console.error('錯誤訊息:', JSON.stringify(error.response.data.error, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

testText();
