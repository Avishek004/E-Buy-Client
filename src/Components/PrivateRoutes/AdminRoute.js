import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { currentAdmin } from '../../Functions/auth';
import LoadingToRedirect from './LoadingToRedirect';

const AdminRoute = ({ children, ...rest }) => {
    const { user } = useSelector((state) => ({ ...state }));
    const [ok, setOk] = useState(false);

    useEffect(() => {
        if (user && user.token) {
            currentAdmin(user.token)
                .then((res) => {
                    console.log("Current Admin Res", res);
                    setOk(true);
                })
                .catch((error) => {
                    console.log("Admin Route Error", error);
                    setOk(false);
                })
        }
    }, [user]);

    return ok ? (
        <Route {...rest} />
    ) : (
        <LoadingToRedirect />
    )
};

export default AdminRoute;