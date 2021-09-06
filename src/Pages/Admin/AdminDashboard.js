import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AdminNav from '../../Components/Nav/AdminNav';
import Orders from '../../Components/Order/Orders';
import { changeStatus, getOrders } from '../../Functions/admin';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);

    const { user } = useSelector((state) => ({ ...state }));

    const dispatch = useDispatch();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = () =>
        getOrders(user.token)
            .then((res) => {
                // console.log(res.data);
                setOrders(res.data);
            }).catch((err) => {
                console.error(err);
            });

    const handleStatusChange = (orderId, orderStatus) => {
        changeStatus(orderId, orderStatus, user.token)
            .then((res) => {
                console.log("Status changed", res.data);
                toast.success("Status Changed");
                loadOrders();
            }).catch((err) => {
                console.log("Error", err);
            });
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col-md-10">
                    <Orders orders={orders} handleStatusChange={handleStatusChange} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;