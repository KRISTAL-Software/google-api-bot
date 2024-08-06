const Browser = require("../Browser/PuppeteerClient/Client");
const url = require("./Constants/URLs");
const urlParams = require("./Constants/URLParameters");
const finderCallbacks = require("./Constants/FinderCallbacks");
module.exports = class YemekSepeti {
  constructor() {
    this.client = new Browser();
    this.baseURL = "https://www.yemeksepeti.com/";
  }

  async run() {
    try {
      const fullUrl = `${
        this.baseURL
      }${url.restaurantList()}${urlParams.restaurantList(
        undefined,
        undefined,
        "izmir"
      )}`;
      console.log(fullUrl);

      const page = await this.client.search(fullUrl, {});

      if (!page) {
        throw new Error("Failed to open page");
      }

      // Check if the access denied message is present
      const title = await this.client.getTitle(page);
      if (title && title.includes("Access to this page has been denied")) {
        throw new Error("Access denied to the page.");
      }

      // Call the function to be executed in the browser context
      const response = await this.client.pageRunner(
        page,
        finderCallbacks.restaurantFromRestaurantList()
      );

      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
  }
};