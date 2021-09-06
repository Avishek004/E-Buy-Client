import React from 'react';
import Jumbotron from '../Components/Cards/Jumbotron';
import CategoryList from '../Components/Category/CategoryList';
import BestSellers from '../Components/Home/BestSellers';
import NewArrivals from '../Components/Home/NewArrivals';
import SubCategoryList from '../Components/SubCategory/SubCategoryList';

const Home = () => {
    return (
        <>
            <div className="jumbotron text-danger h1 font-weight-bold text-center">
                <Jumbotron text={['Latest Products', 'New Arrivals', 'Best Sellers']} />
            </div>

            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
                New Arrivals
            </h4>
            <NewArrivals />

            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
                Best Sellers
            </h4>
            <BestSellers />

            <h4 className="text-center p-3 my-5 display-4 jumbotron">
                Category List
            </h4>
            <CategoryList />

            <h4 className="text-center p-3 my-5 display-4 jumbotron">
                SubCategory List
            </h4>
            <SubCategoryList />

        </>
    );
};

export default Home;