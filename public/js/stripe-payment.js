const STRIPE_PUBLIC_KEY =
    'pk_test_51DKSt8AW156duCe7SQPEiEgCvN7VOTUIvpkyfqNdMo72W8v4pFDZmuLxMs69clBbDXMHPL5SKAdodlXO0Mxx71HN00Yzx63HKt';

let stripe;



window.addEventListener('DOMContentLoaded', async () => {
    await loadStripeScript();

    stripe = Stripe(STRIPE_PUBLIC_KEY, {
        apiVersion: '2020-08-27',
    });
    const url = new URL(window.location).searchParams;
    window.history.replaceState(
        'plans-billing.html',
        undefined,
        '/plans-billing.html'
    );
    if (url.has('payment_intent_client_secret')) {
        const clientSecret = url.get('payment_intent_client_secret');

        const { error, paymentIntent } = await stripe.retrievePaymentIntent(
            clientSecret
        );
        if (error) {
            initModal({
                title: `Payment ${paymentIntent.status}`,
                content: 'Your payment is not successful',
            });
            return;
        }

        initModal({
            title: `Payment ${paymentIntent.status}`,
            content: 'Your payment is successful',
        });
    }
});


window.addEventListener('DOMContentLoaded', () => {
    document
        .querySelectorAll('.choose-plan')
        .forEach((el) => el.addEventListener('click', handlePayment));
});

async function handlePayment() {
    initModal({
        title: 'Pay with Stripe',
        content: `
        <form id="payment-form">
            <div id="link-authentication-element"></div>
            <div id="payment-element"><!-- A Stripe Element will be inserted here. --></div>
            <button type="submit">Continue</button>
            <div id="payment-result"></div>
        </form>`,
    });

    try {
        const paymentIntent = await initStripePayment();

        if (paymentIntent.status === 'succeeded') {
            setMessage('Payment succeeded!');
            return;
        }
        setMessage("Something isn't right. Please try again");
    } catch (error) {
        console.log('🚀 ~ loadStripeScript ~ error:', error);
        setMessage(`Payment failed: ${error.message}`);
    }
}

function initStripePayment() {
    return new Promise(async (resolve, reject) => {
        const form = document.getElementById('payment-form');

        const response = await fetch(
            '/api/billings/pay-with?provider=stripe&action=create-payment-intent',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: 1000 }),
            }
        );
        const { clientSecret, customer, redirectUrl } = await response.json();

        const elements = stripe.elements({
            clientSecret,
            loader: 'auto',
            // Fully customizable with appearance API.
            // appearance: {/*...*/},
        });
        const cardElement = elements.create('payment', {
            wallets: {
                applePay: "auto",
                googlePay: "auto"
            }
        });
        cardElement.mount('#payment-element');

        form.addEventListener('submit', async function (event) {
            event.preventDefault();
            setMessage('');
            try {
                const { error, paymentIntent } = await stripe.confirmPayment({
                    elements,
                    billing_details: {
                        name: customer.fullName,
                    },
                    confirmParams: {
                        return_url: redirectUrl,
                    },
                });
                if (error) {
                    reject(error);
                }
                resolve(paymentIntent);
            } catch (error) {
                reject(error);
            }
        });
    });
}

function loadStripeScript() {
    return new Promise((resolve, reject) => {
        try {
            const url = 'https://js.stripe.com/v3/';
            const script = document.createElement('script');
            script.src = url;
            script.className = 'stript-cdn';

            // Event listener for script load
            script.onload = () => {
                console.log('Stripe checkout script loaded successfully');
                resolve(() => script.remove());
            };

            // Event listener for script error
            script.onerror = () => {
                console.log('Error loading Stripe checkout script');
                reject(new Error('Stripe checkout script load failed'));
            };

            document.head.append(script);
        } catch (error) {
            console.log('Error creating Stripe checkout script');
            reject(error);
        }
    });
}

function setMessage(msg) {
    document.querySelector('#payment-result').innerText = msg;
}

function initModal({ title = 'Modal Title', content = 'Modal Content' }) {
    if (document.querySelector(`#modal-modal`)) {
        document.querySelector(`#modal-modal`).remove();
    }
    const modal = document.createElement('div');
    const modalContent = document.createElement('div');
    const closeButton = document.createElement('span');
    const container = document.createElement('div');
    const modalTitle = document.createElement('h2');

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    modal.id = 'modal-modal';
    modal.className = 'modal';
    modalContent.className = 'modal-content';
    closeButton.className = 'close-button';
    container.innerHTML = content;

    modalTitle.innerText = title;
    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(container);
    modal.appendChild(modalContent);
    modal.style.display = 'block';
    document.body.appendChild(modal);
}
/**
 * {
  "id": "pi_3PnvfpAW156duCe73fMUrjtX",
  "object": "payment_intent",
  "allowed_source_types": [
    "card",
    "klarna",
    "link",
    "cashapp"
  ],
  "amount": 1000,
  "amount_details": {
    "tip": {}
  },
  "automatic_payment_methods": {
    "allow_redirects": "always",
    "enabled": true
  },
  "canceled_at": null,
  "cancellation_reason": null,
  "capture_method": "automatic_async",
  "client_secret": "pi_3PnvfpAW156duCe73fMUrjtX_secret_ELCeYi2SiwZINzaytXWfMAuoD",
  "confirmation_method": "automatic",
  "created": 1723697553,
  "currency": "usd",
  "description": null,
  "last_payment_error": null,
  "livemode": false,
  "next_action": null,
  "next_source_action": null,
  "payment_method": "pm_1PnvfpAW156duCe72V6AjoxT",
  "payment_method_configuration_details": {
    "id": "pmc_1PPIW0AW156duCe7BkdaqNUw",
    "parent": null
  },
  "payment_method_types": [
    "card",
    "klarna",
    "link",
    "cashapp"
  ],
  "processing": null,
  "receipt_email": null,
  "setup_future_usage": null,
  "shipping": null,
  "source": null,
  "status": "succeeded"
}
 */
