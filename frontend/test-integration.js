// Test script to verify frontend-backend integration
// Run this in the browser console or as a Node.js script

async function testBackendIntegration() {
  console.log('🧪 Testing Backend Integration...\n');

  // Test 1: Check API Status
  console.log('1️⃣ Testing API Status...');
  try {
    const response = await fetch('/api/status');
    const status = await response.json();
    console.log('✅ API Status:', status);
  } catch (error) {
    console.error('❌ API Status failed:', error.message);
  }

  // Test 2: Test Code Generation
  console.log('\n2️⃣ Testing Code Generation...');
  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Write a simple hello world function',
        language: 'javascript',
        complexity: 'simple',
        modelProvider: 'gemini'
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Code Generation:', result);
    } else {
      const error = await response.json();
      console.log('⚠️ Code Generation (expected if no API keys):', error);
    }
  } catch (error) {
    console.error('❌ Code Generation failed:', error.message);
  }

  // Test 3: Test Code Explanation
  console.log('\n3️⃣ Testing Code Explanation...');
  try {
    const response = await fetch('/api/ai/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'function add(a, b) { return a + b; }',
        modelProvider: 'groq'
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Code Explanation:', result);
    } else {
      const error = await response.json();
      console.log('⚠️ Code Explanation (expected if no API keys):', error);
    }
  } catch (error) {
    console.error('❌ Code Explanation failed:', error.message);
  }

  console.log('\n🎉 Integration test completed!');
  console.log('💡 If you see API key errors, make sure to set up your .env file in the backend directory.');
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testBackendIntegration = testBackendIntegration;
  console.log('🔧 Test function available as: testBackendIntegration()');
}

// Run test if this is a Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testBackendIntegration };
} 