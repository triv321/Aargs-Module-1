export async function extractDom(page) {
    return await page.evaluate(() => {
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
}
