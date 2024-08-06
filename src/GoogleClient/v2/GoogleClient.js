const RequestHelper = require('../../utils/Request/Request');


module.exports = class Google 

{
    constructor(API_KEY, cloudID, accessToken, usePageToken = false) {
        if(usePageToken)
        {
            this.pageToken = '';
        }
        this.usePageToken = usePageToken;
        this.version = 'v2';
        this.key = API_KEY;
        this.cloudID = cloudID;
        this.accessToken = accessToken;
        this.headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": API_KEY,
            "Authorization" : `Bearer ${accessToken}`,
            "X-Goog-User-Project" : cloudID,
            "X-Goog-FieldMask": "places.id"
        }
        this.request = new RequestHelper();
    }
    
    async getPlacesData(latitude, longitude, types) 
    {
        let url = `https://places.googleapis.com/v1/places:searchNearby`;
    

        return await this.request.postData(
            url,
            {
                headers: this.headers
            },
            JSON.stringify(
                    {
                        "includedTypes": types,
                        "maxResultCount": 20,
                        "locationRestriction": {
                            "circle": {
                                "center": {
                                    "latitude": latitude,
                                    "longitude": longitude
                                },
                                "radius": 50000
                            }
                        },
                        'page_token': this.pageToken
                    }
                )
        );
    }

    async getPlaces(latitude, longitude, types) 
    {

        return await this.request.post(
            "https://places.googleapis.com/v1/places:searchNearby",
            {
                headers: this.headers
            },
            JSON.stringify({
                "includedTypes": types,
                "maxResultCount": 20,
                "locationRestriction": {
                    "circle": {
                        "center": {
                            "latitude": latitude,
                            "longitude": longitude
                        },
                        "radius": 50000
                    }
                }
            })
        );
    }

    async fetchAPI(url, method, body = "", headers = this.headers) {
        let options = {
            'method': method,
            'headers': headers
        };

        if (method === "POST" && body.length > 0)
            options.body = body;
        try {
            const response = await fetch(url, options);

            if (response.ok)
            return {
                data: await response.json(),
                response: await response,
                status: await response.status
            };
            
            return {
                data: await response.text(),
                response: await response,
                status: await response.status
            };
        }
        catch (error) {
            return {
                data: error,
                response: error,
                status: 500
            };
        }
    }
    
    updatePageToken(tokenValue)
    {
        this.pageToken = tokenValue;
    }
}