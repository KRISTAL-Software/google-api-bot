/**
 * @class Token class to create tokens
 */
class Token 
{
    /**
     * 
     * @param {string} key 
     * @returns String encoded base 64
     */
    base64(key)
    {
        return btoa(key)
    };

    randomBase64(length)
    {
        let string = '';
        const chars = 'abcdefghijklmnoprstuvyzxwABCDEFGHIJKLMNOPRSTUVYZXW0123456789';
        for (let i = 0; i < length; i += 1)
            string += chars[Math.floor(Math.random() * chars.length)];
        return this.base64(string);
    };
}

module.exports = Token;