import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

app.get('/scrape', async (req, res) => {
  try {
    const url = 'https://edition.cnn.com/markets/fear-and-greed';

    // Launch a headless browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Go to the URL and wait for the necessary content to load
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for the selector that contains the Fear & Greed index value
    await page.waitForSelector('span.market-fng-gauge__dial-number-value');
    await page.waitForSelector('div.market-fng-gauge__timestamp')

    // Scrape the fear & greed value
    const result = await page.evaluate(() => {
      // Get the Fear & Greed index value
      const fearAndGreedValue = document.querySelector('span.market-fng-gauge__dial-number-value')?.textContent?.trim() || 'N/A';
      const timestamp = document.querySelector('div.market-fng-gauge__timestamp')?.textContent?.trim() || 'N/A';
      return { fearAndGreedValue, timestamp };
    });

    // Close the browser after scraping
    await browser.close();

    // Respond with the scraped data
    res.json({
      fearAndGreedIndex: result.fearAndGreedValue,
      timestamp: result.timestamp
    });

    // Log for debugging
    console.log('Scraped Fear and Greed Value:', result.fearAndGreedValue);
  } catch (error) {
    console.error('Error scraping website:', error);
    res.status(500).json({ message: 'Error occurred while scraping' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
