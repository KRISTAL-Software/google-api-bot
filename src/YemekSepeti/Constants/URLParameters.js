module.exports = {
    /**
     * 
     * @returns {string}
     */
    restaurant : function()
    {
        return '?';
    },
    /**
     * 
     * @param {string} longitute 
     * @param {string} latitude 
     * @param {string} textQuery 
     * @returns {string}
     */
    restaurantList : function(longitute, latitude, textQuery)
    {
        let temp = '?';
        if(longitute)                
            temp+=`lng=${longitute}`;
        if(longitute)
            temp+=`lat=${latitude}`;
        if(textQuery)
            temp+=`query=${textQuery}`;
        return temp;
    }
}