const nullValidator = require('../Validator/NullValidator');

module.exports = {
    /**
     * 
     * @param {string} url 
     * @param {Array} params 
     */
    URLParameterGenerator: (url, params) => {
        if (url.includes('?')) {
            let array = url.split('?');
            url = array[0];
            let tempParams = array[1].split('&');
            tempParams.forEach(param => {
                let [key, value] = param.split('=');
                params.push([key, value]);
            });
        }

        let paramString = '';
        params.forEach(param => {
            if (Array.isArray(param) && param.length >= 2 &&  nullValidator.nonNull(param[1])) {
                if (Array.isArray(param[1])) {
                    paramString += `${param[0]}=${param[1].join('|')}&`;
                } else {
                    paramString += `${param[0]}=${param[1]}&`;
                }
            }
        });

        // Remove the trailing '&' if it exists
        if (paramString.endsWith('&')) {
            paramString = paramString.slice(0, -1);
        }
 
        return `${url}?${paramString}`;
    }
};
