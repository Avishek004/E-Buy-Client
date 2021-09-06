import React, { useEffect, useState } from 'react';
import { fetchProductsByFilter, getProductsByCount } from '../Functions/product';
import ProductCard from '../Components/Cards/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, Menu, Radio, Slider } from 'antd';
import { DollarOutlined, DownSquareOutlined, StarOutlined } from '@ant-design/icons';
import { getCategories } from '../Functions/category';
import Star from '../Components/Forms/Star';
import { getSubCategories } from '../Functions/subCategory';

const { SubMenu, ItemGroup } = Menu;

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState([0, 0]);
    const [ok, setOk] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoryIds, setCategoryIds] = useState([]);
    const [star, setStar] = useState('');
    const [subCategories, setSubCategories] = useState([]);
    const [subCategory, setSubCategory] = useState('');
    const [brands, setBrands] = useState(["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"]);
    const [brand, setBrand] = useState('');
    const [colors, setColors] = useState(["Black", "Brown", "Silver", "White", "Blue"]);
    const [color, setColor] = useState('');
    const [shipping, setShipping] = useState('');


    let dispatch = useDispatch();
    let { search } = useSelector((state) => ({ ...state }));
    const { text } = search;

    useEffect(() => {
        loadAllProducts();
        // Fetch Categories
        getCategories().then((res) => setCategories(res.data));
        // Fetch Sub Categories
        getSubCategories().then((res) => setSubCategories(res.data));
    }, []);

    const fetchProducts = (arg) => {
        fetchProductsByFilter(arg)
            .then((res) => {
                setProducts(res.data);
            })
    };

    // 1. load products by default on page load
    const loadAllProducts = () => {
        setLoading(true);
        getProductsByCount(12)
            .then((res) => {
                setLoading(false);
                setProducts(res.data);
            });
    };

    // 2. load products on user search input.
    useEffect(() => {
        const delayed = setTimeout(() => {
            fetchProducts({ query: text });
            if (!text) {
                loadAllProducts();
            };
        }, 300);
        return () => clearTimeout(delayed);
    }, [text]);

    // 3. load products based on price range.
    useEffect(() => {
        // console.log("Ok to request products");
        fetchProducts({ price });
    }, [ok, price]);

    const handleSlider = (value) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
        });
        setCategoryIds([]);
        setStar('');
        setSubCategory('');
        setBrand('');
        setColor('');
        setShipping('');
        setPrice(value);
        setTimeout(() => {
            setOk(!ok);
        }, 300);
    };

    // 4. load products based on category.
    // Handle Check for Categories.
    const handleCheck = (event) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
        });
        setPrice([0, 0]);
        setStar('');
        setSubCategory('');
        setBrand('');
        setColor('');
        setShipping('');

        // console.log(event.target.value);
        let inTheState = [...categoryIds];
        let justChecked = event.target.value;
        let foundInTheState = inTheState.indexOf(justChecked);

        // indexOf method ?? if not found returns -1 else return index.
        if (foundInTheState === -1) {
            inTheState.push(justChecked);
        } else {
            inTheState.splice(foundInTheState, 1);
        }

        setCategoryIds(inTheState);
        // console.log(inTheState);
        fetchProducts({ category: inTheState });
    };

    // show categories in a list of checkbox.
    const showCategories = () =>
        categories.map((category) => (
            <div key={category._id}>
                <Checkbox onChange={handleCheck} className="px-4 py-2" value={category._id} name="category" checked={categoryIds.includes(category._id)}>
                    {category.name}
                </Checkbox>
                <br />
            </div>
        ))

    // 5. Show Products by star Rating.
    const handleStarClick = (number) => {
        // console.log(number);
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setSubCategory('');
        setBrand('');
        setColor('');
        setShipping('');
        setStar(number)
        fetchProducts({ stars: number });
    };

    const showRatings = () => (
        <div className="px-4 pb-2">
            <Star starClick={handleStarClick} numberOfStars={5} />
            <Star starClick={handleStarClick} numberOfStars={4} />
            <Star starClick={handleStarClick} numberOfStars={3} />
            <Star starClick={handleStarClick} numberOfStars={2} />
            <Star starClick={handleStarClick} numberOfStars={1} />
        </div>
    );

    // 6.Show Products by Sub Category.
    const handleSub = (sub) => {
        // console.log('sub', sub);
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar('');
        setBrand('');
        setColor('');
        setShipping('');
        setSubCategory(sub)
        fetchProducts({ sub });
    };

    const showSubCategories = () =>
        subCategories.map((sub) => (
            <div key={sub._id} onClick={() => handleSub(sub)} className="p-1 m-1 badge badge-secondary" style={{ cursor: 'pointer' }}>
                {sub.name}
            </div>
        ))

    // 7.Show Products based on Brand Name.
    const handleBrand = (event) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar('');
        setSubCategory('');
        setColor('');
        setShipping('');
        setBrand(event.target.value);
        fetchProducts({ brand: event.target.value })
    };

    const showBrands = () =>
        brands.map((br) => (
            <Radio key={br} value={br} name={br} checked={br === brand} onChange={handleBrand} className="px-4 py-2" >
                {br}
            </Radio>
        ));

    // 8.Show products based on color.
    const handleColor = (event) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar('');
        setSubCategory('');
        setBrand('');
        setShipping('');
        setColor(event.target.value);
        fetchProducts({ color: event.target.value })
    };

    const showColors = () =>
        colors.map((col) => (
            <Radio key={col} value={col} name={col} checked={col === color} onChange={handleColor} className="px-4 py-2" >
                {col}
            </Radio>
        ));

    // 9. Show Products based on Shipping.
    const handleShippingChange = (event) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar('');
        setSubCategory('');
        setBrand('');
        setColor('');
        setShipping(event.target.value);
        fetchProducts({ shipping: event.target.value });
    };

    const showShipping = () => (
        <>
            <Checkbox className="px-4 pb-2" onChange={handleShippingChange} value="Yes" checked={shipping === "Yes"}>
                Yes
            </Checkbox>
            <Checkbox className="px-4 pb-2" onChange={handleShippingChange} value="No" checked={shipping === "No"}>
                No
            </Checkbox>
        </>
    );

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 pt-2">
                    <h4>Search/Filter</h4>
                    <hr />

                    <Menu defaultOpenKeys={['1', '2', '3', '4', '5', '6', '7']} mode="inline">
                        {/* Price */}
                        <SubMenu
                            key="1"
                            title={
                                <span className="h6">
                                    <DollarOutlined /> Price
                                </span>
                            }
                        >
                            <div>
                                <Slider className="mx-4" tipFormatter={(value) => `$${value}`} range value={price} onChange={handleSlider} max="9999" />
                            </div>
                        </SubMenu>

                        {/* Category */}
                        <SubMenu
                            key="2"
                            title={
                                <span className="h6">
                                    <DownSquareOutlined /> Categories
                                </span>
                            }
                        >
                            <div>
                                {showCategories()}
                            </div>
                        </SubMenu>

                        {/* StarRatings */}
                        <SubMenu
                            key="3"
                            title={
                                <span className="h6">
                                    <StarOutlined /> Rating
                                </span>
                            }
                        >
                            <div>
                                {showRatings()}
                            </div>
                        </SubMenu>

                        {/* SubCategories */}
                        <SubMenu
                            key="4"
                            title={
                                <span className="h6">
                                    <StarOutlined /> Sub Categories
                                </span>
                            }
                        >
                            <div className="px-4">
                                {showSubCategories()}
                            </div>
                        </SubMenu>

                        {/* Brands */}
                        <SubMenu
                            key="5"
                            title={
                                <span className="h6">
                                    <StarOutlined /> Brands
                                </span>
                            }
                        >
                            <div className="pr-5">
                                {showBrands()}
                            </div>
                        </SubMenu>

                        {/* Colors */}
                        <SubMenu
                            key="6"
                            title={
                                <span className="h6">
                                    <StarOutlined /> Colors
                                </span>
                            }
                        >
                            <div className="pr-5">
                                {showColors()}
                            </div>
                        </SubMenu>

                        {/* Shipping */}
                        <SubMenu
                            key="7"
                            title={
                                <span className="h6">
                                    <StarOutlined /> Shipping
                                </span>
                            }
                        >
                            <div className="pr-5">
                                {showShipping()}
                            </div>
                        </SubMenu>
                    </Menu>
                </div>
                <div className="col-md-9 pt-2">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                        <h4 className="text-danger">Products</h4>
                    )}
                    {products.length < 1 && <p>No products found</p>}

                    <div className="row pb-5">
                        {products.map((product) => (
                            <div className="col-md-4 mt-3" key={product._id}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;