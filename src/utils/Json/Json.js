const fs = require('fs');

/**
 * @class Create JSON files
 */

class Json
{
    constructor(path)
    {
        // Check if the file exists
        if (fs.existsSync(path)) {
            // If it exists, assign it to the file variable
            this.file = path;
        } else {
            // If it does not exist, create the file and assign it to the file variable
            fs.writeFileSync(path, '');
            this.file = path;
        }
    }

    /**
     * 
     * @param {string} data 
     */
    write(data)
    {
        if(typeof data === 'string')
            fs.writeFileSync(this.file, data);
    }

    /**
     * 
     * @param {Object} object 
     */
    writeObject(object)
    {
        this.write(JSON.stringify(object));
    }
}

module.exports = Json;