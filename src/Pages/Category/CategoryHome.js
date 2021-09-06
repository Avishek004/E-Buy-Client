import React, { useEffect, useState } from 'react';
import ProductCard from '../../Components/Cards/ProductCard';
import { getCategory } from '../../Functions/category';

const CategoryHome = ({ match }) => {
    const [category, setCategory] = useState({});
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const { slug } = match.params;

    useEffect(() => {
        setLoading(true);
        getCategory(slug)
            .then((res) => {
                console.log(JSON.stringify(res.data.products, null, 2));
                setCategory(res.data.category);
                setProducts(res.data.products);
                setLoading(false);
            })
    }, [slug])

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col">
                    {loading ? (
                        <h4 className="text-danger p-3 my-5 display-4 jumbotron">
                            Loading...
                        </h4>
                    ) : (
                        <>
                            <h4 className="p-3 my-5 display-4 jumbotron">
                                {products.length} Products in {category.name} Category
                            </h4>
                            <div className="row">
                                {products.map((p) => (
                                    <div className="col-md-4" key={p._id}>
                                        <ProductCard product={p} />
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

export default CategoryHome;