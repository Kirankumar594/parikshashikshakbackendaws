const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB Connection...\n');

// Test 1: Original connection string
const testConnection1 = async () => {
  console.log('Test 1: Using original connection string');
  try {
    await mongoose.connect(process.env.DB, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connection successful!');
    await mongoose.connection.close();
    return true;
  } catch (err) {
    console.log('❌ Connection failed:', err.message);
    return false;
  }
};

// Test 2: With additional options
const testConnection2 = async () => {
  console.log('\nTest 2: With additional connection options');
  try {
    await mongoose.connect(process.env.DB, {
      serverSelectionTimeoutMS: 5000,
      family: 4, // Force IPv4
    });
    console.log('✅ Connection successful!');
    await mongoose.connection.close();
    return true;
  } catch (err) {
    console.log('❌ Connection failed:', err.message);
    return false;
  }
};

// Test 3: Check DNS resolution
const testDNS = async () => {
  console.log('\nTest 3: Testing DNS resolution');
  const dns = require('dns').promises;
  try {
    const result = await dns.resolveSrv('_mongodb._tcp.cluster0.kbcxl4s.mongodb.net');
    console.log('✅ DNS resolution successful');
    console.log('Resolved addresses:', result.length);
    return true;
  } catch (err) {
    console.log('❌ DNS resolution failed:', err.message);
    console.log('\nPossible causes:');
    console.log('1. No internet connection');
    console.log('2. Firewall blocking DNS queries');
    console.log('3. DNS server issues');
    console.log('\nSolutions:');
    console.log('1. Check your internet connection');
    console.log('2. Try using Google DNS (8.8.8.8)');
    console.log('3. Disable VPN if using one');
    console.log('4. Check Windows Firewall settings');
    return false;
  }
};

// Run all tests
const runTests = async () => {
  await testDNS();
  
  const test1 = await testConnection1();
  if (test1) {
    console.log('\n✅ All tests passed! Your MongoDB connection is working.');
    process.exit(0);
  }
  
  const test2 = await testConnection2();
  if (test2) {
    console.log('\n✅ Connection works with IPv4 option. Update your app.js to use family: 4');
    process.exit(0);
  }
  
  console.log('\n❌ All connection tests failed.');
  console.log('\nTroubleshooting steps:');
  console.log('1. Check internet connection: ping google.com');
  console.log('2. Check MongoDB Atlas:');
  console.log('   - Go to https://cloud.mongodb.com');
  console.log('   - Check if cluster is running');
  console.log('   - Network Access > Add IP Address > Allow Access from Anywhere (0.0.0.0/0)');
  console.log('3. Try disabling Windows Firewall temporarily');
  console.log('4. Try using mobile hotspot instead of WiFi');
  
  process.exit(1);
};

runTests();
