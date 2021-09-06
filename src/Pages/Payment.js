import React from 'react';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import '../stripe.css';
import StripeCheckout from '../Components/StripeCheckout';

// Make sure to call loadStripe outside of a component’s render to avoid recreating the Stripe object on every render.
const promise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Payment = () => {
    return (
        <div className="container p-5 text-center">
            <h4>Complete your purchase</h4>
            <Elements stripe={promise}>
                <div className="col-md-8 offset-md-2">
                    <StripeCheckout />
                </div>
            </Elements>
        </div>
    );
};

export default Payment;