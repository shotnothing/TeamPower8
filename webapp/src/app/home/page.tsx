"use client"
import React, {useState, useEffect}  from 'react';
import './styles.modules.css';
import Introduction from './components/introduction';
import SearchBar from './components/search_bar';
import ProductList from './components/product_list';

const HomePage: React.FC = () => {
    const [input, setInput] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        fetchData(input)
    });

    // /product/all --> get product_name
    // render all if nothing is typed in text box (don't have value && in return section of results) - confirm if filter is done frontend

    const fetchData = (value) => {
        fetch("https://jsonplaceholder.typicode.com/users").then((response) => response.json())
        .then((json) => {
            // console.log(json);

            if (value === "") {
                setResults(json); // Return all data
                return;
            }
            const regex = new RegExp(value);
            const results = json.filter((row_data) => {
                return (
                    row_data &&
                    row_data.name &&
                    regex.test(row_data.name)
                  );
            });
            // console.log(results)
            setResults(results)
        });
    };

    return (
        <div className='home-page'>
            <h1>This is the Home Page</h1>

            <div className='introduction-container'>
                <Introduction />
            </div>
            
            <div className='search-bar-container'>
                <h5>Please search for the MFLG product for which you would like to understand its competitors</h5>
                {/* <SearchBar /> */}
                <SearchBar setInput={setInput} fetchData={fetchData}/>
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
