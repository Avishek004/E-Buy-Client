import { DeleteOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import UserNav from '../../Components/Nav/UserNav';
import { getWishlist, removeWishlist } from '../../Functions/user';


const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);

    const { user } = useSelector((state) => ({ ...state }));

    const dispatch = useDispatch();

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = () =>
        getWishlist(user.token)
            .then((res) => {
                console.log(res.data);
                setWishlist(res.data.wishlist);
            }).catch((err) => {
                console.log(err);
            });

    const handleRemove = (productId) => {
        removeWishlist(productId, user.token)
            .then((res) => {
                console.log(res.data);
                loadWishlist();
            }).catch((err) => {
                console.error(err);
            });
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <UserNav />
                </div>
                <div className="col-md-10">
                    <h4>Wishlist</h4>
                    {wishlist.map((p) => (
                        <div className="alert alert-secondary" key={p._id}>
                            <Link to={`/product/${p.slug}`}>
                                {p.title}
                            </Link>
                            <span className="btn btn-sm float-right" onClick={() => handleRemove(p._id)}>
                                <DeleteOutlined className="text-danger" />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;