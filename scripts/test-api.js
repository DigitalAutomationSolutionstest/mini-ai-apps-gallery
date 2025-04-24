const fetch = require('node-fetch');

const API_ENDPOINTS = [
  'pdf',
  'image',
  'code',
  'audio',
  'quote',
  'stripe-webhook',
  'checkout-subscription',
  'customer-portal',
  'credits',
  'send-quote',
  'add-credits'
];

const SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:54321';

async function checkEndpoint(endpoint) {
  try {
    // Test health endpoint
    const healthResponse = await fetch(`${SUPABASE_URL}/functions/v1/${endpoint}/health`);
    const healthData = await healthResponse.json();
    
    // Test main endpoint
    const mainResponse = await fetch(`${SUPABASE_URL}/functions/v1/${endpoint}`);
    const mainData = await mainResponse.json();

    return {
      endpoint,
      health: {
        status: healthResponse.status,
        ok: healthResponse.ok,
        data: healthData
      },
      main: {
        status: mainResponse.status,
        ok: mainResponse.ok,
        data: mainData
      }
    };
  } catch (error) {
    return {
      endpoint,
      error: error.message
    };
  }
}

async function testAllEndpoints() {
  console.log('Testing all API endpoints...\n');
  
  const results = await Promise.all(
    API_ENDPOINTS.map(endpoint => checkEndpoint(endpoint))
  );

  let allHealthy = true;
  
  results.forEach(result => {
    console.log(`\n${result.endpoint}:`);
    if (result.error) {
      console.log('❌ Error:', result.error);
      allHealthy = false;
    } else {
      console.log('Health Check:');
      console.log(`  Status: ${result.health.status}`);
      console.log(`  OK: ${result.health.ok}`);
      console.log(`  Data:`, result.health.data);
      
      console.log('\nMain Endpoint:');
      console.log(`  Status: ${result.main.status}`);
      console.log(`  OK: ${result.main.ok}`);
      console.log(`  Data:`, result.main.data);
      
      if (!result.health.ok || !result.main.ok) {
        allHealthy = false;
      }
    }
  });

  console.log('\nSummary:');
  if (allHealthy) {
    console.log('✅ All endpoints are healthy');
  } else {
    console.log('❌ Some endpoints are unhealthy');
    process.exit(1);
  }
}

testAllEndpoints().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
}); 