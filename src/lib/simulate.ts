import { TrendRawData, SentimentBreakdown } from './types';

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSentiment(): SentimentBreakdown {
  const positive = randInt(45, 75);
  const negative = randInt(5, 20);
  const neutral = 100 - positive - negative;
  return { positive, neutral, negative };
}

const categories = [
  'Adaptogens', 'Beauty & Skin', 'Digestive Wellness', 'Functional Beverages',
  'Sports Nutrition', 'Superfoods', 'Vitamins & Minerals', 'Mental Wellness',
];

const priceBands = ['₹200–₹500', '₹400–₹800', '₹500–₹1000', '₹800–₹1500', '₹300–₹700'];

export function simulateTrendData(keyword: string): TrendRawData {
  const m1 = randInt(800, 5000);
  const m2 = Math.round(m1 * (1 + randInt(15, 60) / 100));
  const m3 = Math.round(m2 * (1 + randInt(10, 50) / 100));
  const m4 = Math.round(m1 * (1 - randInt(0, 20) / 100));
  const m5 = Math.round(m4 * (1 + randInt(5, 30) / 100));
  const m6 = Math.round(m5 * (1 + randInt(5, 25) / 100));

  return {
    keyword,
    month1: m1,
    month2: m2,
    month3: m3,
    month4: m4,
    month5: m5,
    month6: m6,
    reddit_mentions: randInt(80, 600),
    amazon_search: randInt(1500, 8000),
    youtube_mentions: randInt(200, 1200),
    instagram_mentions: randInt(300, 2000),
    amazon_product_count: randInt(20, 300),
    avg_price_band: priceBands[randInt(0, priceBands.length - 1)],
    category: categories[randInt(0, categories.length - 1)],
    reddit_sentiment: generateSentiment(),
    youtube_sentiment: generateSentiment(),
    instagram_sentiment: generateSentiment(),
    isSimulated: true,
  };
}
