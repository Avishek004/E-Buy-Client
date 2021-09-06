import React from 'react';
import ModalImage from "react-modal-image";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Laptop from '../../Images/laptop.png';
import { CheckCircleOutlined, CloseCircleOutlined, CloseOutlined } from '@ant-design/icons';

const ProductCardInCheckout = ({ p }) => {
    const colors = ["Black", "Brown", "Silver", "White", "Blue"];

    let dispatch = useDispatch();

    const handleColorChange = (event) => {
        // console.log("Color Change", event.target.value); 

        let cart = [];

        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }

            cart.map((product, i) => {
                if (product._id === p._id) {
                    cart[i].color = event.target.value;
                }
            });

            // console.log("Cart Updated", cart);
            localStorage.setItem('cart', JSON.stringify(cart));

            dispatch({
                type: 'ADD_TO_CART',
                payload: cart,
            })
        }
    };

    const handleQuantityChange = (event) => {
        // console.log("Count Change", event.target.value); 
        // console.log('Available Quantity', p.quantity);

        let count = event.target.value < 1 ? 1 : event.target.value;

        if (count > p.quantity) {
            toast.error(`Maximum Product available : ${p.quantity}`);
            return;
        }

        let cart = [];

        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }

            cart.map((product, i) => {
                if (product._id === p._id) {
                    cart[i].count = count;
                }
            });

            // console.log("Cart Updated", cart);
            localStorage.setItem('cart', JSON.stringify(cart));

            dispatch({
                type: 'ADD_TO_CART',
                payload: cart,
            })
        }
    };

    const handleRemove = () => {
        // console.log(p._id);
        let cart = [];

        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }

            cart.map((product, i) => {
                if (product._id === p._id) {
                    cart.splice(i, 1);
                }
            });

            // console.log("Cart Updated", cart);
            localStorage.setItem('cart', JSON.stringify(cart));

            dispatch({
                type: 'ADD_TO_CART',
                payload: cart,
            })
        }
    };

    return (
        <tbody>
            <tr>
                <td>
                    <div style={{ width: '100px', height: 'auto' }}>
                        {p.images.length ? (
                            <ModalImage small={p.images[0].url} large={p.images[0].url} alt="Product Image" />
                        ) : (
                            <ModalImage small={Laptop} large={Laptop} alt="Product Image" />
                        )}
                    </div>
                </td>
                <td>{p.title}</td>
                <td>${p.price}</td>
                <td>{p.brand}</td>
                <td>
                    <select onChange={handleColorChange} name="color" className="form-control">
                        {p.color ? (
                            <option value={p.color}>{p.color}</option>
                        ) : (
                            <option>Select</option>
                        )}
                        {colors
                            .filter((c) => (c !== p.color))
                            .map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                    </select>
                </td>
                <td className="text-center">
                    <input type="number" className="form-control" value={p.count} onChange={handleQuantityChange} />
                </td>
                <td className="text-center">
                    {p.shipping === 'Yes' ? (
                        <CheckCircleOutlined className="text-success" />
                    ) : (
                        <CloseCircleOutlined className="text-danger" />
                    )}
                </td>
                <td className="text-center">
                    <CloseOutlined onClick={handleRemove} className="text-danger pointer" />
                </td>
            </tr>
        </tbody>
    );
};

export default ProductCardInCheckout;