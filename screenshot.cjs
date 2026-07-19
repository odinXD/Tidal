const puppeteer = require('puppeteer');
const fs = require('fs');

async function takeScreenshots() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const urls = [
    { url: 'http://localhost:5173/', name: 'market' },
    { url: 'http://localhost:5173/stock/005930', name: 'stock_detail' },
    { url: 'http://localhost:5173/macro', name: 'macro' },
    { url: 'http://localhost:5173/theme', name: 'theme' },
    { url: 'http://localhost:5173/portfolio', name: 'portfolio' },
  ];

  for (const item of urls) {
    try {
      await page.goto(item.url, { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 2000)); // wait for api calls
      await page.screenshot({ path: `screenshot_${item.name}.png` });
      console.log(`Saved screenshot_${item.name}.png`);
    } catch (e) {
      console.error(`Failed ${item.name}`, e);
    }
  }

  await browser.close();
}

takeScreenshots();
