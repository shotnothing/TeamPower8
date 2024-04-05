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

const HomePage: React.FC = () => {
    const [input, setInput] = useState("");
    const [productList, setProductList] = useState([]);
    // const [alertColour, setAlertColour] = useState("");
    const [product_id, setproductID] = useState("");

    // render all even if there is no interaction with search bar (when page is called)
    useEffect(() => {
        fetchProductList(input)
        // setAlertColour("red")
        // setproductID("2")
    });

    // https://github.com/shotnothing/TeamPower8/blob/main/docs/API.md (our group's API)
    // /product/all --> get product_name

    // const fetchProductList = (value) => {
    //     fetch("https://api.nusmods.com/v2/2023-2024/moduleList.json").then((response) => response.json())
    //     .then((json) => {
    //         // console.log(json);

    //         if (value === "") {
    //             setProductList(json); // Return all data
    //             return;
    //         }
    //         const regex = new RegExp(value);
    //         const productList = json.filter((row_data) => {
    //             return (
    //                 row_data &&
    //                 row_data.title &&
    //                 regex.test(row_data.title) // rmbr to change the product_list.tsx field as well
    //               );
    //         });
    //         // console.log(results)
    //         setProductList(productList)
    //     });
    // };

    const fetchProductList = (value) => {
        // using fake data - json file 
        const productList = productListData.products;
    
        if (value === "") {
            setProductList(productList); 
            return;
        }
    
        const regex = new RegExp(value, 'i'); 
        const filteredList = productList.filter((row_data) => {
            return (
                row_data &&
                row_data.product_name &&
                regex.test(row_data.product_name)
            );
        });
    
        setProductList(filteredList);
    };

    return (
        <div className='home-page'>
            <h1>Alert Dashboard</h1>

            <div className='introduction-container'>
                <Introduction />
            </div>
            
            <div className='search-and-summary-container'>
                <div className='search-bar-container'>
                    <h5>Please search for the MFLG product for which you would like to understand its competitors</h5>
                    {/* <SearchBar /> */}
                    <SearchBar setInput={setInput} fetchProductList={fetchProductList}/>
                </div>

                <div className='overview-container'>
                    <OverviewTable />
                </div>
            </div>
            

            {productList.map((product, index) => (
                <div className='alert-dashboard' key={index}>
                    <div className='product-list-container'>
                        {productList && productList.length >0 && <ProductList productList={[product]}/>}
                    </div>

                    <div className='price-bar-container'>
                        <PriceBar/>
                    </div>

                    <div className='alert-list-container'>
                        {/* <Alert alertColour={alertColour}/> */}
                        {console.log(product.product_id)}
                        <Alert product_id={product.product_id}/>
                    </div>
                </div>))};
        </div>
    );
};

export default HomePage;
