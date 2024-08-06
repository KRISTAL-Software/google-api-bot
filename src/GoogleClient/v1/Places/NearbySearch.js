const URLGenerator = require('../../../utils/URL/URLGenerator');
const exception = require('../../../utils/Error/Exception');
const RequestHelper = require('../../../utils/Request/Request');

module.exports = class NearbySearch {
  /**
   *
   * @param {string} outputType 'json' or 'xml'
   */
  constructor(outputType = "json", apiKey = undefined, callback = null) {

    if (!["json", "xml"].includes(outputType)) {
      exception.json({
        error: 'Undefined output type',
        details: 'Output type must be json or xml'
      });
    }
    if(typeof apiKey === 'string')
      this.apiKey = apiKey;

    this.url = `https://maps.googleapis.com/maps/api/place/nearbysearch/${outputType}`;
    this.requestHelper = new RequestHelper(callback);
  }


/**
 * 
 * @param {object} headers 
 * @param {string} location 
 * @param {string|number} radius 
 * @param {string} keyword 
 * @param {string} language 
 * @param {string|number} maxPrice 
 * @param {string|number} minPrice 
 * @param {string} name 
 * @param {string} rankby 
 * @param {string} type 
 * @param {string} apiKey 
 * @returns 
 */
  getPlacesResponse(
    headers = {}, location, radius,  apiKey = this.apiKey, keyword = undefined, 
    language = undefined, maxPrice = undefined, minPrice = undefined, name = undefined, 
    opennow = undefined, rankby = undefined, type = undefined,
  ) {
    const url = this.requestValidator(location, radius, keyword, language, maxPrice, minPrice, opennow, name, rankby, type, apiKey);

    return this.requestHelper.getData(url, headers)
      .then(data => data)
      .catch(error => {
        console.error('Error fetching place data:', error);
        throw error;
      });
  }

/**
 * 
 * @param {object} headers 
 * @param {string} location 
 * @param {string|number} radius 
 * @param {string} keyword 
 * @param {string} language 
 * @param {string|number} maxPrice 
 * @param {string|number} minPrice 
 * @param {string} name 
 * @param {string} rankby 
 * @param {string} type 
 * @param {string} apiKey 
 * @returns 
 */
  getPlaces(
    headers = {}, location, radius,  apiKey = this.apiKey, keyword = undefined, 
    language = undefined, maxPrice = undefined, minPrice = undefined, name = undefined, 
    opennow = undefined, rankby = undefined, type = undefined,
  ) {
    const url = this.requestValidator(location, radius, keyword, language, maxPrice, minPrice, opennow, name, rankby, type, apiKey);

    return this.requestHelper.getData(url, headers)
      .then(data => data)
      .catch(error => {
        console.error('Error fetching place data:', error);
        throw error;
      });
  }


/**
 * Fetch all pages of places data.
 * 
 * @param {object} headers - Optional headers for the request.
 * @param {string} location - The location (latitude,longitude) for the search.
 * @param {string|number} radius - The radius around the location to search within.
 * @param {string} keyword - A term to be matched against all the content that Google has indexed.
 * @param {string} language - The language code, such as 'en' for English.
 * @param {string|number} maxPrice - The maximum price level for the places.
 * @param {string|number} minPrice - The minimum price level for the places.
 * @param {string} name - The name of the place to search for.
 * @param {boolean} opennow - Whether to return only places that are open now.
 * @param {string} rankby - Specifies the order in which results are listed.
 * @param {string} type - The type of place to search for.
 * @param {string} apiKey - The API key for authenticating requests.
 * @returns {Promise<Array<Object>>} - A promise that resolves with an array of all pages of place data.
 */
getAllPlaces(
  headers = {}, location, radius,  apiKey = this.apiKey, keyword = undefined, 
  language = undefined, maxPrice = undefined, minPrice = undefined, name = undefined, 
  opennow = undefined, rankby = undefined, type = undefined
  ) {
    
    let allPlaces = [];
    let nextPageToken = null;
    // Construct the URL with the optional page token
    let url = this.requestValidator(location, radius, keyword, language, maxPrice, minPrice, opennow, name, rankby, type, apiKey);

    const fetchPage = () => {
      let tempUrl = url;
      
      if (nextPageToken) {
        tempUrl += `&pagetoken=${nextPageToken}`;
      }
  
      return this.requestHelper.getData(tempUrl, headers)
        .then(data => {
      
          allPlaces = allPlaces.concat(data.results); // Assuming 'results' contains the places data
          
          // Update the nextPageToken from the response
          nextPageToken = data.next_page_token; // Check the response structure
          
          // If there's a next page token, fetch the next page
          if (nextPageToken) {
            return new Promise(resolve => setTimeout(() => resolve(fetchPage()), 3000)); // 2-second delay
          } else {
            return allPlaces; // Return all places once there are no more pages
          }
        })
        .catch(error => {
          console.error('Error fetching place data:', error);
          throw error;
        });
    };
  
    // Start fetching pages
    return fetchPage();
  }


/**
 * Fetch all pages of place data.
 * 
 * @param {object} headers - Optional headers for the request.
 * @param {string} location - The location (latitude,longitude) for the search.
 * @param {string|number} radius - The radius around the location to search within.
 * @param {string} keyword - A term to be matched against all the content that Google has indexed.
 * @param {string} language - The language code, such as 'en' for English.
 * @param {string|number} maxPrice - The maximum price level for the places.
 * @param {string|number} minPrice - The minimum price level for the places.
 * @param {string} name - The name of the place to search for.
 * @param {boolean} opennow - Whether to return only places that are open now.
 * @param {string} rankby - Specifies the order in which results are listed.
 * @param {string} type - The type of place to search for.
 * @param {string} apiKey - The API key for authenticating requests.
 * @returns {Promise<Array<Object>>} - A promise that resolves with an array of all pages of place data.
 */
getAllPlaceResponses(
  headers = {}, location, radius,  apiKey = this.apiKey, keyword = undefined, 
  language = undefined, maxPrice = undefined, minPrice = undefined, name = undefined, 
  opennow = undefined, rankby = undefined, type = undefined,
  ) {
    let responses = [];
    let nextPageToken = null;
    // Construct the URL with the optional page token
    let url = this.requestValidator(location, radius, keyword, language, maxPrice, minPrice, opennow, name, rankby, type, apiKey);
    
    const fetchPage = () => {
      
      let tempUrl = url;
      
      if (nextPageToken) {
        tempUrl += `&pagetoken=${nextPageToken}`;
      }
  
      return this.requestHelper.get(tempUrl, headers)
        .then(response => {
          responses.push(response); // Push the response to the array
  
          // Update the nextPageToken from the response
          nextPageToken = response.data.next_page_token;
          
          // If there's a next page token, fetch the next page
          if (nextPageToken) {
            return new Promise(resolve => setTimeout(() => resolve(fetchPage()), 2000)); // 2-second delay Recursive call
          } else {
            return responses; // Return all responses once there are no more pages
          }
        })
        .catch(error => {
          console.error('Error fetching place data:', error);
          throw error;
        });
    };
  
    // Start fetching pages
    return fetchPage();
  }
  



/**
 * Validates and constructs the URL for the API request.
 * @param {string} location 
 * @param {string|number} radius 
 * @param {string} keyword 
 * @param {string} language 
 * @param {string|number} maxPrice missing
 * @param {string|number} minPrice missing
 * @param {string} name 
 * @param {string} rankby missing
 * @param {string} type 
 * @param {string} apiKey 
 * @returns 
 */
  requestValidator(
    location, radius, keyword = undefined, 
    language = undefined, maxPrice = undefined, minPrice = undefined, name = undefined, 
    opennow = undefined, rankby = undefined, types = undefined,apiKey = this.apiKey
  ) {
    if (!location || !radius || !apiKey) {
      throw new Error('Location, radius, and apiKey are required.');
    }

    if (apiKey && typeof apiKey !== 'string') {
      exception.json({
        error: `Undefined type for apiKey => ${typeof apiKey}`,
        details: "Type of apiKey must be string"
      });
    }

    if (keyword && typeof keyword !== 'string') {
      exception.json({
        error: `Undefined type for keyword => ${typeof keyword}`,
        details: "Type of keyword must be boolean true or false"
      });
    }

    if (name && typeof name !== 'string') {
        exception.json({
          error: `Undefined type for name => ${typeof name}`,
          details: "Type of name must be boolean true or false"
        });
      }

    if (language && !this.languageCodeValidator(language)) {
      exception.json({
        error: "Undefined language code",
        details: `${language} is not supported language code.`
      });
    }

    if(location && !this.locationValidator(location))
        exception.json({
                error: `Location form in not valid`,
                details: 'Location format must be like this => 12.1021,-213.2353323'
        });

    return URLGenerator.URLParameterGenerator(this.url, 
      [
        ['location', location], 
        ['language', language], 
        ['radius', radius],
        ['type', types], 
        ['opennow', opennow],
        ['keyword', keyword],
        ['key', apiKey]
      ]
    );
  }

  /**
   * 
   * @param {string} location 
   */
  locationValidator(location)
  {
    if(location && typeof location !== 'string')
        exception.json({
            error: `Undefined type for location => ${typeof location}`,
            details: "Type of location must be boolean true or false"
        });


    const rg = new RegExp(/^[-+]?\d+\.\d+,\s*[-+]?\d+\.\d+$/);
    
    return rg.test(location);
  }



  /**
   * Validates the language code.
   * 
   * @param {string} languageCode 
   * @returns {boolean}
   */
  languageCodeValidator(languageCode) {
    if (typeof languageCode !== 'string') {
      exception.json({
        error: "Undefined type of language code.",
        details: "The language code must be type of string."
      });
    }

    return [
      "af", "sq", "am", "ar", "hy", "az", "eu", "be", "bn", "bs", "bg", "my", "ca", "zh", "zh-CN", "zh-HK", 
      "zh-TW", "hr", "cs", "da", "nl", "en", "en-AU", "en-GB", "et", "fa", "fi", "fil", "fr", "fr-CA", "gl", 
      "ka", "de", "el", "gu", "iw", "hi", "hu", "is", "id", "it", "ja", "kn", "kk", "km", "ko", "ky", "lo", 
      "lv", "lt", "mk", "ms", "ml", "mr", "mn", "ne", "no", "pl", "pt", "pt-BR", "pt-PT", "pa", "ro", "ru", 
      "sr", "si", "sk", "sl", "es", "es-419", "sw", "sv", "ta", "te", "th", "tr", "uk", "ur", "uz", "vi", "zu"
    ].includes(languageCode);
  }


    /**
   * Validates the types array to ensure all types are supported.
   * 
   * @param {Array<string>} types 
   * @returns {boolean}
   */
    typeValidator(types = []) {
        if (!Array.isArray(types)) {
          exception.json({
            error: "Type of types unsupported",
            details: "Type of types must be an array"
          });
        }
    
        if (types.length < 1) {
          exception.json({
            error: "Types is empty.",
            details: "Types must include at least one field."
          });
        }
        
        const validTypes = [
            "airport", "amusement_park", "aquarium", "art_gallery", "atm", "bakery", "bank", "bar", "beauty_salon", "bicycle_store",
            "book_store", "bowling_alley", "bus_station", "cafe", "campground", "car_dealer", "car_rental", "car_repair", "car_wash",
            "casino", "cemetery", "church", "city_hall", "clothing_store", "convenience_store", "courthouse", "dentist", "department_store",
            "doctor", "drugstore", "electrician", "electronics_store", "embassy", "fire_station", "florist", "funeral_home", "furniture_store",
            "gas_station", "gym", "hair_care", "hardware_store", "hindu_temple", "home_goods_store", "hospital", "insurance_agency", "jewelry_store",
            "laundry", "lawyer", "library", "light_rail_station", "liquor_store", "local_government_office", "locksmith", "lodging", "meal_delivery",
            "meal_takeaway", "mosque", "movie_rental", "movie_theater", "moving_company", "museum", "night_club", "painter", "park", "parking",
            "pet_store", "pharmacy", "physiotherapist", "plumber", "police", "post_office", "primary_school", "real_estate_agency", "restaurant",
            "roofing_contractor", "rv_park", "school", "secondary_school", "shoe_store", "shopping_mall", "spa", "stadium", "storage", "store",
            "subway_station", "supermarket", "synagogue", "taxi_stand", "tourist_attraction", "train_station", "transit_station", "travel_agency",
            "university", "veterinary_care", "zoo"
        ];
        
        return types.every(type => validTypes.includes(type));
      }
};
