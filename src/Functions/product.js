import axios from "axios";

export const createProduct = async (product, authToken) => {
    return await axios.post(
        `${process.env.REACT_APP_API_URL}/product`,
        product,
        {
            headers:
            {
                authToken,
            }
        }
    );
};

export const getProductsByCount = async (count) =>
    await axios.get(`${process.env.REACT_APP_API_URL}/products/${count}`);

export const getProductsCount = async () =>
    await axios.get(`${process.env.REACT_APP_API_URL}/products/total`);

export const removeProduct = async (slug, authToken) => {
    return await axios.delete(
        `${process.env.REACT_APP_API_URL}/product/${slug}`,
        {
            headers:
            {
                authToken,
            }
        }
    );
};

export const getProduct = async (slug) =>
    await axios.get(
        `${process.env.REACT_APP_API_URL}/product/${slug}`
    );

export const updateProduct = async (slug, product, authToken) => {
    return await axios.put(
        `${process.env.REACT_APP_API_URL}/product/${slug}`,
        product,
        {
            headers: {
                authToken
            }
        }
    )
};

export const getProducts = async (sort, order, page) => {
    return await axios.post(
        `${process.env.REACT_APP_API_URL}/products`,
        { sort, order, page },
    );
};

export const productStar = async (productId, star, authToken) => {
    return await axios.put(
        `${process.env.REACT_APP_API_URL}/product/star/${productId}`,
        { star },
        {
            headers: {
                authToken
            }
        },
    )
};

export const getRelated = async (productId) =>
    await axios.get(
        `${process.env.REACT_APP_API_URL}/product/related/${productId}`,
    );

export const fetchProductsByFilter = async (arg) =>
    await axios.post(
        `${process.env.REACT_APP_API_URL}/search/filters`,
        arg
    );

