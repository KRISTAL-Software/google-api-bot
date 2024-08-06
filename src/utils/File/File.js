const { prototype } = require('events');
const fs = require('fs');


const read = (path, encoding = 'utf-8')=> {
    try {
        return fs.readFileSync(path, {
            encoding: encoding
        });
    }
    catch (error) {
        throw new Error(error);
    }
};

const writeAsync = async (path, data)=> {

    try {
        await fs.writeFileSync(path, data, { encoding : 'utf-8'});
    }

    catch (error) {
        throw new Error(error);
    }
};

const readJSON = (path) =>{
    try {
        return JSON.parse(read(path));
    } catch (error) {
        throw new Error(error);
        
    }
};

module.exports = {
    read : read,
    write: writeAsync,
    readJSON: readJSON
}

