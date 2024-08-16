const { Router } = require('express');
const {
    createPaymentIntent,
    confirmStripePayment,
} = require('../functions/helpers');
const { getUserById, getPackages } = require('../functions');
const { STRIPE_REDIRECT_URL } = require('../config/env');

const router = Router();

router.get('/', (req, res) => res.json('Everythimg works fine ✅ '));


router
    .route('/pay-with')
    .post(async (req, res) => {
        const { provider, action } = req.query;

        switch (provider) {
            case 'stripe':
                switch (action) {
                    case 'create-payment-intent':
                        const { amount } = req.body;
                        const { firstName, lastName } = await getUserById(
                            req.user._id
                        );
                        try {
                            const clientSecret = await createPaymentIntent({
                                amount,
                            });
                            return res.status(200).json({
                                clientSecret,
                                redirectUrl: STRIPE_REDIRECT_URL,
                                customer: {
                                    fullName: `${firstName} ${lastName}`,
                                },
                            });
                        } catch (error) {
                            console.log('🚀 ~ router.post ~ error:', error);
                            res.status(500).json({
                                success: false,
                                errors: error.message,
                            });
                        }
                        break;

                    case 'retrieve-payment':
                        try {
                            const { paymentMethodId, paymentIntentId } =
                                req.body;

                            const payment = await confirmStripePayment({
                                amount,
                                paymentIntentId,
                                paymentMethodId,
                            });
                            res.send({
                                success: payment.status === 'succeeded',
                                payment,
                            });
                        } catch (error) {
                            console.log('🚀 ~ router.post ~ error:', error);
                            res.status(500).json({
                                success: false,
                                errors: error.message,
                            });
                        }

                        break;
                    default:
                        break;
                }

                break;

            default:
                break;
        }
    })
    .get(async (req, res) => {
        switch (provider) {
            case 'stripe':
                switch (action) {
                    case 'confirm-payment':
                        try {
                            console.log(req.query);

                            // const { paymentMethodId, paymentIntentId } = req.body;

                            // const payment = await confirmStripePayment({
                            //     amount,
                            //     paymentIntentId,
                            //     paymentMethodId,
                            // });
                            // res.send({
                            //     success: payment.status === 'succeeded',
                            //     payment
                            // });
                            res.end();
                        } catch (error) {
                            console.log('🚀 ~ router.post ~ error:', error);
                            // res.status(500).json({
                            //     success: false,
                            //     errors: error.message,
                            // });
                            res.end();
                        }

                        break;
                    default:
                        break;
                }

                break;

            default:
                break;
        }
    });

module.exports = router;
