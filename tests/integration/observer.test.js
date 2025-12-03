import { runObserver } from '../../src/observer.js';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { CONFIG } from '../../src/config.js';

describe('Observer Integration', () => {
    let server;
    const PORT = 8082;
    const testUrl = `http://localhost:${PORT}`;

    beforeAll(async () => {
        // Mock server
        server = http.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            // Enough content to require scrolling
            let content = '';
            for(let i=0; i<50; i++) {
                content += `<p>Paragraph ${i}</p>`;
            }
            res.end(`<html><body>${content}</body></html>`);
        });
        await new Promise(resolve => server.listen(PORT, resolve));

        // Ensure artifacts dir exists
        if (!fs.existsSync(CONFIG.ARTIFACTS_DIR)) {
            fs.mkdirSync(CONFIG.ARTIFACTS_DIR, { recursive: true });
        }
    });

    afterAll(async () => {
        server.close();
    });

    test('should run observer, scroll, and save artifacts', async () => {
        const result = await runObserver(testUrl);

        expect(result.success).toBe(true);
        expect(result.domTree).toBeDefined();
        expect(result.domTree.tagName).toBe('body');

        // Check artifacts
        // Since filenames have timestamps, we look for recent files created by this run
        // We can just check if *any* files exist that match the pattern, assuming clean state or just existence is enough signal for now.
        const files = fs.readdirSync(CONFIG.ARTIFACTS_DIR);

        const pngFiles = files.filter(f => f.endsWith('.png') && f.startsWith('baseline_'));
        const jsonFiles = files.filter(f => f.endsWith('.json') && f.startsWith('dom_'));

        expect(pngFiles.length).toBeGreaterThan(0);
        expect(jsonFiles.length).toBeGreaterThan(0);

        // Verify the content of the latest JSON
        const latestJson = jsonFiles.sort().pop();
        const content = JSON.parse(fs.readFileSync(path.join(CONFIG.ARTIFACTS_DIR, latestJson), 'utf8'));
        expect(content.tagName).toBe('body');

        // We added 50 paragraphs. The DOM extractor should pick them up.
        // Flatten or search recursively if needed, but they should be direct children of body in this simple case
        // Wait, body children might include whitespace #text nodes depending on browser parsing, but we filtered them in extractDom
        const pTags = content.children.filter(c => c.tagName === 'p');
        expect(pTags.length).toBe(50);
    }, 60000); // Increase timeout for scrolling
});
