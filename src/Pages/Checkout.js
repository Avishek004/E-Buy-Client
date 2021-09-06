import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { applyCoupon, createCashOrderForUser, emptyUserCart, getUserCart, saveUserAddress } from '../Functions/user';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Checkout = ({ history }) => {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState("");
    const [addressSaved, setAddressSaved] = useState(false);
    const [coupon, setCoupon] = useState("");

    // Discount Price
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [discountError, setDiscountError] = useState("");

    const { user, COD } = useSelector((state) => ({ ...state }));
    const couponTrueOrFalse = useSelector((state) => (state.coupon));

    const dispatch = useDispatch();

    useEffect(() => {
        getUserCart(user.token)
            .then((res) => {
                // console.log("USER CART RES", JSON.stringify(res.data, null, 4));
                setProducts(res.data.products);
                setTotal(res.data.cartTotal);
            }).catch((err) => {
                console.log("ERROR", err.message);
            });
    }, [user.token]);

    const saveAddressToDB = () => {
        // console.log("Saving address", address);
        saveUserAddress(user.token, address)
            .then((res) => {
                if (res.data.ok) {
                    setAddressSaved(true);
                    toast.success("Address saved successfully");
                }
            })
    };

    const emptyCart = () => {
        // Remove from local storage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('cart');
        };

        // Remove from redux
        dispatch({
            type: 'ADD_TO_CART',
            payload: [],
        });

        // Remove from backend
        emptyUserCart(user.token)
            .then((res) => {
                setProducts([]);
                setTotal(0);
                setTotalAfterDiscount(0);
                setCoupon("");
                toast.success("Cart is empty. Continue Shopping");
            })
    };

    const applyDiscountCoupon = () => {
        console.log("Send Coupon to backend", coupon);
        applyCoupon(user.token, coupon)
            .then((res) => {
                console.log("RES ON COUPON APPLIED", res.data);
                if (res.data) {
                    setTotalAfterDiscount(res.data);
                    // Update Redux coupon applied true/false
                    dispatch({
                        type: "COUPON_APPLIED",
                        payload: true
                    });
                }
                // Error
                if (res.data.error) {
                    setDiscountError(res.data.error);
                    // Update Redux coupon applied true/false
                    dispatch({
                        type: "COUPON_APPLIED",
                        payload: false,
                    });
                }
            }).catch((err) => {
                console.error("ERROR ON COUPON APPLIED", err);
            });
    };

    const showAddress = () => (
        <>
            <ReactQuill theme="snow" value={address} onChange={setAddress} />
            <button className="btn btn-primary mt-2" onClick={saveAddressToDB}>
                Save
            </button>
        </>
    );

    const showProductSummary = () =>
        products.map((p, i) => (
            <div key={i}>
                <p>
                    {p.product.title} ({p.color}) x {p.count} = ${p.product.price * p.count}
                </p>
            </div>
        ));

    const showApplyCoupon = () => (
        <>
            <input type="text" className="form-control" value={coupon} onChange={(event) => { setCoupon(event.target.value); setDiscountError(""); }} />
            <button onClick={applyDiscountCoupon} className="btn btn-primary mt-2">Apply</button>
        </>
    );

    const createCashOrder = () => {
        createCashOrderForUser(user.token, COD, couponTrueOrFalse)
            .then((res) => {
                console.log("USER CASH ORDER CREATED", res);
                // empty cart from redux, local storage, reset coupon, reset cod, redirect
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
                    // Empty Redux cash on delivery
                    dispatch({
                        type: "CASH_ON_DELIVERY",
                        payload: false,
                    });
                    // Empty cart from Database
                    emptyUserCart(user.token);
                    // Redirect
                    setTimeout(() => {
                        history.push('/user/history');
                    }, 1000)
                }
            }).catch((err) => {
                console.log("ERROR", err);
            });
    };

    return (
        <div className="row">
            <div className="col-md-6">
                <h4>Delivery Address</h4>
                <br />
                {showAddress()}
                <hr />
                <h4>Got Coupon?</h4>
                <br />
                {showApplyCoupon()}
                <br />
                {discountError && (
                    <p className="bg-danger p-2">{discountError}</p>
                )}
            </div>

            <div className="col-md-6">
                <h4>Order Summary</h4>
                <hr />
                <p>Products {products.length} </p>
                <hr />
                {showProductSummary()}
                <hr />
                <p>Cart total: ${total}</p>

                {totalAfterDiscount > 0 && (
                    <p className="bg-success p-2">
                        Discount Applied: Total Payable: ${totalAfterDiscount}
                    </p>
                )}

                <div className="row">
                    <div className="col-md-6">
                        {COD ? (
                            <button className="btn btn-primary" disabled={!addressSaved || !products.length} onClick={createCashOrder}>
                                Place Order
                            </button>
                        ) : (
                            <button className="btn btn-primary" disabled={!addressSaved || !products.length} onClick={() => history.push("/payment")}>
                                Place Order
                            </button>
                        )}
                    </div>
                    <div className="col-md-6">
                        <button onClick={emptyCart} className="btn btn-primary" disabled={!products.length}>
                            Empty Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;