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
        return () => {};
    }, []);

    // https://github.com/shotnothing/TeamPower8/blob/main/docs/API.md (our group's API)
    // /product/all --> get product_name

    const fetchProductList = (value) => {
        fetch("http://http://13.213.39.217/api/product/filter")
            .then((response) => response.json())
            .then((json) => {
                // Save the JSON data to the productList variable

                console.log(json)
                setProductList(json.products);
                
                // Now you can use the productList variable to access the fetched data
                console.log(productList); // For example, log the productList to the console
            })
            .catch((error) => {
                console.error("Error fetching product list:", error);
            });

        // using fake data - json file 
        // const productList = productListData.products;

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

        setProductList(filteredList);
    };

    // const fetchProductList = (value) => {
    //     // using fake data - json file 
    //     const productList = productListData.products;
    
    //     if (value === "") {
    //         setProductList(productList); 
    //         return;
    //     }
    
    //     const regex = new RegExp(value, 'i'); 
    //     const filteredList = productList.filter((row_data) => {
    //         return (
    //             row_data &&
    //             row_data.product_name &&
    //             regex.test(row_data.product_name)
    //         );
    //     });
    
    //     setProductList(filteredList);
    // };

    return (
        <div className='container'>
            <div className='row'>
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
                            <PriceBar SimilarProducts={{"prices": [155.89, 50, 14], 
                                "product_price": 25, 
                                "original_price": 25, 
                                "discounted_price": null, 
                                "similar": [144, 343, 28], 
                                "similar_products": [{"product_id": 144, "company": "not mflg", "product_name": "Spa Treatments at Chi, The Spa Shangri-La Singapore", "scrape_timestamp": "WIP", "description": "Highlights\nLuxurious yet down to earth, Chi, The Spa at Shangri-La Singapore provides you with a place for personal peace and well-being.\nIntuitive, skilled therapists employ a caring touch to rejuvenate the body and soothe the senses with our selection of massages, facial treatments and wellness journeys.", "original_price": 209.85, "discounted_price": 155.89, "source_url": "https://www.klook.com/en-US/activity/72011-shangri-la-singapore-spa-treatments-chi-spa-singapore/", "remarks": "WIP", "image_url": "https://res.klook.com/image/upload/activities/udobbdqch0sogx1b4sr1.jpg", "tags": "WIP"}, 
                                {"product_id": 343, "company": "not mflg", "product_name": "The Ripple Club Water Cycling in Singapore", "scrape_timestamp": "WIP", "description": "The Ripple Club is a revolutionary fitness and wellness community that offers low-impact and technology-integrated aqua workouts adapted to your desired intensity level.\nWhether you're just starting your fitness journey or looking for a safer fitness alternative, dip your toe in and see where the ripples take you!", "original_price": 50, "discounted_price": null, "source_url": "https://www.klook.com/en-US/activity/44546-aqua-spin-water-cycling-singapore/", "remarks": "WIP", "image_url": "https://res.klook.com/image/upload/activities/ul4jqyun4kdnms9hjgcj.jpg", "tags": "WIP"}, 
                                {"product_id": 28, "company": "not mflg", "product_name": "National Gallery Singapore Ticket", "scrape_timestamp": "WIP", "description": "National Gallery Singapore\nDiscover Singaporean and Southeast Asian art at the National Gallery Singapore \u2013 home to over 1,000 art works\nExplore Singapore's signature architecture \u2013 the National Gallery Singapore is located in the iconic restored Supreme Court and City Hall buildings, built in 1937 and 1926 respectively\nA day at the National Gallery Singapore is the perfect way to learn more about the city and learn about local and Southeast Asia art", "original_price": 20, "discounted_price": 14, "source_url": "https://www.klook.com/en-US/activity/1256-national-gallery-singapore/", "remarks": "WIP", "image_url": "https://res.klook.com/image/upload/activities/qiwboihtvtnminra0iri.jpg", "tags": "WIP"}], 
                                "product_name": "S.E.A. Aquarium Ticket Sentosa, Singapore", 
                                "rank": 1, 
                                "rank_normalized": 0.25}} />
                            </div>

                            <div className='alert-list-container'>
                                {/* <Alert alertColour={alertColour}/> */}
                                {console.log(product.product_id)}
                                <Alert product_id={product.product_id}/>
                            </div>
                        </div>))};
                </div>
            </div>
        </div>
    );
};

export default HomePage;
