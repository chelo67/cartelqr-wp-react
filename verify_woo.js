const https = require('https');

const config = {
    url: 'https://koonetix.shop/wp-json/wc/v3/products',
    ck: 'ck_a1fd685caa446f9d99db0c931955724baa706adb',
    cs: 'cs_30abbbe715438bec9d9335ca27a3a6f978265745'
};

const auth = Buffer.from(`${config.ck}:${config.cs}`).toString('base64');

const options = {
    headers: {
        'Authorization': `Basic ${auth}`
    }
};

https.get(config.url, options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        if (res.statusCode === 200) {
            const products = JSON.parse(data);
            console.log('SUCCESS: Connection verified.');
            console.log(`Found ${products.length} products:`);
            products.forEach(p => console.log(`- [${p.id}] ${p.name} (SKU: ${p.sku})`));
        } else {
            console.error(`ERROR: Status ${res.statusCode}`);
            console.error(data);
        }
    });
}).on('error', (err) => {
    console.error('ERROR:', err.message);
});
