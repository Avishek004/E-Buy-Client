import { LoadingOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import FileUpload from '../../../Components/Forms/FileUpload';
import UpdateProductForm from '../../../Components/Forms/UpdateProductForm';
import AdminNav from '../../../Components/Nav/AdminNav';
import { getCategories, getSubCategories } from '../../../Functions/category';
import { getProduct, updateProduct } from '../../../Functions/product';

const initialState = {
    title: '',
    description: '',
    price: '',
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

const UpdateProduct = ({ match, history }) => {
    const [values, setValues] = useState(initialState);
    const [categories, setCategories] = useState([]);
    const [subOptions, setSubOptions] = useState([]);
    const [arrayOfSubs, setArrayOfSubs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));

    const { slug } = match.params;

    useEffect(() => {
        loadProduct();
        loadCategories();
    }, []);

    const loadProduct = () => {
        getProduct(slug)
            .then((product) => {
                // console.log(product);
                // 1 - load Single Product
                setValues({ ...values, ...product.data });
                // 2 - load Single product category subs
                getSubCategories(product.data.category._id)
                    .then((res) => {
                        setSubOptions(res.data); // on first load, show default subs
                    }).catch((err) => {
                        console.error(err);
                    });
                // 3 - Prepare array of sub ids to show as default sub values in antd select
                let arr = [];
                product.data.subs.map((s) => {
                    return arr.push(s._id);
                });
                console.log(arr);
                setArrayOfSubs((prev) => arr); // required for antd select to work
            }).catch((err) => {
                console.log(err);
            });
    };

    const loadCategories = () => {
        getCategories()
            .then((c) => {
                console.log(c);
                setCategories(c.data);
            }).catch((err) => {
                console.log(err);
            });
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        values.subs = arrayOfSubs;
        values.category = selectedCategory ? selectedCategory : values.category;
        updateProduct(slug, values, user.token)
            .then((res) => {
                console.log(res);
                setLoading(false);
                toast.success(`${res.data.title} is updated`);
                history.push("/admin/products");
            }).catch((error) => {
                console.log(error);
                setLoading(false);
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
        setValues({ ...values, subs: [] });

        setSelectedCategory(event.target.value);

        getSubCategories(event.target.value)
            .then((res) => {
                console.log(res.data);
                setSubOptions(res.data);
            }).catch((err) => {
                console.log(err);
            });

        console.log(values.category);

        // if user clicks back to the original category
        // show its sub categories in default
        if (values.category._id === event.target.value) {
            loadProduct();
        }

        // clear old sub category ids
        setArrayOfSubs([]);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col-md-10">
                    <h4>Update Product</h4>
                    <hr />
                    {loading ? (
                        <LoadingOutlined className="text-danger h1" />
                    ) : (
                        <div className="p-3">
                            <FileUpload values={values} setValues={setValues} setLoading={setLoading} />
                        </div>
                    )}
                    <UpdateProductForm handleSubmit={handleSubmit} handleChange={handleChange} values={values} setValues={setValues} handleCategoryChange={handleCategoryChange} categories={categories} subOptions={subOptions} arrayOfSubs={arrayOfSubs} setArrayOfSubs={setArrayOfSubs} selectedCategory={selectedCategory} />
                </div>
            </div>
        </div>
    );
};

export default UpdateProduct;