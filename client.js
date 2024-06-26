const http = require('http');

function pass_req(path, method, headers, data) {
    let options = {
        hostname: 'localhost',
        port: 8092,
        path,
        method,
        headers,
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            console.log(`statusCode: ${res.statusCode}`);
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                console.log('Response from server:');
                console.log(responseData);
                resolve(responseData);
            });
        });

        req.on('error', (error) => {
            console.error(error);
            reject(error);
        });
        if (method == 'POST') req.write(data);
        req.end();
    });
}

const data = JSON.stringify({ key: 'value' });
const url = '/generate-string';
let headers = {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
};
pass_req(url, 'POST', headers, data)
    .then(async (responseData) => {
        console.log('Request completed successfully');
        try {
            let link = JSON.parse(responseData).link;
            console.log(link);
            await pass_req(link, 'GET', null, null);
            await pass_req(link, 'GET', null, null);
        } catch (error) {
            console.error('Request failed:', error);
        }
    })
    .catch((error) => {
        console.error('Request failed:', error);
    });
