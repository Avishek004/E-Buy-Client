import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { auth } from '../../firebase.config';
import { createOrUpdateUser } from '../../Functions/auth';

const RegisterComplete = ({ history }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');

    // const { user } = useSelector((state) => ({ ...state })); 

    useEffect(() => {
        setEmail(window.localStorage.getItem('emailForRegistration'))
        // console.log(window.localStorage.getItem('emailForRegistration'))
        // console.log(window.location.href)
    }, []);

    let dispatch = useDispatch();

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Email and Password Validation
        if (!email || !password) {
            toast.error("Email and Password is required");
            return;
        }
        if (password < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }
        try {
            const result = await auth.signInWithEmailLink(email, window.location.href)
            // console.log(result)
            if (result.user.emailVerified) {
                // remove user email from local storage
                window.localStorage.removeItem("emailForRegistration");
                // get user id done
                let user = auth.currentUser
                await user.updatePassword(password);
                const idTokenResult = await user.getIdTokenResult()
                // redux store
                console.log("user", user, "idTokenResult", idTokenResult);
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
                    })
                    .catch(error => console.log(error));
                // redirect
                history.push('/')
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    };
    const completeRegisterForm = () => (
        <form onSubmit={handleSubmit}>
            <input type="email" className="form-control" value={email} disabled />
            <input type="password" className="form-control" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" autoFocus />
            <button type="submit" className="btn btn-raised">Complete Registration</button>
        </form>
    );

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Register Complete</h4>
                    {completeRegisterForm()}
                </div>
            </div>
        </div>
    );
};
export default RegisterComplete;