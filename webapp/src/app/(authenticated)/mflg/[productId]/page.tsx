"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./styles.css";
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
    <div className="container">
      {product && (
        <section className="py-3">
          <div className="container">
            <div className="row gx-5">
              <aside className="col-lg-6">
                <div className="rounded-4 mb-3 d-flex justify-content-center">
                  <a data-fslightbox="mygalley" className="rounded-4" target="_blank" data-type="image">
                    <img
                      style={{ width: '100%', height: '100%', objectFit: 'fill' }}
                      className="rounded-4 fit"
                      src={product.image_url}
                      alt=""
                    />
                  </a>
                </div>
              </aside>
              <main className="col-lg-6">
                <div className="ps-lg-3">
                  <h1 className="title text-dark">
                    {product.product_name}
                  </h1>
                  <p>
                    {product.description}
                  </p>

                  <div className="row">
                    <dt className="col-3">Price</dt>
                    <dd className="col-9">{product.price}</dd>

                    <dt className="col-3">Tags</dt>
                    <dd className="col-9">{product.tags}</dd>
                  </div>
                  <hr />
                </div>
              </main>
            </div>
          </div>
        </section>
      )}

      <div className='py-3'>
        <h2>Optimised Price Bar</h2>
          {/* <PriceBar SimilarProducts={{
            "prices": [10.0, 12.0, 13.0, 24.5, 26.0, 40.0],
            "product_price": 25.0,
            "similar": [3, 5, 6, 20, 35, 49],
            "similar_names": ["a","b","c","d","e","f"],
            "product_name" : "Splashtopia @ Sentosa Palawan Green"
        }}/> */}
        <div className="card">
          <div className="card-body" style={{ overflowX: 'auto' }}>
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
          "rank_normalized": 0.25}}/>
          {/* <PriceBar SimilarProducts={similarProducts}/> */}
          </div>
        </div>
      </div>

      <div className='py-3' id="similar-products">
        <h2>Similar Products</h2>
        <ul className="list-group">
          {similarProducts.map((similarProduct) => (
            <a href={`/mflg/${similarProduct.product_id}`} className="list-group-item list-group-item-action link-primary">
              {similarProduct.product_name}
            </a>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductPage;