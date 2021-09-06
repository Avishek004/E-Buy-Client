import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNav from '../../../Components/Nav/AdminNav';
import { getCategories } from '../../../Functions/category';
import { createSubCategory, getSubCategories, removeSubCategory } from '../../../Functions/subCategory';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CategoryForm from '../../../Components/Forms/CategoryForm';
import LocalSearch from '../../../Components/Forms/LocalSearch';


const CreateSub = () => {
    const { user } = useSelector((state) => ({ ...state }));

    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    // Step 1 - For Search
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        loadCategories();
        loadSubCategories();
    }, []);

    const loadCategories = () => getCategories().then((c) => setCategories(c.data));
    const loadSubCategories = () => getSubCategories().then((s) => setSubCategories(s.data));

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        createSubCategory({ name, parent: category }, user.token)
            .then((res) => {
                console.log(res);
                setLoading(false);
                setName("");
                toast.success(`"${res.data.name}" is created`);
                loadSubCategories();
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                if (error.response.status === 400) {
                    toast.error(error.response.data);
                }
            })
    };

    const handleRemove = async (slug) => {
        // let answer = window.confirm("Delete?");
        // console.log(answer, slug);
        if (window.confirm("Delete?")) {
            setLoading(true);
            removeSubCategory(slug, user.token)
                .then((response) => {
                    setLoading(false);
                    toast.error(`${response.data.name} is deleted`);
                    loadSubCategories();
                })
                .catch((error) => {
                    setLoading(false);
                    if (error.response.status === 400) {
                        toast.error(error.response.data);
                    }
                });
        }
    };

    // Step 4 - For Search
    const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

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
                            <h4>Create Sub Category</h4>
                            <div className="form-group">
                                <label>Parent Category</label>
                                <select name="category" className="form-control" onChange={(event) => setCategory(event.target.value)}>
                                    <option>Please Select</option>
                                    {categories.length > 0 && categories.map((c) => (
                                        <option key={c._id} value={c._id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName} />
                        </>
                    )
                    }


                    {/* Step 2 & 3 - For Search */}
                    <LocalSearch keyword={keyword} setKeyword={setKeyword} />

                    {/* Step 5 - For Search*/}
                    {subCategories.filter(searched(keyword)).map((s) => (
                        <div className="alert alert-secondary" key={s._id}>
                            {s.name}
                            <span onClick={() => handleRemove(s.slug)} className="btn btn-sm float-right">
                                <DeleteOutlined className="text-danger" />
                            </span>
                            <Link to={`/admin/sub/${s.slug}`}>
                                <span className="btn btn-sm float-right">
                                    <EditOutlined className="text-warning" />
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CreateSub;