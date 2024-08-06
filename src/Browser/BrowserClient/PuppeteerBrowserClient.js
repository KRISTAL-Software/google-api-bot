const puppeteer = require('puppeteer');

module.exports = class PuppeteerBrowserClient {
  /**
   * @returns {Promise<puppeteer.Browser>}
   */
  async open() {
    return puppeteer.launch({ headless: false }); // Launch browser in non-headless mode for debugging
  }

  /**
   * @param {puppeteer.Browser} browser
   * @returns {Promise<puppeteer.Page>}
   */
  async newPage(browser) {
    return browser.newPage();
  }

  /**
   * @param {puppeteer.Page} page
   * @param {string} url
   * @param {object} [options]
   * @returns {Promise<puppeteer.Response>}
   */
  async goto(page, url, options) {
    return page.goto(url, options);
  }

  /**
   * @param {puppeteer.Browser} browser
   */
  async close(browser) {
    await browser.close();
  }

  /**
   * @param {puppeteer.Page} page
   * @param {function} fn - Function to execute in the page context
   * @returns {Promise<any>}
   */
  async evaluate(page, fn) {
    return page.evaluate(fn);
  }

  /**
   * Scrolls down the page repeatedly to simulate infinite scrolling.
   * @param {puppeteer.Page} page - The Puppeteer page object.
   * @param {number} scrollDelay - The delay between scrolls in milliseconds.
   * @param {number} maxScrolls - The maximum number of scrolls to perform.
   * @returns {Promise<void>}
   */
  async infiniteScroll(page, scrollDelay = 1000, maxScrolls = 2) {
    function delay(time) {
      return new Promise(resolve => setTimeout(resolve, time));
    }

    for (let i = 0; i < maxScrolls; i++) {
      try {
        await page.evaluate(() => {
          window.scrollBy(0, window.innerHeight);
        });
        await delay(scrollDelay); // Use custom delay function
      } catch (error) {
        console.error('Error during scrolling:', error);
        break; // Exit loop on error
      }
    }
  }
};