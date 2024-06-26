const http = require('http');

const oneTimeLinks = {}; //list now

function _line(len) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const alphabetLength = alphabet.length;
    let line = '';
    for (let i = 0; i < len; i++) {
        line += alphabet.charAt((Math.random() * alphabetLength) | 0);
    }
    return line;
}
function ser(req, res) {
    const { method, url } = req;
    if (method !== 'POST' || url !== '/generate-string') {
        if (method !== 'GET' || !url.includes('/get-by_id/')) {
            res.writeHead(501);
            res.end();
            return;
        }
    }

    if (method === 'POST') {
        let body = '';
        req.on('data', (chunk) => { body += chunk.toString(); });
        req.on('end', () => {
            const { key } = JSON.parse(body);
            const id = _line(100);
            oneTimeLinks[id] = { key, active: true };
            const link = `http://192.168.173.58/get-by_id/${id}`;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ link }));
        });
        return
    } 
        const id = url.split('/').pop();
        const linkData = oneTimeLinks[id];
        console.log(linkData.key);
        if (linkData && linkData.active) {
            linkData.active = false;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ key: linkData.key }));
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'плохая ссылка' }));
        }
    
}

const server = http.createServer((req, res) => {
    console.log('sd');
    ser(req, res);
});

const port = 8092;
const host = 'localhost';

server.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}/`);
});
