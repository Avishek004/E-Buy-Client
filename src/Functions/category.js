import axios from "axios";

export const getCategories = async () =>
    await axios.get(
        `${process.env.REACT_APP_API_URL}/categories`
    );

export const getCategory = async (slug) =>
    await axios.get(
        `${process.env.REACT_APP_API_URL}/category/${slug}`
    );

export const getSubCategories = async (_id) =>
    await axios.get(
        `${process.env.REACT_APP_API_URL}/category/subs/${_id}`
    );

export const createCategory = async (category, authToken) => {
    return await axios.post(
        `${process.env.REACT_APP_API_URL}/category`,
        category,
        {
            headers:
            {
                authToken,
            }
        }
    );
};

export const updateCategory = async (slug, category, authToken) => {
    return await axios.put(
        `${process.env.REACT_APP_API_URL}/category/${slug}`,
        category,
        {
            headers:
            {
                authToken,
            }
        }
    );
};

export const removeCategory = async (slug, authToken) => {
    return await axios.delete(
        `${process.env.REACT_APP_API_URL}/category/${slug}`,
        {
            headers:
            {
                authToken,
            }
        }
    );
};

