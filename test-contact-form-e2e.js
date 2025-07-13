/**
 * Contact Form End-to-End Test
 * Tests the contact form submission with a real example
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function testContactFormE2E() {
  console.log('🧪 Testing Contact Form End-to-End');
  console.log(`🌐 Testing against: ${BASE_URL}`);
  console.log('═'.repeat(80));

  const testFormData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    company: 'Test Company Inc.',
    phone: '+1-555-123-4567',
    service: 'Cloud Strategy & Migration',
    message: 'Hello, I am interested in learning more about your cloud migration services. This is a test message to verify the contact form functionality.',
    subscribe: false
  };

  try {
    console.log('📤 Submitting contact form...');
    console.log('📝 Form data:', JSON.stringify(testFormData, null, 2));

    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testFormData),
    });

    console.log(`📊 Response status: ${response.status}`);
    
    const responseData = await response.json();
    console.log('📋 Response data:', JSON.stringify(responseData, null, 2));

    if (response.ok && responseData.success) {
      console.log('✅ Contact form submission successful!');
      console.log('');
      console.log('🎯 What should happen now:');
      console.log('  1. Admin should receive notification email at:', process.env.ADMIN_EMAIL || 'configured admin email');
      console.log('  2. User should receive confirmation email at:', testFormData.email);
      console.log('  3. Check server logs for email sending details');
      console.log('  4. Check spam/junk folders if emails are not in inbox');
      console.log('  5. Verify Resend dashboard for delivery status');
    } else {
      console.log('❌ Contact form submission failed');
      console.log('Error:', responseData.error || 'Unknown error');
      
      if (responseData.details) {
        console.log('Validation details:', JSON.stringify(responseData.details, null, 2));
      }
    }
  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
  }
}

async function testNewsletterSubscription() {
  console.log('\n🧪 Testing Newsletter Subscription');
  console.log('═'.repeat(50));

  const testData = {
    email: `newsletter-test-${Date.now()}@example.com`
  };

  try {
    console.log('📤 Submitting newsletter subscription...');
    console.log('📝 Email:', testData.email);

    const response = await fetch(`${BASE_URL}/api/newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const responseData = await response.json();
    console.log(`📊 Response status: ${response.status}`);
    console.log('📋 Response data:', JSON.stringify(responseData, null, 2));

    if (response.ok && responseData.success) {
      console.log('✅ Newsletter subscription successful!');
    } else {
      console.log('❌ Newsletter subscription failed');
    }
  } catch (error) {
    console.error('💥 Newsletter test failed:', error.message);
  }
}

// Run the tests
console.log('🚀 Starting Contact Form Tests');
console.log(`📅 Timestamp: ${new Date().toISOString()}`);
console.log('');

testContactFormE2E()
  .then(() => testNewsletterSubscription())
  .catch(console.error);
