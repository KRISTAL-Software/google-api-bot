const NearbySearch = require("../../../GoogleClient/v1/Places/NearbySearch");
const Directory = require("../../../utils/Directory/Directory");
const nullValidator = require("../../../utils/Validator/NullValidator");
const exception = require("../../../utils/Error/Exception");
const fs = require("fs");
const path = require('path');

/**
 * Handles fetching and writing place data from Google Places API using NearbySearch.
 * 
 * @class
 */
module.exports = class NearbySearchClientWriter {
  /**
   * Creates an instance of NearbySearchClientWriter.
   * 
   * @param {string} targetDir - The directory where place data files will be saved.
   * @param {string} apiKey - The API key used for authenticating requests to Google Places API.
   * @param {string} output - The file extension for saved place data files (e.g., 'json').
   * 
   * @throws {Error} If the target directory is undefined or null.
   */
  constructor(targetDir, apiKey, output) {
    if (!(targetDir && nullValidator.nonNull(targetDir))) {
      exception.json({
        error: "Target dir undefined",
        details: "Target directory must be specified",
      });
    }
    this.output = output;
    this.apiKey = apiKey;
    this.targetDir = targetDir;
    Directory.ensureDirectoryExists(this.targetDir);

    this.nearbySearch = new NearbySearch(
      this.output,
      this.apiKey,
      (responseData) => {
        /**
         * Writes the place data to files in the target directory.
         * 
         * @param {Array<Object>} data - The place data to be written.
         */
        const write = (data) => {
          data.forEach((d) => {
            try {
              fs.writeFileSync(
                path.join(this.targetDir, `${d.place_id}.${this.output}`),
                JSON.stringify(d, null, 2),
                {
                  encoding: 'utf-8'
                }
              );
            } catch (error) {
              exception.json({
                error: error,
              });
            }
          });
        };

        if (responseData.data) {
          responseData = responseData.data.results;
        }

        if (!responseData.data && responseData.results) {
          responseData = responseData.results;
        }

        write(responseData);
      }
    );
  }

  /**
   * Fetches places data from Google Places API and writes it to files in the target directory.
   * 
   * @param {string} location - The location (latitude,longitude) for the search.
   * @param {string} [radius='50000'] - The radius around the location to search within, default is '50000' meters.
   * 
   * @returns {Promise<Array<Object>>} - A promise that resolves with an array of all pages of place data.
   */
  fetchPlaces(location, radius = '20000') {
    return this.nearbySearch.getAllPlaces(
      {}, 
      location, 
      radius, 
      this.apiKey, 
      undefined, 
      'tr', 
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );
  }

  /**
   * Fetches place responses from Google Places API and writes them to files in the target directory.
   * 
   * @param {string} location - The location (latitude,longitude) for the search.
   * @param {string} [radius='5000'] - The radius around the location to search within, default is '5000' meters.
   * 
   * @returns {Promise<Array<Object>>} - A promise that resolves with an array of all pages of place responses.
   */
  fetchPlaceResponses(location, radius = '5000') {
    return this.nearbySearch.getAllPlaceResponses({}, location, radius);
  }
};


/**
 * @deprecated
 * This filter returns ZERO result
 * 
 ** Response example: 
      * {
            "html_attributions": [],
            "results": [],
            "status": "ZERO_RESULTS"
        }
 * @deprecated
 */
const ALL_PLACES = [
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


const FOOD_AND_DINING_PLACES_2 = [
  "restaurant",               // Places where meals are prepared and served
  "cafe",                     // Casual establishments serving coffee, tea, and light meals
  "bakery",                   // Shops specializing in baked goods such as bread and pastries
  "meal_delivery",            // Services that deliver meals to homes
  "meal_takeaway",            // Places where food can be ordered to take out
  "supermarket",              // Large stores that sell groceries and other household items
  "convenience_store",        // Small stores offering everyday items including some food
  "liquor_store",             // Stores specializing in alcoholic beverages
  "bar",                      // Establishments serving drinks, often with snacks or light meals
  "night_club",               // Venues for nighttime entertainment, usually with food and drinks
  "casino",                   // Gambling establishments that often include dining options
  "food",                     // General category for food-related places
  "market",                   // General term for places where food is sold, often in bulk or specialty markets
  "food_court",               // A section in a mall or building with multiple food vendors
  //"grocery_or_supermarket",   // Stores that sell food and other items; overlaps with supermarket
  //"butcher",                  // Shops specializing in meat products
  //"fishmonger",               // Shops specializing in fish and seafood
  //"deli",                     // Delicatessens offering prepared foods and groceries
  //"greengrocer",              // Shops specializing in fresh fruits and vegetables
  //"winery",                   // Places where wine is produced and often available for tasting
  //"brewery",                  // Places where beer is brewed, often with a bar or restaurant
  //"distillery",               // Places where spirits are produced, often with tasting rooms
  "ice_cream_parlor",         // Shops specializing in ice cream and frozen desserts
  "pizzeria",                 // Establishments specializing in pizza
  "fast_food_restaurant",     // Restaurants offering quick-service meals
  "street_food",              // Vendors selling food from carts or stalls, often on the street
  "food_truck",               // Mobile vendors offering a range of food items
  "buffet",                   // Restaurants offering a variety of dishes served in a self-serve style
  "tea_house",                // Establishments specializing in serving tea and related light meals
  "wine_bar",                 // Bars focusing on serving a wide range of wines
  "tavern",                   // Establishments serving alcoholic beverages and meals
  "pub",                      // Casual places serving drinks and often meals
  "restaurant_cafe",          // Places combining aspects of both a restaurant and a cafe
  "cookery_school",           // Places offering cooking classes and demonstrations
  "food_bank",                // Organizations distributing food to those in need
  "ethnic_market",            // Markets specializing in foods from specific cultures or regions
  "organic_store",            // Stores specializing in organic and natural foods
  "health_food_store",        // Stores offering health-focused and dietary foods
  "dessert_shop",             // Establishments specializing in sweets and desserts
  "sushi_bar",                // Establishments specializing in sushi
  "kitchen_supply_store"      // Stores selling kitchen equipment and utensils, often with food items
];


const FOOD_AND_DINING_PLACES = [
  "restaurant",
  "cafe",
  "bakery",
  "meal_delivery",
  "meal_takeaway",
  "supermarket",
  "convenience_store",
  "liquor_store",
  "bar",
  "night_club",
  "casino", // Although not strictly food, it's often related to dining and entertainment
  "food", // General category for food-related places
  "market", // General category for food markets
]


const FOOD_AND_DINING = [
  "restaurant",
  "cafe",
  "bakery",
  "meal_delivery",
  "meal_takeaway",
  "supermarket",
  "convenience_store",
  "liquor_store",
  "bar",
  "night_club",
  "casino",
];

const ACCOMMODATION = [
  "lodging",
  "hotel",
  "motel",
  "rv_park",
  "campground",
  "hostel",
  "guest_house",
];

// Example usage in code
function isFoodOrDiningPlace(type) {
  return FOOD_AND_DINING.includes(type);
}

function isAccommodationPlace(type) {
  return ACCOMMODATION.includes(type);
}

// Test the function
const placeType = "restaurant";
if (isFoodOrDiningPlace(placeType)) {
  console.log(`${placeType} is a food or dining place.`);
} else if (isAccommodationPlace(placeType)) {
  console.log(`${placeType} is an accommodation place.`);
} else {
  console.log(`${placeType} is not in the predefined categories.`);
}
