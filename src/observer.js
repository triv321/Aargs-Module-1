import { chromium } from 'playwright';
import { CONFIG } from './config.js';
import { logger } from './utils/logger.js';
import { autoScroll } from './utils/scroll.js';
import { extractDom } from './utils/extractDom.js';
import { saveArtifacts } from './utils/saveArtifacts.js';

(async () => {
    // 1. Accept a URL as a command-line argument
    const url = process.argv[2] || CONFIG.DEFAULT_URL;
    logger.info(`Navigating to: ${url}`);

    // 2. Launch a Chromium browser
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // 3. Navigate to the URL and wait for network idle
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: CONFIG.TIMEOUT });
        logger.info('Page loaded and network is idle.');

        // 4. Scroll to the bottom of the page smoothly
        await autoScroll(page);
        logger.info('Scrolled to bottom.');

        // 5. Extract the DOM tree
        const domTree = await extractDom(page);

        // 6. Save artifacts (screenshot + DOM JSON)
        await saveArtifacts(page, domTree);

    } catch (error) {
        logger.error('An error occurred:', error);
    } finally {
        await browser.close();
    }
})();
