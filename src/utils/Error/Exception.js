module.exports = {
    json : (data)=>{
        throw new Error(JSON.stringify(data));
    }
};