const puppeteer = require('puppeteer');
const path = require('path');

async function takeScreenshot() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/snap/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    await page.goto('http://10.0.0.157:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    
    const screenshotPath = path.join(__dirname, '..', 'screenshots', `dashboard-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    console.log(`Screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  } catch (error) {
    console.error('Error taking screenshot:', error.message);
    console.error('Full error:', error);
  }
  
  await browser.close();
}

takeScreenshot();
