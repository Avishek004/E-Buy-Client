import { Pagination } from 'antd';
import React, { useEffect, useState } from 'react';
import { getProducts, getProductsCount } from '../../Functions/product';
import LoadingCard from '../Cards/LoadingCard';
import ProductCard from '../Cards/ProductCard';

const NewArrivals = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productsCount, setProductsCount] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadAllProducts();
    }, [page]);

    useEffect(() => {
        getProductsCount()
            .then((res) => {
                setProductsCount(res.data);
            }).catch((err) => {
                console.log(err);
            });
    }, []);

    const loadAllProducts = () => {
        setLoading(true);
        // sort, order, limit
        getProducts('createdAt', 'desc', page)
            .then((res) => {
                // console.log(res);
                setProducts(res.data);
                setLoading(false);
            }).catch((err) => {
                console.log(err);
            });
    }
    return (
        <>
            <div className="container">
                {loading ? (
                    <LoadingCard count={3} />
                ) : (
                    <div className="row">
                        {products.map((product) =>
                            <div key={product._id} className="col-md-4">
                                <ProductCard product={product} />
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="container">
                <div className="row">
                    <nav className="col-md-4 offset-md-4 text-center pt-5 p-3">
                        <Pagination current={page} total={(productsCount / 3) * 10} onChange={(value) => setPage(value)} />
                    </nav>
                </div>
            </div>
        </>
    );
};

export default NewArrivals;