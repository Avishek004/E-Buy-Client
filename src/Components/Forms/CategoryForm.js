import React from 'react';

const CategoryForm = (props) => {
    const { handleSubmit, name, setName } = props;
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Name</label>
                <input type="text" className="form-control" value={name} onChange={(event) => setName(event.target.value)} placeholder="Category Name" autoFocus required />
                <button className="btn btn-outline-primary">Save</button>
            </div>
        </form>
    );
};

export default CategoryForm;