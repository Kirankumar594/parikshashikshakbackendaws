/**
 * Database Index Migration Script
 * Run this script once to add performance indexes to the GenrateQA collection
 * 
 * Usage: node scripts/addIndexes.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database';

async function addIndexes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected successfully!');

    const db = mongoose.connection.db;
    const collection = db.collection('generateqas'); // Adjust collection name if different

    console.log('\nAdding indexes to GenrateQA collection...');

    // 1. Compound index for common filter combinations
    console.log('Creating compound index (Board, Class, Medium, status)...');
    await collection.createIndex(
      { Board: 1, Class: 1, Medium: 1, status: 1 },
      { name: 'filter_compound_idx', background: true }
    );

    // 2. Index for date range queries
    console.log('Creating date index (createdAt)...');
    await collection.createIndex(
      { createdAt: -1 },
      { name: 'date_idx', background: true }
    );

    // 3. Index for paperId search
    console.log('Creating paperId index...');
    await collection.createIndex(
      { paperId: 1 },
      { name: 'paperId_idx', background: true }
    );

    // 4. Index for Institute_Name search
    console.log('Creating Institute_Name index...');
    await collection.createIndex(
      { Institute_Name: 1 },
      { name: 'institute_idx', background: true }
    );

    // 5. Index for teacher lookup
    console.log('Creating teacherId index...');
    await collection.createIndex(
      { teacherId: 1 },
      { name: 'teacher_idx', background: true }
    );

    // 6. Optional: Text index for full-text search
    // Uncomment if you want to use MongoDB text search instead of regex
    /*
    console.log('Creating text search index...');
    await collection.createIndex(
      { 
        paperId: 'text', 
        Institute_Name: 'text', 
        Board: 'text', 
        Class: 'text', 
        Medium: 'text' 
      },
      { name: 'text_search_idx', background: true }
    );
    */

    console.log('\n✅ All indexes created successfully!');
    
    // List all indexes
    console.log('\nCurrent indexes on collection:');
    const indexes = await collection.indexes();
    indexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    console.log('\n📊 Index Statistics:');
    const stats = await collection.stats();
    console.log(`  Total documents: ${stats.count}`);
    console.log(`  Total indexes: ${stats.nindexes}`);
    console.log(`  Total index size: ${(stats.totalIndexSize / 1024 / 1024).toFixed(2)} MB`);

  } catch (error) {
    console.error('❌ Error adding indexes:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the migration
addIndexes();
