"use client"
import React, {useState}  from 'react';
import './styles.modules.css';
import Introduction from './components/introduction';
import SearchBar from './components/search_bar';
import ProductList from './components/product_list';

const HomePage: React.FC = () => {

    const [results, setResults] = useState("");

    return (
        <div className='home-page'>
            <h1>This is the Home Page</h1>

            <div className='introduction-container'>
                <Introduction />
            </div>
            
            <div className='search-bar-container'>
                <h5>Please search for the MFLG product for which you would like to understand its competitors</h5>
                {/* <SearchBar /> */}
                <SearchBar setResults={setResults} />
            </div>

            <div className='alert-dashboard'>
                <div className='product-list-container'>
                    {results && results.length >0 && <ProductList results={results}/>}
                </div>

                <div className='price-bar-container'>
                    <p> price bars</p>
                </div>

                <div className='alert-list-container'>
                    <p> alert list</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
