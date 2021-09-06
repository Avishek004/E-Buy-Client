import React from 'react';
import { Link } from 'react-router-dom';

const ProductListItems = ({ product }) => {
    const { price, category, subs, shipping, quantity, color, brand, sold } = product || {};
    return (
        <div>
            <ul className="list-group">
                <li className="list-group-item">
                    Price
                    <span className="float-right">
                        ${price}
                    </span>
                </li>

                {category && (<li className="list-group-item">
                    Category
                    <Link to={`/category/${category.slug}`} className="float-right">
                        {category.name}
                    </Link>
                </li>)}

                {subs && (
                    <li className="list-group-item list-inline">
                        Sub Categories
                        {subs.map((s) => (
                            <Link to={`/sub/${s.slug}`} key={s._id} className="list-inline-item float-right">
                                {s.name}
                            </Link>
                        ))}
                    </li>
                )}

                <li className="list-group-item">
                    Shipping
                    <span className="float-right">
                        {shipping}
                    </span>
                </li>

                <li className="list-group-item">
                    Color
                    <span className="float-right">
                        {color}
                    </span>
                </li>

                <li className="list-group-item">
                    Brand
                    <span className="float-right">
                        {brand}
                    </span>
                </li>

                <li className="list-group-item">
                    Available
                    <span className="float-right">
                        {quantity}
                    </span>
                </li>

                <li className="list-group-item">
                    Sold
                    <span className="float-right">
                        {sold}
                    </span>
                </li>
            </ul>
        </div>
    );
};

export default ProductListItems;