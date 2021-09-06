import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AdminProductCard from '../../../Components/Cards/AdminProductCard';
import AdminNav from '../../../Components/Nav/AdminNav';
import { getProductsByCount, removeProduct } from '../../../Functions/product';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadAllProducts();
    }, []);

    const loadAllProducts = () => {
        setLoading(true);
        getProductsByCount(100)
            .then((res) => {
                setLoading(false);
                setProducts(res.data);
            }).catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };

    const handleRemove = (slug) => {
        // let answer = window.confirm("Delete?")
        if (window.confirm("Delete?")) {
            // console.log("Send Delete Request", slug);
            removeProduct(slug, user.token)
                .then((res) => {
                    loadAllProducts();
                    toast.error(`${res.data.title} is deleted`);
                }).catch((err) => {
                    if (err.response.status === 400) {
                        toast.error(err.response.data);
                    };
                    console.error(err);
                });
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col-md-10">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                        <>
                            <h4>All Products</h4>
                            <div className="row">
                                {products.map((product) => (
                                    <div key={product._id} className="col-md-4 pb-3">
                                        <AdminProductCard product={product} handleRemove={handleRemove} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllProducts;