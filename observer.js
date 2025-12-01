const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
    // 1. Accept a URL as a command-line argument (default: http://localhost:3000)
    const url = process.argv[2] || 'http://localhost:3000';
    console.log(`Navigating to: ${url}`);

    // 2. Launch a Chromium browser (headless: false)
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // 3. Navigate to the URL and wait for network idle
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        console.log('Page loaded and network is idle.');

        // 4. Scroll to the bottom of the page smoothly
        await autoScroll(page);
        console.log('Scrolled to bottom.');

        // Ensure artifacts directory exists
        const artifactsDir = path.join(__dirname, 'artifacts');
        if (!fs.existsSync(artifactsDir)) {
            fs.mkdirSync(artifactsDir);
        }

        // 5. Capture a full-page screenshot
        const screenshotPath = path.join(artifactsDir, 'baseline.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Screenshot saved to: ${screenshotPath}`);

        // 6. Extract the DOM tree (simplified)
        const domTree = await page.evaluate(() => {
            function getSimplifiedDOM(node) {
                if (!node) return null;

                // Skip text nodes that are just whitespace
                if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
                    return null;
                }

                const obj = {
                    tagName: node.tagName ? node.tagName.toLowerCase() : (node.nodeType === Node.TEXT_NODE ? '#text' : null),
                };

                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.id) obj.id = node.id;
                    if (node.className) obj.className = node.className;

                    // Get bounding box for visual debugging later if needed
                    const rect = node.getBoundingClientRect();
                    obj.rect = {
                        x: rect.x,
                        y: rect.y,
                        width: rect.width,
                        height: rect.height
                    };
                } else if (node.nodeType === Node.TEXT_NODE) {
                    obj.text = node.textContent.trim();
                }

                const children = [];
                if (node.childNodes) {
                    node.childNodes.forEach(child => {
                        const childObj = getSimplifiedDOM(child);
                        if (childObj) {
                            children.push(childObj);
                        }
                    });
                }

                if (children.length > 0) {
                    obj.children = children;
                }

                return obj;
            }
            return getSimplifiedDOM(document.body);
        });

        const domPath = path.join(artifactsDir, 'dom.json');
        fs.writeFileSync(domPath, JSON.stringify(domTree, null, 2));
        console.log(`DOM tree saved to: ${domPath}`);

    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await browser.close();
    }
})();

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
