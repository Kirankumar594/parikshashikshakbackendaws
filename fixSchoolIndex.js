const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.DB)
  .then(async () => {
    console.log('Database Connected');
    
    try {
      // Get the School collection
      const db = mongoose.connection.db;
      const collection = db.collection('schools');
      
      // Get all indexes
      const indexes = await collection.indexes();
      console.log('Current indexes:', JSON.stringify(indexes, null, 2));
      
      // Try to drop the old schoolCode index if it exists
      try {
        await collection.dropIndex('schoolCode_1');
        console.log('Successfully dropped old schoolCode_1 index');
      } catch (err) {
        console.log('schoolCode_1 index does not exist or already dropped');
      }
      
      // Verify indexes after drop
      const indexesAfter = await collection.indexes();
      console.log('Indexes after drop:', JSON.stringify(indexesAfter, null, 2));
      
      console.log('\nDone! You can now restart the server.');
      process.exit(0);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
