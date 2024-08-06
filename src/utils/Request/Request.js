const axios = require('axios');
const exception = require('../../utils/Error/Exception');

class RequestHelper 
{
    constructor(callback = null)
    {
        
        if(callback && typeof callback !== 'function')
            exception.json({
            error: 'Undefined callbak type',
            details: 'Callback must be a function'
        });

        this.callback = callback;

        this.axios = axios;
    }

    /**
     * Makes a GET request to the specified URL with the given configuration.
     * 
     * @param {string} url - The URL to make the GET request to.
     * @param {axios.AxiosRequestConfig} [config] - Optional Axios configuration.
     * @returns {Promise<axios.AxiosResponse>} - A promise that resolves to the Axios response.
     */
    get(url, config = {}) {
        return this.axios.get(url, config)
            .then(response => {
                if(this.callback)
                    this.callback(response);
                return response;
            })
            .catch(error => {
                console.error('Error making GET request:', error);
                throw error;
            });
    }

    /**
     * Makes a GET request to the specified URL with the given configuration.
     * 
     * @param {string} url - The URL to make the GET request to.
     * @param {axios.AxiosRequestConfig} [config] - Optional Axios configuration.
     * @returns {Object|string} - A promise that resolves to the Axios response.
     */
    getData(url, config = {})
    {
        return this.axios.get(url, config)
            .then(response => {
                if(this.callback)
                    this.callback(response.data);
                return response.data;
            })
            .catch(error => {
                console.error('Error making GET request:', error);
                throw error;
            });
    }

    /**
     * Makes a POST request to the specified URL with the given configuration.
     * 
     * @param {string} url - The URL to make the POST request to.
     * @param {axios.AxiosRequestConfig} [config] - Optional Axios configuration.
     * @param {Object} data - The post data
     * @returns {Promise<axios.AxiosResponse>} - A promise that resolves to the Axios response.
     */
    post(url, config = {}, data='') {
        return this.axios.post(url, data, config)
            .then(response => {
                if(this.callback)
                    this.callback(response);
                return response;
            })
            .catch(error => {
                console.error('Error making GET request:', error);
                throw error;
            });
    }

    /**
     * Makes a POST request to the specified URL with the given configuration.
     * 
     * @param {string} url - The URL to make the POST request to.
     * @param {axios.AxiosRequestConfig} [config] - Optional Axios configuration.
     * @param {Object} data - The post data
     * @returns {Object|string} - A promise that resolves to the Axios response.
     */
    postData(url, config = {}, data='') {
        return this.axios.post(url, data, config)
            .then(response => {
                if(this.callback)
                    this.callback(response.data);
                return response.data;
            })
            .catch(error => {
                console.error('Error making GET request:', error);
                throw error;
            });
    }

}

module.exports = RequestHelper;