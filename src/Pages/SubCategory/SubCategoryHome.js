import React, { useEffect, useState } from 'react';
import ProductCard from '../../Components/Cards/ProductCard';
import { getSubCategory } from '../../Functions/subCategory';

const SubCategoryHome = ({ match }) => {
    const [subCategory, setSubCategory] = useState({});
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const { slug } = match.params;

    useEffect(() => {
        setLoading(true);
        getSubCategory(slug)
            .then((res) => {
                console.log(JSON.stringify(res.data, null, 2));
                setSubCategory(res.data.subCategory);
                setProducts(res.data.products);
                setLoading(false);
            })
    }, [slug]);

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
                                {products.length} Products in {subCategory.name} Category
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

export default SubCategoryHome;