const { exec } = require('child_process');

// Check if MongoDB is running
exec('netstat -an | findstr :27017', (error, stdout, stderr) => {
  if (error) {
    console.log('MongoDB is not running. Starting MongoDB...');
    
    // Try to start MongoDB
    exec('mongod --dbpath "C:\\data\\db"', (error, stdout, stderr) => {
      if (error) {
        console.error('Error starting MongoDB:', error.message);
        console.log('Please start MongoDB manually or check your installation.');
        console.log('You can also try: net start MongoDB');
      } else {
        console.log('MongoDB started successfully');
      }
    });
  } else {
    console.log('MongoDB is already running');
    console.log('You can now run the migration script: node fixMarksConfigIndex.js');
  }
});
