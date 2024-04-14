"use client"
import { useState, useEffect } from 'react';

const Page = () => {

    const [productList, setProductList] = useState([]);

    useEffect(() => {
        const fetchProductList = () => {
            fetch("http://13.250.110.218/api/product/range", { mode: 'no-cors' })
                .then(response => {
                    // Handle response status
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    // Parse response as text
                    return response.text();
                })
                .then(text => {
                    // Log response text
                    console.log(text);
                })
                .catch(error => {
                    // Handle fetch errors
                    console.error("Error fetching product list:", error);
                });
        };
    
        fetchProductList();
    }, []); // Empty dependency array to run only once on component mount

    // useEffect(() => {
    //     const fetchProductList = async () => {
    //         try {
    //             const response = await fetch("http://13.250.110.218/api/product/range", { mode: 'no-cors' });
    //             const json = await response.json();
    //             console.log(json.products);
    //             setProductList(json.products);
    //         } catch (error) {
    //             console.error("Error fetching product list:", error);
    //         }
    //     };

    //     fetchProductList();
    // }, []); // Empty dependency array to run only once on component mount


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
