"use client";

import React, { useEffect, useMemo, useState } from "react";
import "./style.css"; // Import CSS file
import { fetchProduct } from "../../../api";
import { Product } from "../../../api/types";

type ProductPageType = {
  params: { productId: string };
};

const ProductPage = ({ params: { productId } }: ProductPageType) => {
  const [product, setProduct] = useState<Product | undefined>(undefined);
  useEffect(() => {
    const _ = async () => {
      const response = await fetchProduct(productId);
      setProduct(response);
    };
    _();
  }, [productId]);

  return (
    <div className="item-3d">
      <span className="ground"></span>
      <figure className="item-content group">
        <div className="item-img">
          <img src={product?.image_url} alt="" />
        </div>
        <figcaption className="item-caption">
          <p>
            <strong>{product?.product_name}</strong>
            <br />
            {product?.company}
            <br />
            {product?.description}
            <br />
            {product?.price}
            <br />
            {product?.tags}
          </p>
        </figcaption>
      </figure>
    </div>
  );
};

export default ProductPage;
