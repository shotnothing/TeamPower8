"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./styles.css";
import { fetchProduct, fetchAnalytics } from "../api";
import { Product, Analytics } from "../api/types";
import PriceBar from "../../pricebar-component/pricebar";
import { GrAnalytics } from "react-icons/gr";

type ProductPageType = {
  params: { productId: string };
};

const ProductPage = ({ params: { productId } }: ProductPageType) => {
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [ProductName, setName] = useState("");
  const [ProductPrice, setPrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch product details
      const productResponse = await fetchProduct(productId);
      setProduct(productResponse);

      // Fetch analytics data
      const analyticsResponse = await fetchAnalytics(productId);


      // Fetch details of similar products
      // const promises = await Promise.all(
      //   analyticsResponse.similar.map(async (similarProductId: number) => {
      //     return await fetchProduct(similarProductId.toString());
      //   })
      //   );
      //   // Remove empty products
      //   const similarProductsData = promises.filter((v) => !!v) as Product[];

      //   setSimilarProducts(similarProductsData);
      // };

      const [promises, productName, productPrice] = await Promise.all([
        Promise.all(
          analyticsResponse.similar.map(async (similarProductId: number) => {
            return await fetchProduct(similarProductId.toString());
          })
          
        ),
        Promise.resolve(analyticsResponse.product_name),
        Promise.resolve(analyticsResponse.original_price),

       

      ]);
        const similarProductsData = promises.filter((v) => !!v) as Product[];

        setSimilarProducts(similarProductsData);

        setName(productName);

        setPrice(productPrice);


        
      };

    fetchData();
  }, [productId]);

const similarProductsName = [];
for (let i = 0; i < similarProducts.length; i++) {
  const similarProduct = similarProducts[i];
  const name = similarProduct.product_name;
  similarProductsName.push(name);
}

const similarProductsPrice = [];
for (let i = 0; i < similarProducts.length; i++) {
  const similarProduct = similarProducts[i];
  const price = parseInt(similarProduct.original_price);
  similarProductsPrice.push(price);
}

console.log(similarProductsPrice);


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
                    <dd className="col-9"><a href={product.source_url}>Link</a></dd>

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
    {product && product.company=="mflg" &&(
      <div className='py-3'>
        <h2>Optimised Price Bar</h2>
        <div className="card">
          <div className="card-body" style={{ overflowX: 'auto' }}>
          <PriceBar SimilarProducts={
            {prices:similarProductsPrice,
              product_price: ProductPrice,
              product_name: ProductName,
              similar_products: similarProductsName
            }
          }/>

          </div>
        </div>
      </div>
    )}

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