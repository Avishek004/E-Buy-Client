import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CategoryForm from '../../../Components/Forms/CategoryForm';
import AdminNav from '../../../Components/Nav/AdminNav';
import { getCategory, updateCategory } from '../../../Functions/category';

const UpdateCategory = ({ history, match }) => {
    const { user } = useSelector((state) => ({ ...state }));

    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCategory();
    }, []);

    const loadCategory = () => getCategory(match.params.slug).then((c) => setName(c.data.name));

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        updateCategory(match.params.slug, { name }, user.token)
            .then((res) => {
                console.log(res);
                setLoading(false);
                setName("");
                toast.success(`"${res.data.name}" is Updated`);
                history.push("/admin/category");
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                if (error.response.status === 400) {
                    toast.error(error.response.data);
                }
            })
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col-md-10">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                        <>
                            <h4>Update Category</h4>
                            <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName} />
                        </>
                    )
                    }
                    <hr />
                </div>
            </div>
        </div>
    );
};

export default UpdateCategory;