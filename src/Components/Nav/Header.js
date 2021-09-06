import { Badge, Menu } from 'antd';
import React, { useState } from 'react';
import firebase from "firebase/app";
import { AppstoreOutlined, SettingOutlined, UserOutlined, UserAddOutlined, LogoutOutlined, ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Search from '../Forms/Search';

const { SubMenu, Item } = Menu;

const Header = () => {
    const [current, setCurrent] = useState("home");

    let dispatch = useDispatch();
    let { user, cart } = useSelector((state) => ({ ...state }))
    let history = useHistory();

    const handleClick = (event) => {
        // console.log(event);
        setCurrent(event.key);
    }

    const logout = () => {
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
        dispatch({
            type: "LOGGED_OUT_USER",
            payload: null
        });
        history.push("/login");
    }

    return (
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
            <Item key="home" icon={<AppstoreOutlined />}>
                <Link to="/">Home</Link>
            </Item>

            <Item key="shop" icon={<ShoppingOutlined />}>
                <Link to="/shop">Shop</Link>
            </Item>

            <Item key="cart" icon={<ShoppingCartOutlined />}>
                <Link to="/cart">
                    <Badge count={cart.length} offset={[9, 0]}>
                        Cart
                    </Badge>
                </Link>
            </Item>

            <Item key="search" className="ml-auto">
                <Search />
            </Item>
            {user && (
                <SubMenu key="SubMenu" icon={<SettingOutlined />} title={user.email && user.email.split("@")[0]}>

                    {user && user.role === "subscriber" && (
                        <Item key="user">
                            <Link to="/user/history">Dashboard</Link>
                        </Item>
                    )}

                    {user && user.role === "admin" && (
                        <Item key="admin">
                            <Link to="/admin/dashboard">Dashboard</Link>
                        </Item>
                    )}

                    <Item key="" icon={<LogoutOutlined />} onClick={logout}>Logout</Item>
                </SubMenu>
            )}
            {!user && (
                <Item key="login" icon={<UserOutlined />}>
                    <Link to="/login">Login</Link>
                </Item>
            )}
            {!user && (
                <Item key="register" icon={<UserAddOutlined />}>
                    <Link to="/register">Register</Link>
                </Item>
            )}
        </Menu>
    );
};

export default Header;