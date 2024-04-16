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
              <aside className="col-lg-6 gx-5">
                <div className="rounded-4 mb-3 d-flex justify-content-center">
                  <a data-fslightbox="mygalley" className="rounded-4" target="_blank" data-type="image">
                    <img
                      style={{ width: '100%', height: '100%', objectFit: 'fill'}}
                      className="rounded-4 fit"
                      src={product.image_url}
                      alt="no image"
                    />
                  </a>
                </div>
              </aside>
              <main className="col-lg-6">
                <div className="ps-lg-3">
                  <h1 className="title text-dark">
                    {product.product_name}
                  </h1>
                  <p className="description-container">
                    {product.description}
                  </p>
                  <div className="row">
                    <dt className="col-3">Price</dt>
                    <dd className="col-9">${product.original_price}</dd>

                    <dt className="col-3">Scrape source</dt>
                    <dd className="col-9"><a href="{product.source_url}">Link</a></dd>

                    <dt className="col-3">Scrape date</dt>
                    <dd className="col-9">28 March 2024</dd>
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
            <PriceBar SimilarProducts={{"prices": [40, 22.25, 12, 50, 46.75, 133.25, 85, 188, 233.15, 43, 147.09, 135, 48, 68.75, 87.5, 62.89, 18, 41.29, 28, 85, 52.25, 40, 84, 85, 25, 58, 388, 35, 68, 81.35, 10, 20, 31.15, 16.2, 50.95, 50, 199, 520, 250, 65, 49, 350, 200, 28, 75, 621.65, 85, 26.69, 90, 26.69, 85, 98, 26.69, 99, 62.4, 135, 41, 38, 52.3, 123, 165, 22], "product_price": 10, "similar": [384, 110, 41, 430, 219, 284, 339, 174, 483, 285, 348, 317, 423, 151, 299, 463, 43, 69, 259, 457, 77, 9, 193, 175, 103, 421, 473, 115, 283, 1, 86, 98, 459, 73, 196, 452, 515, 42, 336, 523, 88, 474, 381, 6, 396, 521, 258, 496, 326, 488, 387, 333, 495, 273, 169, 533, 20, 267, 116, 497, 513, 272], "similar_names": ["Craft Clay Sushi Earring Workshop", "1-Way Genting Dream Destination Cruises by Resorts World Cruises", "Snow City Singapore Ticket", "Pre-HDB Housing Estate Tour in Tiong Bahru", "Long Bar at Raffles Hotel", "Faber Peak Breakfast Expedition in Singapore", "Singapore Kopi & Loti (Coffee and Bread) Factory Tour", "Wellness Me-Time at St. Gregory, PARKROYAL COLLECTION Marina Bay", "Make your Own Bralette Workshop in Singapore", "Wild Dandelions Dome Workshop in Marymount", "The Singapore Home Tour", "Kelong and Pulau Ubin Guided Boat Tour", "Double Kayak at Lazarus Sea Sports Centre", "Chinatown Murders Game Tour", "Beeswax Wrap Workshop in Singapore by The Sustainability Project", "Secrets of Singapore Kick Scooter Tour with Dinner", "SkyHelix Sentosa Ticket in Singapore", "Action Motion Ticket at HomeTeamNS Bedok Reservoir, Singapore", "Yoga, Pilates, Barre at Canopy Park", "Chibi Art Silk Printing Workshop by Lazo", "The Tiara Society Ticket in Singapore", "Singapore Flyer Ticket", "TungLok Signatures in Singapore", "Authentic Korean Cooking Class by Let's Yori in Singapore", "Singapore River Cruise", "Traditional Chinese Pastries Tour - A Heritage and Cultural Experience", "Luxurious Air-Conditioned Glamping Experience in Singapore", "OH! Kampong Gelam Art Walk in Singapore", "Floral Resin Coaster Workshop", "Klook Pass Singapore", "Singapore Discovery Centre \u2013 Permanent Exhibits Gallery, Black Lake Facility, Black Lake Laser Battlefield, XD Theatre", "Racing Simulation Experience", "Little India Pub Crawl Half Day Tour", "Kidz Amaze @ SAFRA Jurong Ticket in Singapore", "Tanglin Gin Distillery at Dempsey Hill", "Heritage Hunt Tour at Bugis Street", "Eyelash Extension Experience for Couple in Singapore", "165 Sky Dining by Singapore Flyer", "The Last Kampong of Singapore Private Tour", "Instawalk Black & White: From Trishaws to Trains Tour", "Checkpoint Theatre presents SECONDARY: THE MUSICAL by weish", "3-Hours Sunset Walking Tour in Singapore", "SG Walk The Southern Ridges by X-Trekkers", "Singapore Cable Car Sky Pass", "Essential Oil Blend, Natural Pocket Perfume & Mist Workshop in Singapore", "Private Half Day Singapore City Tour With Sentosa Island", "Everyday I'm Trufflin': Truffle Making Class by Lemuel Chocolate", "Open My Factory: TuasOne Waste-to-Energy Plant in Singapore", "Ultimate Food Journey", "ALBA E-Waste Logistics & Sorting Hub Tour in Singapore", "Personalised Candle Making Workshop at Eunos", "DIY Bathbomb Workshop in Orchard Gateway", "Open My Factory: Tai Hua Soy Sauce Factory in Singapore", "Let\u2019s Go Bike Singapore: Bike and Bites Heritage Tour", "Singapore Southern Straits Sunset Dinner Cruise", "Lau Pa Sat Night Street Food Tour Singapore & Marina Bay Night Walk", "Museum of Ice Cream Singapore", "Beauty & Wellness and Brow Art Treatments", "Big Bus Singapore Night City Tour", "Nature's Spa Singapore", "Coffee Meet-Up Experience in Singapore", "Rainforest Terrarium Workshop in Yishun"], "product_name": "Gardens by the Bay Ticket in Singapore"}}/>
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