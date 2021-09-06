import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSubCategories } from '../../Functions/subCategory';

const SubCategoryList = () => {
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getSubCategories().then((res) => {
            setSubCategories(res.data);
            setLoading(false);
        });
    }, []);

    const showSubCategories = () =>
        subCategories.map((s) => (
            <div key={s._id} className="col btn btn-outline-primary btn-lg btn-block m-3">
                <Link to={`/sub/${s.slug}`}>{s.name}</Link>
            </div>
        ));
    return (
        <div className="container">
            <div className="row">
                {loading ? (
                    <h4 className="text-danger text-center">
                        Loading...
                    </h4>
                ) : (
                    showSubCategories()
                )}
            </div>
        </div>
    );
};

export default SubCategoryList;