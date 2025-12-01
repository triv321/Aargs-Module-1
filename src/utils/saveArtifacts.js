import fs from 'fs';
import path from 'path';
import { CONFIG } from '../config.js';
import { logger } from './logger.js';

function getTimestamp() {
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
    return `${date}_${time}`;
}

export async function saveArtifacts(page, domTree) {
    if (!fs.existsSync(CONFIG.ARTIFACTS_DIR)) {
        fs.mkdirSync(CONFIG.ARTIFACTS_DIR, { recursive: true });
    }

    const timestamp = getTimestamp();

    // Save Screenshot
    const screenshotFilename = `baseline_${timestamp}.png`;
    const screenshotPath = path.join(CONFIG.ARTIFACTS_DIR, screenshotFilename);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    logger.info(`Screenshot saved to: ${screenshotPath}`);

    // Save DOM JSON
    const domFilename = `dom_${timestamp}.json`;
    const domPath = path.join(CONFIG.ARTIFACTS_DIR, domFilename);
    fs.writeFileSync(domPath, JSON.stringify(domTree, null, 2));
    logger.info(`DOM tree saved to: ${domPath}`);
}
