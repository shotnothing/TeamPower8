"use client"
import React, {useState, useEffect}  from 'react';
import './styles.modules.css';
import Introduction from './components/introduction';
import SearchBar from './components/search_bar';
import ProductList from './components/product_list';
import PriceBar from './components/price_bar';
import Alert from './components/alert';
import {variants} from './components/alert_variants';
import OverviewTable from './components/overview_table';


// to be deleted
import productListData from './components/product_all.json';
import productAnalytics1 from './components/product_analytics_1.json'
import productAnalytics2 from './components/product_analytics_2.json'
import productAnalytics3 from './components/product_analytics_3.json'


const HomePage: React.FC = () => {
    const [input, setInput] = useState("");
    const [productList, setProductList] = useState([]);
    // const [alertColour, setAlertColour] = useState("");
    const [product_id, setproductID] = useState("");

    // render all even if there is no interaction with search bar (when page is called)
    useEffect(() => {
        fetchProductList(input)
        return () => {};
    }, []);

    // https://github.com/shotnothing/TeamPower8/blob/main/docs/API.md (our group's API)
    // /product/all --> get product_name

    const fetchProductList = (value) => {
        // fetch("http://13.250.110.218:80/api/product/filter", {mode: 'no-cors'})
        //     .then((response) => response.json())
        //     .then((json) => {
        //         // Save the JSON data to the productList variable

        //         console.log(json)
        //         setProductList(json.products);
                
        //         // Now you can use the productList variable to access the fetched data
        //         console.log(productList); // For example, log the productList to the console
        //     })
        //     .catch((error) => {
        //         console.error("Error fetching product list:", error);
        //     });

        // using fake data - json file 
        const productList = productListData.products;

        if (value === "") {
            setProductList(productList);
        }

        const regex = new RegExp(value, 'i'); 
        const filteredList = productList.filter((row_data) => {
            return (
                row_data &&
                row_data.product_name &&
                regex.test(row_data.product_name)
            );
        });

        // order filtered list by ranking
        const updatedList = filteredList.map((product) => {
            const ranking = fetchProductRanking(product.product_id);
            return { ...product, ranking };
        });
        updatedList.sort((a, b) => b.ranking - a.ranking);
        setProductList(updatedList);
    };

    const fetchProductRanking = (product_id) => {
        let ranking
        if (product_id == "1") {
          ranking = productAnalytics1.ranking;
        } else if (product_id == "2"){
          ranking = productAnalytics2.ranking;
        } else {
          ranking = productAnalytics3.ranking;
        }
        return ranking;
    }

    return (
        <div className='home-page'>
            <div className='introduction-container'>
                <Introduction />
            </div>
            
            <div className='search-and-summary-container'>
                <div className='search-bar-container'>
                    <h5>Please search for the MFLG product for which you would like to understand its competitors</h5>
                    {/* <SearchBar /> */}
                    <SearchBar setInput={setInput} fetchProductList={fetchProductList}/>
                </div>

                {/* <div className='overview-container'>
                    <OverviewTable />
                </div> */}
            </div>
            

            {productList.map((product, index) => (
                <div className='alert-dashboard' key={index}>
                    <div className='product-list-container'>
                        {productList && productList.length >0 && <ProductList productList={[product]}/>}
                    </div>

                    <div className='price-bar-container'>
                    <PriceBar sampleSimilarProducts={{
                            "prices": [10.0, 12.0, 13.0, 24.5, 26.0, 40.0],
                            "product_price": 25.0,
                            "ranking": 0.82,
                            "similar": [3, 5, 6, 20, 35, 49]
                        }} />
                    </div>

                    <div className='alert-list-container'>
                        {/* <Alert alertColour={alertColour}/> */}
                        <Alert ranking={product.ranking}/>
                    </div>
                </div>))}
        </div>
    )
};

export default HomePage;
