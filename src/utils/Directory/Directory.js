const fs = require('fs');

module.exports = {
    ensureDirectoryExistsAsync : async function (directoryPath) {
        try {
          // Check if the directory exists
          await fs.access(directoryPath);
          console.log('Directory already exists');
        } catch (error) {
          // If the directory does not exist, create it
          if (error.code === 'ENOENT') {
            await fs.mkdir(directoryPath, { recursive: true });
            console.log('Directory created');
          } else {
            // Handle other errors, e.g., permission issues
            console.error('Error checking or creating directory:', error);
          }
        }
    },

    ensureDirectoryExists: function (directoryPath) {
        if (fs.existsSync(directoryPath)) {
          console.log('Directory already exists');
        } else {
          try {
            fs.mkdirSync(directoryPath, { recursive: true });
            console.log('Directory created');
          } catch (error) {
            // Handle errors such as permission issues
            console.error('Error creating directory:', error);
          }
        }
    },

    
};