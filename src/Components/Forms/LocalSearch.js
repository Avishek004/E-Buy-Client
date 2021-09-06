import React from 'react';

const LocalSearch = ({ keyword, setKeyword }) => {
    const handleSearch = (event) => {
        event.preventDefault();
        setKeyword(event.target.value.toLowerCase());
    };

    return (
        <input type="search" placeholder="Filter" value={keyword} onChange={handleSearch} className="form-control mb-4" />
    );
};

export default LocalSearch;