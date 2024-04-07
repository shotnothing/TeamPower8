"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./style.css"; // Import CSS file
import { fetchProduct, fetchAnalytics } from "../../../../api";
import { Product, Analytics } from "../../../../api/types";

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