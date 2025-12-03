import { chromium } from 'playwright';
import { CONFIG } from './config.js';
import { logger } from './utils/logger.js';
import { autoScroll } from './utils/scroll.js';
import { extractDom } from './utils/extractDom.js';
import { saveArtifacts } from './utils/saveArtifacts.js';
import { fileURLToPath } from 'url';

export async function runObserver(url = CONFIG.DEFAULT_URL) {
    logger.info(`Navigating to: ${url}`);

    // Launch a Chromium browser
    // Note: We use headless: true if not specified, but let's stick to config or default.
    // The original code had headless: false.
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Navigate to the URL and wait for network idle
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: CONFIG.TIMEOUT });
        logger.info('Page loaded and network is idle.');

        // Scroll to the bottom of the page smoothly
        await autoScroll(page);
        logger.info('Scrolled to bottom.');

        // Extract the DOM tree
        const domTree = await extractDom(page);

        // Save artifacts (screenshot + DOM JSON)
        await saveArtifacts(page, domTree);

        return { success: true, domTree };

    } catch (error) {
        logger.error('An error occurred:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Check if the script is being run directly
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
    (async () => {
        const url = process.argv[2];
        try {
            await runObserver(url);
        } catch (error) {
            process.exit(1);
        }
    })();
}
