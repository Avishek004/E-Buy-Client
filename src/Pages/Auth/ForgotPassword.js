import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { auth } from '../../firebase.config';

const ForgotPassword = ({ history }) => {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        if (user && user.token) {
            history.push('/')
        }
    }, [user, history])

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const config = {
            url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT_URL,
            handleCodeInApp: true
        };

        await auth.sendPasswordResetEmail(email, config)
            .then(() => {
                setEmail("");
                setLoading(false);
                toast.success("Check your email for password reset link");
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error.message);
                console.log(error);
            });
    }

    return (
        <div className="container p-5 col-md-6 offset-md-3">
            {loading ? (
                <h4 className="text-danger">Loading...</h4>
            ) : (
                <>
                    <h4>Forgot Password</h4>
                    <form onSubmit={handleSubmit}>
                        <input type="email" className="form-control" placeholder="Type your email" value={email} onChange={(event) => setEmail(event.target.value)} autoFocus />
                        <button className="btn btn-raised" disabled={!email}>Submit</button>
                    </form>
                </>
            )}


        </div>
    );
};

export default ForgotPassword;