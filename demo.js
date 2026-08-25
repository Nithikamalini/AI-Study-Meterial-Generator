const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const BACKEND_URL = 'http://localhost:5000/api';
const TEST_USER = {
  name: 'Demo Student',
  email: `student_${Math.floor(Math.random() * 10000)}@example.com`,
  password: 'SecurePassword123'
};

async function runDemo() {
  console.log('🏁 Starting Full Flow Demo...');

  // 1. Download a tiny sample PDF
  const pdfPath = path.join(__dirname, 'sample.pdf');
  console.log('\n📥 Downloading sample PDF for testing...');
  try {
    const pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    const response = await fetch(pdfUrl);
    if (!response.ok) throw new Error('Failed to download PDF');
    const arrayBuffer = await response.arrayBuffer();
    fs.writeFileSync(pdfPath, Buffer.from(arrayBuffer));
    console.log('✅ Sample PDF downloaded successfully!');
  } catch (err) {
    console.error('❌ Failed to download sample PDF:', err.message);
    return;
  }

  let token = '';
  let documentId = '';

  // 2. Register User
  console.log('\n👤 Registering new user...');
  try {
    const res = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEST_USER)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    token = data.token;
    console.log(`✅ Registration successful! User ID: ${data._id}`);
    console.log(`🔑 JWT Token acquired.`);
  } catch (err) {
    console.error('❌ Registration failed:', err.message);
    return;
  }

  // 3. Login User
  console.log('\n🔐 Logging in to verify credentials...');
  try {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    console.log(`✅ Login successful! Welcome, ${data.name}`);
  } catch (err) {
    console.error('❌ Login failed:', err.message);
    return;
  }

  // 4. Upload PDF
  console.log('\n📤 Uploading sample PDF...');
  try {
    // Read the PDF file
    const fileBuffer = fs.readFileSync(pdfPath);
    
    // Construct FormData manually because Node fetch handles it
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    formData.append('file', blob, 'sample.pdf');

    const res = await fetch(`${BACKEND_URL}/documents/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    documentId = data._id;
    console.log(`✅ PDF Uploaded successfully! Document ID: ${documentId}`);
    console.log(`📄 Extracted text snippet: "${data.textContext.trim().substring(0, 100)}..."`);
  } catch (err) {
    console.error('❌ PDF Upload failed:', err.message);
    return;
  }

  // 5. Generate Study Materials (Summary)
  console.log('\n🤖 Requesting AI Summary generation...');
  try {
    const apiKey = process.env.GEMINI_API_KEY || 'dummy_key_please_replace';
    let data;
    
    if (apiKey === 'dummy_key_please_replace') {
      console.log('💡 Using demo mock AI response (since GEMINI_API_KEY is not configured yet)...');
      data = {
        type: 'summary',
        content: 'This is a sample summary of the document contents. In a real run with your Gemini API key configured, the actual parsed text of your PDF will be processed by Gemini, returning structured study guides, flashcards, or interactive multiple-choice questions.'
      };
    } else {
      const res = await fetch(`${BACKEND_URL}/study-materials/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          documentId: documentId,
          type: 'summary'
        })
      });
      data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Generation failed');
    }

    console.log('✅ AI Summary successfully generated!');
    console.log('\n📝 Summary text:\n=========================================');
    console.log(data.content);
    console.log('=========================================');
  } catch (err) {
    console.warn('⚠️ AI Generation failed:', err.message);
  }

  // Cleanup
  try {
    fs.unlinkSync(pdfPath);
    console.log('\n🧹 Cleaned up sample.pdf file.');
  } catch (e) {}

  console.log('\n🎉 Demo complete!');
}

runDemo();
