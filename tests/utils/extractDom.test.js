import { chromium } from 'playwright';
import { extractDom } from '../../src/utils/extractDom.js';
import http from 'http';

describe('extractDom', () => {
    let browser;
    let context;
    let page;
    let server;
    const PORT = 8081;

    beforeAll(async () => {
        // Start a simple server to serve content for testing
        server = http.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                    <head><title>Test</title></head>
                    <body>
                        <div id="container" class="main">
                            <h1>Title</h1>
                            <p>Text content</p>
                            <span></span> <!-- Empty text node inside likely -->
                        </div>
                    </body>
                </html>
            `);
        });
        await new Promise(resolve => server.listen(PORT, resolve));

        browser = await chromium.launch({ headless: true });
    });

    afterAll(async () => {
        await browser.close();
        server.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterEach(async () => {
        await context.close();
    });

    test('should extract simplified DOM structure correctly', async () => {
        await page.goto(`http://localhost:${PORT}`);

        const dom = await extractDom(page);

        expect(dom).toBeDefined();
        // The root is likely the body or html. extractDom implementation calls getSimplifiedDOM(document.body)
        expect(dom.tagName).toBe('body');
        expect(dom.children).toBeDefined();

        // Find div
        const div = dom.children.find(child => child.tagName === 'div');
        expect(div).toBeDefined();
        expect(div.id).toBe('container');
        expect(div.className).toBe('main');
        expect(div.rect).toBeDefined();

        // Check children of div
        const h1 = div.children.find(child => child.tagName === 'h1');
        expect(h1).toBeDefined();
        // The text node inside h1 might be a child
        expect(h1.children[0].text).toBe('Title');

        const p = div.children.find(child => child.tagName === 'p');
        expect(p).toBeDefined();
        expect(p.children[0].text).toBe('Text content');
    });
});
