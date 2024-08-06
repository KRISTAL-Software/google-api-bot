const RequestHelper = require('./Request');
const Token = require('./Token');

const mealTypes = ["american_restaurant", "bakery", "bar", "barbecue_restaurant", "brazilian_restaurant", "breakfast_restaurant", "brunch_restaurant", "cafe", "chinese_restaurant", "coffee_shop", "fast_food_restaurant", "french_restaurant", "greek_restaurant", "hamburger_restaurant", "ice_cream_shop", "indian_restaurant", "indonesian_restaurant", "italian_restaurant", "japanese_restaurant", "korean_restaurant", "lebanese_restaurant", "meal_delivery", "meal_takeaway", "mediterranean_restaurant", "mexican_restaurant", "middle_eastern_restaurant", "pizza_restaurant", "ramen_restaurant", "restaurant", "sandwich_shop", "seafood_restaurant", "spanish_restaurant", "steak_house", "sushi_restaurant", "thai_restaurant", "turkish_restaurant", "vegan_restaurant", "vegetarian_restaurant", "vietnamese_restaurant"];


/**
 * @class Google API Helper Class
 * @constructor 
 */
class Google
{

    /**
     * 
     * @param {string} api_key 
     */
    constructor(api_key, token = null)
    {
        this.version = 'v1';
        this.key = api_key;
        this.token = new Token();
        if (token === null)
            this.sessionTokenInit();
        else
            this.sessionToken = token;
        this.request = new RequestHelper();
    }

    /**
     * 
     * @returns {string}
     */
    sessionTokenInit() {
        this.sessionToken = this.token.randomBase64(20);
    };


    
    


    /**
     * 
     * @param {*} place_id 
     * @returns 
     */

    placesDetail(place_id) {
        return this.request.getData(`https://places.googleapis.com/v1/places/${place_id}`);
    };

    placesDetailNew(place_id) {
        return this.request.getData(`https://places.googleapis.com/v1/places/${place_id}`,
            {
                headers: {
                    'X-Goog-Api-Key': this.key,
                    'X-Goog-FieldMask': '*'   
                }
            }
        );
    };

    async placesAutoCompleteNew(input='', sessionToken=this.sessionToken, includedPrimaryTypes=[], regionCode=null)
    {
        const data =
        {
            input: input,
            sessionToken: sessionToken,
            includedPrimaryTypes: includedPrimaryTypes,
            regionCode: regionCode
        };

        const response = await this.request.post(
            `https://places.googleapis.com/v1/places:autocomplete`,
            {
                headers:
                {
                    'Content-Type' : 'application/json',
                    'X-Goog-Api-Key': this.key,
                    'X-Goog-FieldMask' : '*'
                }
            },
            data
        );
        return response;
    }

    async placesNearbySearchNew()
    {
        const data = {
            includedTypes: mealTypes,
            locationRestriction: 
            {
                circle:
                {
                    center:
                    {
                        latitude: 38.4333,
                        longitude: 27.15
                    },
                    radius: 50000.0
                }
            }
        };

        return await this.request.post(
            `https://places.googleapis.com/v1/places:searchNearby`,
            {
                headers:
                {
                    'Content-Type' : 'application/json',
                    'X-Goog-Api-Key': this.key,
                    'X-Goog-FieldMask' : '*'
                }
            },
            data
        );
    };
}

module.exports = Google;