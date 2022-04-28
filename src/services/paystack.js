const https = require('https');
const User = require('../model/userModel');
const Course = require('../model/courseModel');
const Payment = require('../model/paymentModel');

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

    // define request and response
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
payment.verify = async (req, response) => {
    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/verify/:' + req.query.refrence,
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
        }
    };
    https.request(options, res => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk
        });
        res.on('end', async () => {
            data = JSON.parse(data);

            console.log(data)
            const metadata = data.data.metadata,
                  user = await User.findById({ _id: metadata.userId }),
                  course = await Course.findOne({ courseId: metadata.courseId }),
                  newPayment = new Payment({
                      email: data.email,
                      amount: data.amount,
                      user: user._id,
                      name: user.name,
                      courseId: course.courseId,
                      refrence: data.refrence
                  });
            newPayment.save((err, _) => {
                if (err) {
                    response.status(500).send({
                        status: "failed",
                        message: "Payment could not verified! Something went wrong"
                    });
                }
                else {
                    course.enroll(user._id);
                    //add course to a students data
                    user.enroll(course.courseId, course._id);

                    // save user and send response to client
                    user.save((err, _) => {
                        if (err) console.log(err);
                        // save course
                        course.save((err, _) => {
                            if (err) console.log(error);
                            //send response
                            response.status(200).send({
                                status: "success",
                                message: `Successfully enrolled in course: ${course.courseName}`,
                            });
                        });
                    });
                };
            });
        }).on('error', error => {
            console.error(error)
        })
    });
};

module.exports = payment;