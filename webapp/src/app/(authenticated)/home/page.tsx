"use client"
import React, {useState, useEffect}  from 'react';
import './styles.modules.css';
import Introduction from './components/introduction';
import SearchBar from './components/search_bar';
import ProductList from './components/product_list';
import PriceBar from './components/price_bar';
import Alert from './components/alert';
import { fetchProduct, fetchAnalytics } from "../mflg/api";
import { Product, Analytics } from "../mflg/api/types";

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

    const fetchProductList = async (value) => {
        try {
            const response = await fetch("http://13.213.39.217/api/product/filter?company=mflg");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const json = await response.json();
            let productList = json.products;
            
            // Filter the productList based on the value
            if (value !== "") {
                const regex = new RegExp(value, 'i');
                productList = productList.filter((product) => regex.test(product.product_name));
            }
    
            // Fetch ranking for each product and update productList
            const updatedListPromises = productList.map(async (product) => {
                const rankResponse = await fetchProductRanking(product.product_id);
                const rankJson = await rankResponse.json();
                const rank_normalized = rankJson.rank_normalized;
                const similarProducts = rankJson.similar_products;
                const similarProductsPrices = rankJson.prices;
                const productName = rankJson.product_name
                const price = rankJson.original_price;
                return { ...product, rank_normalized, similarProducts, productName, price, similarProductsPrices };
            });
    
            // Wait for all ranking fetches to complete
            const updatedList = await Promise.all(updatedListPromises);
    
            // Sort productList by rank_normalized (no its not like that, because the two ends are the "greatest")
            // count their difference from 0.5 (midpoint instead)
            updatedList.sort((a, b) => Math.abs(b.rank_normalized - 0.5) - Math.abs(a.rank_normalized - 0.5));
            console.log(updatedList);
            setProductList(updatedList);
        } catch (error) {
            console.error("Error fetching product list:", error);
        }
    };


    
    const fetchProductRanking = (product_id: number) => {
        return fetch(`http://13.213.39.217/api/analytics/p/${product_id}`);
    };
    
    return (
        <div className='home-page'>
            <div className='introduction-container'>
                <Introduction />
            </div>
            
            
            <div className='search-bar-container'>
                <h5>Please search for the MFLG product for which you would like to understand its competitors</h5>
                {/* <SearchBar /> */}
                <SearchBar setInput={setInput} fetchProductList={fetchProductList}/>
            </div>
            

                    {productList.map((product, index) => (
                        <div className='alert-dashboard' key={index}>
                            <div className='product-list-container'>
                                {productList && productList.length >0 && <ProductList productList={[product]}/>}
                            </div>

                            <div className='price-bar-container'>
                            <PriceBar SimilarProducts={{
                                    "product_price": product.price,
                                    "product_name": product.productName,
                                    "similar_products": product.similarProducts
                                }} />
                            </div>

                    <div className='alert-list-container'>
                        {/* <Alert alertColour={alertColour}/> */}
                        <Alert rank_normalized={product.rank_normalized}/>
                    </div>
                </div>))}
        </div>
    )
};

export default HomePage;


