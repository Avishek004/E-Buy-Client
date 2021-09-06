import axios from "axios";

export const getCoupons = async () =>
    await axios.get(
        `${process.env.REACT_APP_API_URL}/coupons`
    );

export const removeCoupon = async (couponId, authToken) =>
    await axios.delete(
        `${process.env.REACT_APP_API_URL}/coupon/${couponId}`,
        {
            headers: {
                authToken
            }
        }
    );

export const createCoupon = async (coupon, authToken) =>
    await axios.post(
        `${process.env.REACT_APP_API_URL}/coupon`,
        { coupon },
        {
            headers: {
                authToken
            }
        }
    );

