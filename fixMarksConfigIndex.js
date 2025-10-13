const mongoose = require("mongoose");

// Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://khansir:uR4i2S8pjloRhe6h@cluster0.kbcxl4s.mongodb.net/Guru_Resource_Mangament", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once('open', async () => {
  try {
    console.log("Connected to MongoDB");
    
    // Get the collection
    const collection = db.collection('marksconfigs');
    
    // List all current indexes
    const indexes = await collection.indexes();
    console.log("Current indexes on marksconfigs collection:");
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}:`, index.key);
    });
    
    // Drop problematic indexes
    const problematicIndexes = [
      { examType: 1, subject: 1, class: 1 },
      { examTypeId: 1, className: 1 }
    ];
    
    for (const indexKey of problematicIndexes) {
      try {
        await collection.dropIndex(indexKey);
        console.log(`Dropped problematic index:`, indexKey);
      } catch (error) {
        console.log(`Index might not exist or already dropped:`, error.message);
      }
    }
    
    // Create the new correct unique compound index
    await collection.createIndex(
      { authId: 1, examTypeId: 1, className: 1 },
      { unique: true, name: "authId_1_examTypeId_1_className_1" }
    );
    console.log("Created new unique compound index on authId, examTypeId, and className");
    
    // List all indexes to verify
    const finalIndexes = await collection.indexes();
    console.log("Final indexes:", finalIndexes.map(idx => idx.name));
    
    console.log("Migration completed successfully!");
    
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    mongoose.connection.close();
  }
});

db.on('error', (error) => {
  console.error("MongoDB connection error:", error);
});
