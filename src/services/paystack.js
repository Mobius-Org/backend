const https = require('https');

const payment = {};

payment.initalizeTransaction = (paramObj, response) => {
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

    // make request and response
    const req = https.request(options, res => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            data = JSON.parse(data);
            response.status(201).send({
                status: data.status,
                message: data.message,
                redirectUrl: data.data?.authorization_url
            })
        })
    }).on('error', error => {
        console.error(error)
    })
    req.write(params)
    req.end();
};


// verify transactions using the refrence
payment.verify = (ref, Course, User, Payment, resp) => {
    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/verify/' + encodeURIComponent(ref),
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY
        }
    };

    let data = '';
    // make request
    const req = https.request(options, res => {
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', async () => {
            data = JSON.parse(data);

            // check verification
            if (data.data.status === 'success') {
                const { email, amountTrue, userId, name, courseId } = data.data.metadata,
                    user = await User.findById({ _id: userId }),
                    course = await Course.findOne({ courseId }),
                    newPayment = new Payment(
                        {
                            email,
                            amount: amountTrue,
                            userId,
                            name,
                            courseId,
                            refrence: data.data.refrence
                        });
                // save transaction
                newPayment.save((err, _) => {
                    if (err) {
                        console.log(err);
                        return resp.redirect("https://mobiusorg.netlify.app/courses/verify-payment/failure-2");
                    }
                    else {
                        course.enroll(user._id);
                        //add course to a students data
                        user.enroll(course.courseId, course._id);

                        // save user and send response to client
                        user.save((err, _) => {
                            if (err) {
                                console.log(err);
                                return resp.redirect("https://mobiusorg.netlify.app/courses/verify-payment/failure-2");
                            }
                            // save course
                            course.save((err, _) => {
                                if (err) {
                                    console.log(error);
                                    return resp.redirect("https://mobiusorg.netlify.app/courses/verify-payment/failure-2");
                                };
                                return resp.redirect("http://localhost:3000/courses/verify-payment/success");
                            });
                        });
                    }
                })
            } else {
                resp.redirect("http://localhost:3000/courses/verify-payment/failure-1")
            }
        })
    }).on('error', error => {
        console.error(error)
    });
    req.end();
};

module.exports = payment;