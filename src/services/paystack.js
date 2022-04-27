const https   = require('https');

const payment = {};

payment.initalizeTransaction = async (paramObj) => {
    // stringify the parameters from client
    const params = JSON.stringify(paramObj);

    // define options to passed to request
    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
            'Content-Type': 'application/json'
        }
    };

    // define request and response
    let result = '';
    const req = https.request(options, res => {
        let data = ''
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            data = JSON.parse(data);
            result = data;
        })
    }).on('error', error => {
        console.error(error)
    })
    req.write(params)
    req.end()
    return result;
};



module.exports = payment;