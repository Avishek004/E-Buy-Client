import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CreateProductForm from '../../../Components/Forms/CreateProductForm';
import FileUpload from '../../../Components/Forms/FileUpload';
import AdminNav from '../../../Components/Nav/AdminNav';
import { getCategories, getSubCategories } from '../../../Functions/category';
import { createProduct } from '../../../Functions/product';
import { LoadingOutlined } from '@ant-design/icons';

const initialState = {
    title: '',
    description: '',
    price: '',
    categories: [],
    category: '',
    subs: [],
    shipping: '',
    quantity: '',
    images: [],
    colors: ["Black", "Brown", "Silver", "White", "Blue"],
    brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
    color: "",
    brand: "",
}

const CreateProduct = () => {
    const [values, setValues] = useState(initialState);
    const [subOptions, setSubOptions] = useState([]);
    const [showSub, setShowSub] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () =>
        getCategories().then((c) => setValues({ ...values, categories: c.data }));

    const handleSubmit = (event) => {
        event.preventDefault();
        createProduct(values, user.token)
            .then((res) => {
                console.log(res)
                window.alert(`${res.data.title} is created`);
                window.location.reload();
            }).catch((error) => {
                console.log(error);
                // if (error.response.status === 400) {
                //     toast.error(error.response.data);
                // }
                toast.error(error.response.data.error);
            });
    };

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
        // console.log(event.target.name, event.target.value);
    };

    const handleCategoryChange = (event) => {
        event.preventDefault();
        console.log(event.target.value);
        setValues({ ...values, subs: [], category: event.target.value });
        getSubCategories(event.target.value)
            .then((res) => {
                console.log(res.data);
                setSubOptions(res.data);
            }).catch((err) => {
                console.log(err);
            });
        setShowSub(true);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col-md-10">
                    <h4>Create Product</h4>
                    <hr />
                    {loading ? (
                        <LoadingOutlined className="text-danger h1" />
                    ) : (
                        <div className="p-3">
                            <FileUpload values={values} setValues={setValues} setLoading={setLoading} />
                        </div>
                    )}
                    <CreateProductForm handleSubmit={handleSubmit} handleChange={handleChange} values={values} handleCategoryChange={handleCategoryChange} subOptions={subOptions} showSub={showSub} setValues={setValues} />
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;