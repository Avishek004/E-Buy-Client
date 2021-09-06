import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CategoryForm from '../../../Components/Forms/CategoryForm';
import AdminNav from '../../../Components/Nav/AdminNav';
import { getCategories } from '../../../Functions/category';
import { getSubCategory, updateSubCategory } from '../../../Functions/subCategory';

const UpdateSub = ({ history, match }) => {
    const { user } = useSelector((state) => ({ ...state }));

    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [parent, setParent] = useState("");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadCategories();
        loadSubCategory();
    }, []);

    const loadCategories = () => getCategories().then((c) => setCategories(c.data));
    const loadSubCategory = () => getSubCategory(match.params.slug).then((s) => {
        setName(s.data.name);
        setParent(s.data.parent);
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        updateSubCategory(match.params.slug, { name, parent }, user.token)
            .then((res) => {
                console.log(res);
                setLoading(false);
                setName("");
                toast.success(`"${res.data.name}" is updated`);
                history.push("/admin/sub")
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
                            <h4>Update SubCategory</h4>
                            <div className="form-group">
                                <label>Parent Category</label>
                                <select name="category" className="form-control" onChange={(event) => setParent(event.target.value)}>
                                    <option>Please Select</option>
                                    {categories.length > 0 && categories.map((c) => (
                                        <option key={c._id} value={c._id} selected={c._id === parent}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName} />
                        </>
                    )
                    }
                </div>
            </div>
        </div>
    );
};

export default UpdateSub;