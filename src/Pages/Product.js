import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../Components/Cards/ProductCard';
import SingleProduct from '../Components/Cards/SingleProduct';
import { getProduct, getRelated, productStar } from '../Functions/product';

const Product = ({ match }) => {
    const [product, setProduct] = useState({});
    const [related, setRelated] = useState([]);
    const [star, setStar] = useState(0);

    const { user } = useSelector((state) => ({ ...state }));

    const { slug } = match.params;

    useEffect(() => {
        loadSingleProduct();
    }, [slug]);

    useEffect(() => {
        if (product.ratings && user) {
            let existingRatingObject = product.ratings.find(
                (element) => element.postedBy.toString() === user._id.toString()
            );
            existingRatingObject && setStar(existingRatingObject.star); // current user's star
        }
    }, [product.ratings, user])

    const loadSingleProduct = () => {
        getProduct(slug)
            .then((res) => {
                setProduct(res.data);
                // Load Related
                getRelated(res.data._id)
                    .then((res) => setRelated(res.data))
            });
    };

    const onStarClick = (newRating, name) => {
        console.table(newRating, name);
        setStar(newRating);
        productStar(name, newRating, user.token)
            .then((res) => {
                console.log("Rating Clicked", res.data);
                loadSingleProduct();
            });
    }

    return (
        <div className="container-fluid">
            <div className="row pt-4">
                <SingleProduct product={product} onStarClick={onStarClick} star={star} />
            </div>
            <div className="row">
                <div className="col text-center py-5">
                    <hr />
                    <h4>Related Products</h4>
                    <hr />
                </div>
            </div>
            <div className="row pb-5">
                {related.length ? (
                    related.map((r) => (
                        <div key={r._id} className="col-md-4">
                            <ProductCard product={r} />
                        </div>
                    ))
                ) : (
                    <div className="text-center col">
                        No Products Found
                    </div>
                )}
            </div>
        </div>
    );
};

export default Product;