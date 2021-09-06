import React from 'react';
import StarRatings from 'react-star-ratings';

export const showAverage = (product) => {
    if (product && product.ratings) {
        let ratingsArray = product && product.ratings;
        let total = [];

        let length = ratingsArray.length;
        // console.log('length:', length);

        ratingsArray.map((rating) => total.push(rating.star));
        let totalReduced = total.reduce((previous, next) => previous + next, 0);
        // console.log('totalReduced:', totalReduced);

        let highest = length * 5;
        // console.log('highest:', highest);

        let result = (totalReduced * 5) / highest;
        // console.log('result:', result);

        return (
            <div className="text-center pt-1 pb-3">
                <span>
                    <StarRatings starDimension="20px" starSpacing="2px" starRatedColor="red" rating={result} editing={false} />
                    ({product.ratings.length})
                </span>
            </div>
        )
    }
}