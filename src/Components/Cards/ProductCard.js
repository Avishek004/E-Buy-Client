import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Card, Tooltip } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { showAverage } from '../../Functions/rating';
import Laptop from '../../Images/laptop.png';

const { Meta } = Card;

const ProductCard = ({ product }) => {
    const { title, description, images, slug, price } = product;

    const [tooltip, setTooltip] = useState('Click to Add');

    // Redux
    const { user, cart } = useSelector((state) => ({ ...state }));

    const dispatch = useDispatch();

    const handleAddToCart = () => {
        // create cart array
        let cart = [];
        if (typeof window !== 'undefined') {
            // if cart is in local storage, get it
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            // push new product to cart array           
            cart.push({ ...product, count: 1 });
            // Remove duplicates
            let unique = _.uniqWith(cart, _.isEqual);
            // save to local storage
            // console.log('unique: ', unique);
            localStorage.setItem('cart', JSON.stringify(unique));
            // Show tooltip
            setTooltip("Added");

            // Add to Redux state
            dispatch({
                type: "ADD_TO_CART",
                payload: unique,
            });
            // Show Cart item in side drawer
            dispatch({
                type: "SET_VISIBLE",
                payload: true,
            });
        }
    };

    return (
        <>
            {
                product && product.ratings && product.ratings.length > 0
                    ? showAverage(product)
                    : (
                        <div className="text-center py-2">
                            No Rating Yet
                        </div>
                    )
            }

            <Card
                cover={
                    <img src={images && images.length ? images[0].url : Laptop} alt="" style={{ height: "150px", objectFit: "cover" }} className="p-1" />
                }
                actions={[
                    <Link to={`/product/${slug}`}>
                        <EyeOutlined className="text-warning" />
                        <br />
                        View Product
                    </Link>,
                    <Tooltip title={tooltip}>
                        <a onClick={handleAddToCart} disabled={product.quantity < 1}>
                            <ShoppingCartOutlined className="text-danger" />
                            <br />
                            {product.quantity < 1 ? "Out of Stock" : "Add to Cart"}
                        </a>
                    </Tooltip>
                ]}
            >
                <Meta title={`${title} - $${price}`} description={`${description && description.substring(0, 45)}...`} />
            </Card>
        </>
    );
};

export default ProductCard;