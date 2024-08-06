const URLGenerator = require('../../../utils/URL/URLGenerator');
const exception = require('../../../utils/Error/Exception');
const RequestHelper = require('../../../utils/Request/Request');

module.exports = class PlaceDetails {
  /**
   *
   * @param {string} outputType 'json' or 'xml'
   */
  constructor(outputType = "json") {
    if (!["json", "xml"].includes(outputType)) {
      exception.json({
        error: 'Undefined output type',
        details: 'Output type must be json or xml'
      });
    }
    this.url = `https://maps.googleapis.com/maps/api/place/details/${outputType}`;
    this.requestHelper = new RequestHelper();
  }

  /**
   * 
   * @param {string} placeId 
   * @param {string} sessionToken
   * @param {Array<string>} fields 
   * @param {string} language 
   * @param {string} region 
   * @param {string} reviewsSort 
   * @param {boolean} reviewsNoTranslations
   * @returns {Promise<axios.AxiosResponse>}
   */
  getPlaceResponse(
    headers = {}, placeId = undefined, sessionToken = undefined, 
    fields = ['place_id'], language = undefined, region = undefined,
    reviewsSort = undefined, reviewsNoTranslations = undefined, apiKey = undefined
  ) {
    const url = this.requestValidator(placeId, sessionToken, fields, language, region, reviewsSort, reviewsNoTranslations, apiKey);

    return this.requestHelper.get(url, headers)
      .then(response => response)
      .catch(error => {
        console.error('Error fetching place response:', error);
        throw error;
      });
  }

  /**
   * 
   * @param {string} placeId 
   * @param {string} sessionToken
   * @param {Array<string>} fields 
   * @param {string} language 
   * @param {string} region 
   * @param {string} reviewsSort 
   * @param {boolean} reviewsNoTranslations
   * @returns {Promise<Object|string>}
   */
  getPlace(
    headers = {}, placeId = undefined, sessionToken = undefined, 
    fields = ['place_id'], language = undefined, region = undefined,
    reviewsSort = undefined, reviewsNoTranslations = undefined, apiKey = undefined
  ) {
    const url = this.requestValidator(placeId, sessionToken, fields, language, region, reviewsSort, reviewsNoTranslations, apiKey);

    return this.requestHelper.getData(url, headers)
      .then(data => data)
      .catch(error => {
        console.error('Error fetching place data:', error);
        throw error;
      });
  }

  /**
   * Validates and constructs the URL for the API request.
   * 
   * @param {string} placeId 
   * @param {string} sessionToken
   * @param {Array<string>} fields 
   * @param {string} language 
   * @param {string} region 
   * @param {string} reviewsSort 
   * @param {boolean} reviewsNoTranslations
   * @param {string} apiKey 
   * @returns {string}
   */
  requestValidator(
    placeId = undefined, sessionToken = undefined, 
    fields = ['place_id'], language = undefined, region = undefined,
    reviewsSort = undefined, reviewsNoTranslations = undefined, apiKey = undefined
  ) {
    if (apiKey && typeof apiKey !== 'string') {
      exception.json({
        error: `Undefined type for apiKey => ${typeof apiKey}`,
        details: "Type of apiKey must be string"
      });
    }

    if (reviewsNoTranslations && typeof reviewsNoTranslations !== 'boolean') {
      exception.json({
        error: `Undefined type for reviewsNoTranslations => ${typeof reviewsNoTranslations}`,
        details: "Type of reviewsNoTranslations must be boolean true or false"
      });
    }

    if (!this.fieldValidator(fields)) {
      exception.json({
        error: "Undefined field",
        details: "Fields include unsupported field."
      });
    }
    if (language && !this.languageCodeValidator(language)) {
      exception.json({
        error: "Undefined language code",
        details: `${language} is not supported language code.`
      });
    }

    if (!placeId) {
      exception.json({
        error: 'Undefined place id',
        details: 'Place ID must be valid and belongs to one of Google Places'
      });
    }

    return URLGenerator.URLParameterGenerator(this.url, 
      [
        ['place_id', placeId], 
        ['language', language], 
        ['region', region], 
        ['reviews_sort', reviewsSort],
        ['reviews_no_translations', reviewsNoTranslations],
        ['key', apiKey]
      ]
    );
  }

  /**
   * Validates the fields array to ensure all fields are supported.
   * 
   * @param {Array<string>} fields 
   * @returns {boolean}
   */
  fieldValidator(fields = []) {
    if (!Array.isArray(fields)) {
      exception.json({
        error: "Type of fields unsupported",
        details: "Type of fields must be an array"
      });
    }

    if (fields.length < 1) {
      exception.json({
        error: "Fields is empty.",
        details: "Fields must include at least one field."
      });
    }
    
    const validFields = [
      "address_components", "adr_address", "business_status", "formatted_address",
      "geometry", "icon", "icon_mask_base_uri", "icon_background_color", "name",
      "permanently_closed", "photo", "place_id", "plus_code", "type", "url", "utc_offset", 
      "vicinity", "wheelchair_accessible_entrance", "current_opening_hours", "formatted_phone_number", 
      "international_phone_number", "opening_hours", "secondary_opening_hours", "website",
      "curbside_pickup", "delivery", "dine_in", "editorial_summary", "price_level", "rating", 
      "reservable", "reviews", "serves_beer", "serves_breakfast", "serves_brunch", "serves_dinner", 
      "serves_lunch", "serves_vegetarian_food", "serves_wine", "takeout", "user_ratings_total"
    ];

    return fields.every(field => validFields.includes(field));
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
   * Validates the sort option for reviews.
   * 
   * @param {string} reviewsSort 
   * @returns {boolean}
   */
  shortingMethodValidation(reviewsSort) {
    return ['most_relevant', 'newest'].includes(reviewsSort);
  }
};
