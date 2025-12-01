const http = require('http');
const fs = require('fs');
const path = require('path');

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Page</title>
    <style>
        body { font-family: sans-serif; height: 2000px; background: linear-gradient(to bottom, #fff, #eee); }
        .content { padding: 20px; }
        #footer { position: absolute; bottom: 20px; }
    </style>
</head>
<body>
    <div class="content">
        <h1>Hello Aark</h1>
        <p>This is a test page.</p>
    </div>
    <div id="footer">Footer Content</div>
</body>
</html>
`;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
});

server.listen(8080, () => {
    console.log('Server running at http://localhost:8080');
});
