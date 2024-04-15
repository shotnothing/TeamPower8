"use client"
import React, {useState, useEffect}  from 'react';
import './styles.modules.css';
import Introduction from './components/introduction';
import SearchBar from './components/search_bar';
import ProductList from './components/product_list';
import PriceBar from './components/price_bar';
import Alert from './components/alert';

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
            const response = await fetch("http://13.250.110.218:80/api/product/filter");
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
                return { ...product, rank_normalized };
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
        return fetch(`http://13.250.110.218:80/api/analytics/p/${product_id}`);
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
                    <PriceBar sampleSimilarProducts={{
                            "prices": [10.0, 12.0, 13.0, 24.5, 26.0, 40.0],
                            "product_price": 25.0,
                            "ranking": 0.82,
                            "similar": [3, 5, 6, 20, 35, 49]
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
