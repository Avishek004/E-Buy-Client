import React, { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from 'react-redux';
import { createPaymentIntent } from '../Functions/stripe';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import Laptop from "../Images/laptop.png";
import { CheckOutlined, DollarOutlined } from '@ant-design/icons';
import { createOrder, emptyUserCart } from '../Functions/user';

const StripeCheckout = ({ history }) => {
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState('');

    const [cartTotal, setCartTotal] = useState(0);
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [payable, setPayable] = useState(0);

    const stripe = useStripe();
    const elements = useElements();

    const { user, coupon } = useSelector((state) => ({ ...state }));

    const dispatch = useDispatch();

    useEffect(() => {
        createPaymentIntent(user.token, coupon)
            .then((res) => {
                console.log("create payment intent", res.data);
                setClientSecret(res.data.clientSecret);
                setCartTotal(res.data.cartTotal);
                setTotalAfterDiscount(res.data.totalAfterDiscount);
                setPayable(res.data.payable);
            }).catch((err) => {
                console.log("error creating payment intent", err);
            });
    }, [coupon, user.token]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: event.target.name.value,
                }
            }
        });

        if (payload.error) {
            setError(`Payment failed ${payload.error.message}`);
            setProcessing(false);
        } else {
            // Here you can get result after successful payment
            // console.log(JSON.stringify(payload, null, 2));
            setError(null);
            setProcessing(false);
            setSucceeded(true);

            // Create order and save in database for admin to process
            createOrder(payload, user.token)
                .then((res) => {
                    if (res.data.ok) {
                        // Empty cart from local storage
                        if (typeof window !== 'undefined') {
                            localStorage.removeItem("cart");
                        };
                        // Empty cart from redux
                        dispatch({
                            type: "ADD_TO_CART",
                            payload: [],
                        });
                        // Reset coupon to false
                        dispatch({
                            type: "COUPON_APPLIED",
                            payload: false,
                        });
                        // Empty cart from Database
                        emptyUserCart(user.token);
                    }
                }).catch((err) => {
                    console.error(err);
                });
        }
    };

    const handleChange = async (event) => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisabled(event.empty); // disable pay button if errors
        setError(event.error ? event.error.message : ""); // show error message
    };

    const cardStyle = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: "Arial, sans-serif",
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#32325d",
                },
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a",
            },
        },
    };

    return (
        <>
            {!succeeded && (
                <div>
                    {coupon && totalAfterDiscount !== undefined ? (
                        <p className="alert alert-success">
                            {`Total after discount: $${totalAfterDiscount}`}
                        </p>
                    ) : (
                        <p className="alert alert-danger">
                            "No Coupon applied"
                        </p>
                    )}
                </div>
            )}
            <div className="text-center pb-5">
                <Card
                    cover={
                        <img
                            src={Laptop}
                            alt="Default Product"
                            style={{
                                height: "200px", objectFit: "cover", marginBottom: "-50px"
                            }}
                        />
                    }
                    actions={[
                        <>
                            <DollarOutlined className="text-info" />
                            <br />
                            Total: ${cartTotal}
                        </>,
                        <>
                            <CheckOutlined className="text-info" />
                            <br />
                            Total Payable: ${(payable / 100).toFixed(2)}
                        </>,
                    ]}
                />
            </div>

            <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>
                <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
                <button className="stripe-button" disabled={processing || disabled || succeeded}>
                    <span className="button-text">
                        {processing ? (
                            <div className="spinner" id="spinner"></div>
                        ) : (
                            "Pay Now"
                        )}
                    </span>
                </button>
                {/* Show any error that happens when processing the payment */}
                {error && (
                    <div className="card-error" role="alert">
                        {error}
                    </div>
                )}
                <br />
                {/* Show a success message upon completion */}
                <p className={succeeded ? "result-message" : "result-message hidden"}>
                    Payment succeeded.
                    <Link to="/user/history">
                        See it in your purchase history.
                    </Link>
                </p>
            </form>
        </>
    );
};

export default StripeCheckout;