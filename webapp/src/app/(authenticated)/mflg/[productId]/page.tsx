"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./style.css"; // Import CSS file
import { fetchProduct, fetchAnalytics } from "../../../../api";
import { Product, Analytics } from "../../../../api/types";
import PriceBar from "../../pricebar-component/pricebar";

type ProductPageType = {
  params: { productId: string };
};

const ProductPage = ({ params: { productId } }: ProductPageType) => {
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch product details
      const productResponse = await fetchProduct(productId);
      setProduct(productResponse);

      // Fetch analytics data
      const analyticsResponse = await fetchAnalytics(productId);

      // Fetch details of similar products
      const promises = await Promise.all(
        analyticsResponse.similar.map(async (similarProductId: number) => {
          return await fetchProduct(similarProductId.toString());
        })
        );
        // Remove empty products
        const similarProductsData = promises.filter((v) => !!v) as Product[];

        setSimilarProducts(similarProductsData);
      };

    fetchData();
  }, [productId]);


  return (
    <>
      {product && (
        <div className="item-3d">
          <figure className="item-content group">
            <div className="item-img">
              <img src={product.image_url} alt="" />
            </div>
            <figcaption className="item-caption">
              <p>
                <strong>{product.product_name}</strong>
                <br />
                {product.company}
                <br />
                {product.description}
                <br />
                {product.price}
                <br />
                {product.tags}
              </p>
            </figcaption>
          </figure>
        </div>
      )}

      <div className='price-bar-container'>
          {/* <PriceBar SimilarProducts={{
            "prices": [10.0, 12.0, 13.0, 24.5, 26.0, 40.0],
            "product_price": 25.0,
            "similar": [3, 5, 6, 20, 35, 49],
            "similar_names": ["a","b","c","d","e","f"],
            "product_name" : "Splashtopia @ Sentosa Palawan Green"
        }}/> */}
        <PriceBar SimilarProducts={{"prices": [24, 17.5, 75, 19, 32, 23, 22.9, 90, 32.9, 10, 58, 109, 12, 59, 15, 22, 90, 30.9, 94, 45, 25, 70, 128, 50, 28, 98, 66, 85, 50, 59, 124, 12, 12, 730.65, 27.9, 10, 69, 55, 15, 29, 247, 150], "product_price": 19, "similar": [143, 83, 102, 16, 51, 17, 22, 419, 56, 414, 260, 157, 39, 104, 428, 62, 31, 38, 85, 227, 60, 332, 503, 338, 197, 134, 106, 339, 452, 113, 532, 34, 37, 122, 66, 4, 269, 390, 21, 32, 201, 198], "similar_names": ["FunVee Hop On Hop Off Bus Tour", "Klook Chinatown Hawker Food Pass", "Genting Dream Destination Cruises by Resorts World Cruises", "Wings of Time Show Ticket in Singapore", "Trick Eye Museum Ticket at Southside Sentosa in Singapore", "Adventure Cove Waterpark Ticket in Singapore", "SuperPark Ticket in Singapore", "Minimalist Textured Art Workshop in Singapore", "Tayo Station Ticket", "Kids Spa Party in Singapore", "Massage and Reflexology at Syoujin", "Cruise & Dining Adventure with YachtCruiseSG", "Kiztopia Ticket in Singapore (Woodleigh)", "Big Bus Singapore Hop On Hop Off Tour (Open-Top)", "Singapore Art Appreciation with Slow Art Workshop", "VR Game Experience by Hologate Singapore", "Fun Discovery Pass at Sentosa", "Sentosa 4D Adventureland Ticket", "Singapore Adventure Pass", "Singapore Botanical Garden & National Orchid Garden Tour in Korean", "Changi Experience Studio Ticket in Singapore", "My Heart Beads for Peranakan: A Joo Chiat Experience", "Clay Accessories Making Workshop - Watercolour", "Kampong Glam Tour", "Gogreen Segway, Bicycles & Kick Scooters in Sentosa, Singapore", "Perfume Workshop in Singapore by Oo La Lab", "MegaZip at Mega Adventure Park Singapore", "Singapore Kopi & Loti (Coffee and Bread) Factory Tour", "Heritage Hunt Tour at Bugis Street", "Ceramic and Pottery Workshop in Orchard Gateway", "Singapore Guided Tour Pass", "Kiztopia Club Ticket at Jewel Changi Airport", "Kiztopia Ticket in Singapore (Punggol)", "Private Full Day Singapore Highlights Tour", "AIRZONE Admission Ticket", "Night Safari Singapore Ticket With Tram Ride", "Art Jamming with Newton's Law of Motion by Motion Art Space", "Inside the Singaporean Chinese", "SkyPark Ticket by Kiztopia Singapore", "Wild Wild Wet Ticket in Singapore", "1 Day Batam Private City Tour (2-way Singapore Ferry Included)", "Singapore River Cruise with Seafood Restaurant Dinner and Chinatown Murals Tour"], "product_name": "Splashtopia @ Sentosa Palawan Green"}}/>
        </div>

      <div id="similar-products">
        <h2>Similar Products</h2>
        <ul id="similar-products-list">
          {similarProducts.map((similarProduct) => (
            <li key={similarProduct.product_id}>
              <a href={`/mflg/${similarProduct.product_id}`}>
                {similarProduct.product_name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ProductPage;