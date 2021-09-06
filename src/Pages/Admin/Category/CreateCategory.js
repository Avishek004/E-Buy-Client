import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNav from '../../../Components/Nav/AdminNav';
import { createCategory, getCategories, removeCategory } from '../../../Functions/category';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CategoryForm from '../../../Components/Forms/CategoryForm';
import LocalSearch from '../../../Components/Forms/LocalSearch';

const CreateCategory = () => {
    const { user } = useSelector((state) => ({ ...state }));

    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    // Step 1 - For Search
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => getCategories().then((c) => setCategories(c.data));

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        createCategory({ name }, user.token)
            .then((res) => {
                console.log(res);
                setLoading(false);
                setName("");
                toast.success(`"${res.data.name}" is created`);
                loadCategories();
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
            removeCategory(slug, user.token)
                .then((response) => {
                    setLoading(false);
                    toast.error(`${response.data.name} is deleted`);
                    loadCategories();
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
                            <h4>Create Category</h4>
                            <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName} />
                        </>
                    )
                    }

                    {/* Step 2 & 3 - For Search */}
                    <LocalSearch keyword={keyword} setKeyword={setKeyword} />

                    {/* Step 5 - For Search*/}
                    {categories.filter(searched(keyword)).map((c) => (
                        <div className="alert alert-secondary" key={c._id}>
                            {c.name}
                            <span onClick={() => handleRemove(c.slug)} className="btn btn-sm float-right">
                                <DeleteOutlined className="text-danger" />
                            </span>
                            <Link to={`/admin/category/${c.slug}`}>
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

export default CreateCategory;