import { GoogleOutlined, MailOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth, googleProvider } from '../../firebase.config';
import { createOrUpdateUser } from '../../Functions/auth';


const Login = ({ history }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        let intended = history.location.state;

        if (intended) {
            return;
        } else {
            if (user && user.token) {
                history.push('/')
            }
        }
    }, [user, history]);

    let dispatch = useDispatch();

    const roleBasedRedirect = (res) => {
        // Check if intended
        let intended = history.location.state;

        if (intended) {
            history.push(intended.from);
        } else {
            if (res.data.role === 'admin') {
                history.push('/admin/dashboard');
            } else {
                history.push('/user/history');
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        // console.table(email, password);
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            // console.log(result)
            const { user } = result;
            const idTokenResult = await user.getIdTokenResult()

            createOrUpdateUser(idTokenResult.token)
                .then((res) => {
                    // console.log(res);
                    dispatch({
                        type: 'LOGGED_IN_USER',
                        payload: {
                            name: res.data.name,
                            email: res.data.email,
                            token: idTokenResult.token,
                            role: res.data.role,
                            _id: res.data._id,
                        }
                    });
                    roleBasedRedirect(res);
                })
                .catch(error => console.log(error));
            // history.push('/')
        } catch (error) {
            console.log(error)
            toast.error(error.message);
            setLoading(false);
        }

    }

    const googleLogin = () => {
        auth.signInWithPopup(googleProvider)
            .then(async (result) => {
                const { user } = result;
                const idTokenResult = await user.getIdTokenResult()
                createOrUpdateUser(idTokenResult.token)
                    .then((res) => {
                        // console.log(res);
                        dispatch({
                            type: 'LOGGED_IN_USER',
                            payload: {
                                name: res.data.name,
                                email: res.data.email,
                                token: idTokenResult.token,
                                role: res.data.role,
                                _id: res.data._id,
                            }
                        });
                        roleBasedRedirect(res);
                    })
                    .catch(error => console.log(error));
                // history.push('/')
            })
            .catch((error) => {
                toast.error(error.message);
            });
    }

    const loginForm = () => (
        <>
            <h4>Login</h4>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="email" className="form-control" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your Email" autoFocus />
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your Password" />
                </div>
                <Button onClick={handleSubmit} type="primary" className="mb-3" block shape="round" icon={<MailOutlined />} size="large" disabled={!email || password.length < 6}>Login with Email and Password</Button>
                <Button onClick={googleLogin} type="danger" className="mb-3" block shape="round" icon={<GoogleOutlined />} size="large" >Login with Google</Button>
                <Link to="/forgot/password" className="float-right text-danger">Forgot Password</Link>
            </form>
        </>
    );

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    {loading ? (
                        <h4 className="text-danger">Loading ...</h4>
                    ) : (
                        loginForm()
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;