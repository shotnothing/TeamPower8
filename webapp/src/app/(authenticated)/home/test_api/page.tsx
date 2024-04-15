"use client"
import { useState, useEffect } from 'react';

const Page = () => {

    const [productList, setProductList] = useState([]);

    useEffect(() => {
        const fetchProductList = () => {
            fetch("http://13.250.110.218:80/api/product/filter")
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
        };
    
        fetchProductList();
    }, []); // Empty dependency array to run only once on component mount

    return (
        <div> 
            {productList.map((product, index) => (
                <div key={index}> 
                    <h2>{product.product_id}</h2>
                    <p>{product.product_name}</p>
                </div> 
            ))}
        </div>
    );
};

export default Page;
