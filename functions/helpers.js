const { STRIPE_SECRET_KEY } = require('../config/env');

const Currency = require('../enums/Currency');
const Package = require('../models/Package');
const stripe = require('stripe')(STRIPE_SECRET_KEY);

// Used accross integration. Should only be changed here
const CURRENCY = Currency.USD;

async function createPaymentIntent({ amount, currency = CURRENCY }) {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // Amount in cents
        currency: currency,
        payment_method_types: ['card', 'klarna'],
    });

    const clientSecret = paymentIntent.client_secret;
    return clientSecret;
}

async function confirmStripePayment({
    amount,
    paymentIntentId = null,
    paymentMethodId = null,
}) {
    let paymentIntent;
    if (paymentIntentId) {
        paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    } else if (paymentMethodId) {
        paymentIntent = await stripe.paymentIntents.create({
            payment_method: paymentMethodId,
            amount, // Amount in the smallest currency unit
            currency: CURRENCY,
            confirmation_method: 'manual',
            confirm: true,
        });
    }
    return paymentIntent;
}

function getStripeSecretKey() {
    return STRIPE_SECRET_KEY;
}


module.exports = {
    createPaymentIntent,
    confirmStripePayment,
    getStripeSecretKey,
};
