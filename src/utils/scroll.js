import { CONFIG } from '../config.js';

export async function autoScroll(page) {
    await page.evaluate(async ({ distance, interval }) => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, interval);
        });
    }, { distance: CONFIG.SCROLL.DISTANCE, interval: CONFIG.SCROLL.INTERVAL });
}
