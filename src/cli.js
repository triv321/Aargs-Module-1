import { runObserver } from './observer.js';
import { logger } from './utils/logger.js';

(async () => {
    // 1. Accept a URL as a command-line argument
    const url = process.argv[2];

    try {
        await runObserver(url);
    } catch (error) {
        logger.error('Failed to run observer:', error);
        process.exit(1);
    }
})();
