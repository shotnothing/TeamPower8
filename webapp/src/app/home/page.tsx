// export default function Empty () {
//     return <h1>Empty!</h1>
// }

import React from 'react';
import PriceBar from '../pricebar/page'; // Assuming PriceBar.js is in the same directory

const HomePage = () => {
    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <PriceBar />
        </div>
    );
}

export default HomePage;