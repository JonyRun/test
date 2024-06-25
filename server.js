const http = require("http");

const oneTimeLinks = {};//list 



function _line(len) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const alphabetLength = alphabet.length;
  let line = '';
  for (let i = 0; i < len; i++) {
    line += alphabet.charAt(Math.random() * alphabetLength | 0);
  }
}
function ser(req, res) {
  const { method, url } = req;
  if (method === 'POST' && url === '/generate-string') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { value } = JSON.parse(body);
      const id = _line(100);
      oneTimeLinks[id] = { value, active: true };
      const link = `http://yourshop/get-by_id/${id}`;
      console.log( link);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ link }));
    });
    return;
  }
  if (method === 'GET' && url.startsWith('/get-by_id/')) {
    const id = url.split('/').pop();
    const linkData = oneTimeLinks[id];
    if (linkData && linkData.active) {
      linkData.active = false;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ value: linkData.value }));
      return;
    }
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'плохая ссылка' }));
    return;
  }
  res.writeHead(404);
  res.end();
}


const server = http.createServer((req, res) => {  
        ser(req,res);
  });
  
  const port = 8091;
  const host = "192.168.204.58";
  
  server.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}/`);
  });

