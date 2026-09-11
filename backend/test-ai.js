import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function testGemini() {
  console.log('Testing Gemini connection...');
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ GEMINI_API_KEY is not set in backend/.env');
    process.exit(1);
  }

  // Masked check: do not print key
  console.log('✓ Found GEMINI_API_KEY in backend/.env (length: ' + process.env.GEMINI_API_KEY.length + ' chars)');

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
    
    console.log('Sending test prompt to Gemini (gemini-3.6-flash)...');
    const result = await model.generateContent('Hello, confirm in 5 words that you are operational.');
    console.log('✅ Gemini Connection Successful!');
    console.log('Response:', result.response.text().trim());
  } catch (err) {
    console.error('❌ Gemini Connection Failed:');
    console.error(err.message);
    if (err.message.includes('API_KEY_INVALID')) {
      console.log('\n💡 Note: Make sure to use a valid Google AI Studio API key starting with "AIzaSy..." from:');
      console.log('   https://aistudio.google.com/app/apikey');
    }
  }
}

testGemini();
