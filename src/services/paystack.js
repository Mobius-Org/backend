const https   = require('https');

const payment = {};

payment.initalizeTransaction = async (paramObj, response) => {
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
    const req = https.request(options, res => {
        let data = ''
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            data = JSON.parse(data);
            console.log(data.data.authorization_url);
            response.redirect(data.data.authorization_url);
        })
    }).on('error', error => {
        console.error(error)
    })
    req.write(params)
    req.end();
};



module.exports = payment;