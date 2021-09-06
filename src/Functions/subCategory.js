import axios from "axios";

export const getSubCategories = async () =>
    await axios.get(
        `${process.env.REACT_APP_API_URL}/subs`
    );

export const getSubCategory = async (slug) =>
    await axios.get(
        `${process.env.REACT_APP_API_URL}/sub/${slug}`
    );

export const createSubCategory = async (subCategory, authToken) => {
    return await axios.post(
        `${process.env.REACT_APP_API_URL}/sub`,
        subCategory,
        {
            headers:
            {
                authToken,
            }
        }
    );
}

export const updateSubCategory = async (slug, subCategory, authToken) => {
    return await axios.put(
        `${process.env.REACT_APP_API_URL}/sub/${slug}`,
        subCategory,
        {
            headers:
            {
                authToken,
            }
        }
    );
}

export const removeSubCategory = async (slug, authToken) => {
    return await axios.delete(
        `${process.env.REACT_APP_API_URL}/sub/${slug}`,
        {
            headers:
            {
                authToken,
            }
        }
    );
}

