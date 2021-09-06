import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

const Search = () => {
    const dispatch = useDispatch();
    const { search } = useSelector((state) => ({ ...state }));
    const { text } = search;

    const history = useHistory();

    const handleChange = (event) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: event.target.value },
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        history.push(`/shop?${text}`);
    };

    return (
        <form className="form-inline my-2 my-lg-0" onSubmit={handleSubmit}>
            <input type="search" className="form-control mr-sm-2" value={text} placeholder="Search" onChange={handleChange} />
            <SearchOutlined onClick={handleSubmit} />
        </form>
    );
};

export default Search;