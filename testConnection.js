const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB Connection...');
console.log('Connection String:', process.env.DB ? 'Found (hidden for security)' : 'NOT FOUND');

mongoose.connect(process.env.DB, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
})
.then(() => {
  console.log('✅ Database Connected Successfully!');
  console.log('Connection State:', mongoose.connection.readyState); // 1 = connected
  process.exit(0);
})
.catch((err) => {
  console.error('❌ Database Connection Failed!');
  console.error('Error Name:', err.name);
  console.error('Error Message:', err.message);
  
  // Common issues
  if (err.message.includes('ENOTFOUND')) {
    console.error('\n💡 Issue: Cannot find MongoDB server');
    console.error('   - Check your internet connection');
    console.error('   - Verify the MongoDB Atlas cluster is running');
  } else if (err.message.includes('authentication failed')) {
    console.error('\n💡 Issue: Authentication failed');
    console.error('   - Check username and password in connection string');
  } else if (err.message.includes('timeout')) {
    console.error('\n💡 Issue: Connection timeout');
    console.error('   - Check firewall settings');
    console.error('   - Verify IP whitelist in MongoDB Atlas');
  }
  
  process.exit(1);
});
