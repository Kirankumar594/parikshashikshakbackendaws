const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Guru_Resource_Mangament", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once('open', async () => {
  try {
    console.log("Connected to MongoDB");
    
    // Get the collection
    const collection = db.collection('achievements');
    
    // Drop the old unique index
    try {
      await collection.dropIndex({ rollNumber: 1, examType: 1, subject: 1, class: 1 });
      console.log("Dropped old unique index on rollNumber, examType, subject, and class");
    } catch (error) {
      console.log("Old index might not exist or already dropped:", error.message);
    }
    
    // Create the new sparse unique compound index
    await collection.createIndex(
      { rollNumber: 1, examType: 1, subject: 1, class: 1 },
      { unique: true, sparse: true, name: "rollNumber_1_examType_1_subject_1_class_1" }
    );
    console.log("Created new sparse unique compound index on rollNumber, examType, subject, and class");
    
    // List all indexes to verify
    const indexes = await collection.indexes();
    console.log("Current indexes:", indexes.map(idx => idx.name));
    
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
