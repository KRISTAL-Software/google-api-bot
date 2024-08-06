const PuppeteerBrowserClient = require('../BrowserClient/PuppeteerBrowserClient');

module.exports = class Client {
  constructor() {
    this.client = new PuppeteerBrowserClient();
  }

  /**
   * @param {string} url
   * @param {object} [options]
   * @returns {Promise<puppeteer.Page>} - Returns the Page object
   */
  async search(url, options) {
    const browser = await this.client.open();
    try {
      const page = await this.client.newPage(browser);

      // Set user-agent and other headers
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      );
      await page.setViewport({ width: 1366, height: 768 });

      // Navigate to the URL and wait for the page to fully load
      await this.client.goto(page, url, { waitUntil: 'networkidle2' });

      // Perform scrolling
      await this.client.infiniteScroll(page, 1000, 2);

      return page; // Return the Page object
    } catch (error) {
      console.error("Error:", error);
      return { page: null, browser: null }; // Return nulls in case of an error
    } finally {
      if (browser) {
        await this.client.close(browser);
      }
    }
  }

  /**
   * @param {puppeteer.Page} page
   * @returns {Promise<string>} - Returns the content of the page
   */
  async getContent(page) {
    if (!page) {
      throw new Error("Page object is required");
    }
    return page.content();
  }

  /**
   * @param {puppeteer.Page} page
   * @returns {Promise<string>} - Returns the title of the page
   */
  async getTitle(page) {
    if (!page) {
      throw new Error("Page object is required");
    }
    try {
      return await page.title(); // Get the page title
    } catch (error) {
      console.error('Error getting page title:', error);
      return null;
    }
  }

  /**
   * @param {puppeteer.Page} page
   * @param {function} callback - Function to execute in the page context
   * @returns {Promise<any>} - Returns the result of the callback function
   */
  async pageRunner(page, callback) {
    if (!page) {
      throw new Error("Page object is required");
    }
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }

    try {
      return await this.client.evaluate(page, callback);
    } catch (error) {
      console.error('Error during page evaluation:', error);
      return null;
    }
  }
};