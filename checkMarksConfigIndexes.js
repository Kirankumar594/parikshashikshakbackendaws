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
    const collection = db.collection('marksconfigs');
    
    // List all indexes
    const indexes = await collection.indexes();
    console.log("Current indexes on marksconfigs collection:");
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}:`, index.key);
    });
    
    // Check if the problematic index exists
    const problematicIndex = indexes.find(idx => 
      idx.key.examTypeId === 1 && 
      idx.key.className === 1 && 
      !idx.key.authId
    );
    
    if (problematicIndex) {
      console.log("\n⚠️  PROBLEMATIC INDEX FOUND:");
      console.log("Index:", problematicIndex.name);
      console.log("Key:", problematicIndex.key);
      console.log("This index needs to be fixed!");
    } else {
      console.log("\n✅ No problematic index found. The collection looks good.");
    }
    
  } catch (error) {
    console.error("Error checking indexes:", error);
  } finally {
    mongoose.connection.close();
  }
});

db.on('error', (error) => {
  console.error("MongoDB connection error:", error);
});
