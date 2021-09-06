import React from 'react';

const ShowPaymentInfo = ({ order, showStatus = true }) => {
    const { orderStatus } = order;

    const { id, amount, currency, payment_method_types, status, created } = order.paymentIntent;

    return (
        <div>
            <p>
                <span>Order ID: {id}</span>,{" | "}
                <span>
                    Amount: {(amount / 100).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD"
                    })}
                </span>,{" | "}
                <span>Currency: {currency.toUpperCase()}</span>,{" | "}
                <span>Method: {payment_method_types[0]}</span>,{" | "}
                <span>Payment: {status.toUpperCase()}</span>,{" | "}
                <span>Ordered on: {new Date(created * 1000).toLocaleString()}</span>,{" | "}
                <br />
                {showStatus && (
                    <span className="badge bg-primary text-white">STATUS: {orderStatus}</span>
                )}
            </p>
        </div>
    );
};

export default ShowPaymentInfo;