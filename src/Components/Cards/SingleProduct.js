import "react-responsive-carousel/lib/styles/carousel.min.css";
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Card, Tabs, Tooltip } from 'antd';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import Laptop from '../../Images/laptop.png';
import ProductListItems from './ProductListItems';
import StarRatings from 'react-star-ratings';
import RatingModal from '../Modal/RatingModal';
import { showAverage } from '../../Functions/rating';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { addToWishlist } from "../../Functions/user";
import { toast } from "react-toastify";

const { TabPane } = Tabs;

// This is Children component of Product page.
const SingleProduct = ({ product, onStarClick, star }) => {
    const { title, images, description, _id } = product || {};

    const [tooltip, setTooltip] = useState('Click to Add');

    const { user, cart } = useSelector((state) => ({ ...state }));

    const dispatch = useDispatch();

    const history = useHistory();

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

    const handleAddToWishlist = (event) => {
        event.preventDefault();
        addToWishlist(product._id, user.token)
            .then((res) => {
                console.log('Added to wishlist', res.data);
                toast.success("Added to wishlist");
                // history.push("/user/wishlist");
            }).catch((err) => {
                console.log(err);
            });
    }

    return (
        <>
            <div className="col-md-7">
                {images && images.length ? (
                    <Carousel showArrows={true} autoPlay infiniteLoop>
                        {images && images.map((i) =>
                            <img src={i.url} key={i.public_id} alt="" />
                        )}
                    </Carousel>
                ) : (
                    <Card cover={
                        <img src={Laptop} alt="" className="mb-3 card-img" />
                    }
                    />
                )}
                <Tabs>
                    <TabPane tab="Description" key="1">
                        {description && description}
                    </TabPane>
                    <TabPane tab="More" key="2">
                        Call us on xxxxxxxxxxx to know more about this product.
                    </TabPane>
                </Tabs>
            </div>
            <div className="col-md-5">
                <h1 className="bg-info p-3">{title}</h1>

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
                    actions={[
                        <Tooltip title={tooltip}>
                            <a onClick={handleAddToCart}>
                                <ShoppingCartOutlined className="text-success" />
                                <br />
                                Add to Cart
                            </a>
                        </Tooltip>,
                        <a onClick={handleAddToWishlist}>
                            <HeartOutlined className="text-info" />
                            <br />
                            Add to Wishlist
                        </a>,
                        <RatingModal>
                            <StarRatings name={_id} numberOfStars={5} rating={star} changeRating={onStarClick} isSelectable={true} starRatedColor="red" />
                        </RatingModal>
                    ]}
                >
                    <ProductListItems product={product} />
                </Card>
            </div>
        </>
    );
};

export default SingleProduct;