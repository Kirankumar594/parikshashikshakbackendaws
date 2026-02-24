const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    const db = mongoose.connection.db;
    const collection = db.collection('students');
    
    // Get all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));
    
    // Drop the old registerNumber index if it exists
    const hasOldIndex = indexes.some(idx => idx.name === 'registerNumber_1_schoolId_1');
    if (hasOldIndex) {
      await collection.dropIndex('registerNumber_1_schoolId_1');
      console.log('✅ Dropped old registerNumber_1_schoolId_1 index');
    } else {
      console.log('ℹ️  Old registerNumber index not found');
    }
    
    // Drop other old indexes if they exist
    const oldIndexes = ['registerNumber_1', 'className_1', 'academicYear_1', 'name_1'];
    for (const indexName of oldIndexes) {
      const hasIndex = indexes.some(idx => idx.name === indexName);
      if (hasIndex) {
        try {
          await collection.dropIndex(indexName);
          console.log(`✅ Dropped old ${indexName} index`);
        } catch (err) {
          console.log(`ℹ️  Could not drop ${indexName}: ${err.message}`);
        }
      }
    }
    
    // Check if correct index exists
    const hasCorrectIndex = indexes.some(idx => idx.name === 'admissionNo_1_schoolId_1');
    if (hasCorrectIndex) {
      console.log('✅ Correct index (admissionNo_1_schoolId_1) already exists');
    } else {
      // Create new index on admissionNo and schoolId
      await collection.createIndex({ admissionNo: 1, schoolId: 1 }, { unique: true });
      console.log('✅ Created new index on admissionNo and schoolId');
    }
    
    console.log('\n✅ Index fix completed successfully!');
    console.log('You can now add students without errors.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing indexes:', error);
    process.exit(1);
  }
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
