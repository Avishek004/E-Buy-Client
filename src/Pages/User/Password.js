import React, { useState } from 'react';
import { toast } from 'react-toastify';
import UserNav from '../../Components/Nav/UserNav';
import { auth } from '../../firebase.config';

const Password = () => {
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        // console.log(password);
        await auth.currentUser.updatePassword(password)
            .then(() => {
                setLoading(false);
                setPassword();
                toast.success("Password updated successfully");
            }).catch((error) => {
                setLoading(false);
                toast.error(error.message);
            });
    }

    const passwordUpdateForm = () => (
        <>
            <h4>Password Update</h4>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Your Password</label>
                    <input type="password" className="form-control" placeholder="Enter new password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={loading} />
                    <button className="btn btn-primary" disabled={!password || password.length < 6 || loading} >Submit</button>
                </div>
            </form>
        </>
    )
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <UserNav />
                </div>
                <div className="col-md-10">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                        passwordUpdateForm()
                    )}
                </div>
            </div>
        </div>
    );
};

export default Password;