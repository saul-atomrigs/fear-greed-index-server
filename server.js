import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

app.get('/scrape', async (req, res) => {
  try {
    const url = 'https://edition.cnn.com/markets/fear-and-greed';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const fearAndGreedValue = $('.market-fng-gauge__dial-number-value').text();

    if (!fearAndGreedValue) {
      throw new Error('Unable to scrape the Fear and Greed index value.');
    }

    res.json({ fearAndGreedIndex: fearAndGreedValue });
    console.log('Scraped Value:', fearAndGreedValue);
  } catch (error) {
    console.error('Error scraping website:', error);
    res.status(500).json({ message: 'Error occurred while scraping' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
