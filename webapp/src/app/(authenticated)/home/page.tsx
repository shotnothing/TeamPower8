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
    
            // Sort productList by rank_normalized
            updatedList.sort((a, b) => b.rank_normalized - a.rank_normalized);
    
            setProductList(updatedList);
        } catch (error) {
            console.error("Error fetching product list:", error);
        }
    };
    
    const fetchProductRanking = (product_id: number) => {
        return fetch(`http://13.250.110.218:80/api/analytics/p/${product_id}`);
    };
    

    // const fetchProductList = (value) => {
    //     fetch("http://13.250.110.218:80/api/product/filter")
    //         .then((response) => response.json())
    //         .then((json) => {
    //             // Save the JSON data to the productList variable

    //             console.log(json)
    //             setProductList(json.products);
                
    //             // Now you can use the productList variable to access the fetched data
    //             console.log(productList); // For example, log the productList to the console
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching product list:", error);
    //         });

    //     // using fake data - json file 
    //     // const productList = productListData.products;

    //     if (value === "") {
    //         setProductList(productList);
    //     }

    //     const regex = new RegExp(value, 'i'); 
    //     const filteredList = productList.filter((row_data) => {
    //         return (
    //             row_data &&
    //             row_data.product_name &&
    //             regex.test(row_data.product_name)
    //         );
    //     });

    //     // order filtered list by ranking
    //     const updatedList = filteredList.map((product) => {
    //         const rank_normalized = fetchProductRanking(product.product_id);
    //         console.log(rank_normalized);
    //         return { ...product, rank_normalized };
    //     });
    //     updatedList.sort((a, b) => b.rank_normalized - a.rank_normalized);
    //     setProductList(updatedList);
    // };

    // const fetchProductRanking = (product_id: number) => {
    //     let ranking
    //     fetch(`http://13.250.110.218:80/api/analytics/p/${product_id}`)
    //         .then((response) => response.json())
    //         .then((json) => {
    //             ranking = json.rank_normalized
    //         })
    //     return ranking;
    // };

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
                        <Alert rank_normalized={product.rank_normalized}/>
                    </div>
                </div>))}
        </div>
    )
};

export default HomePage;
