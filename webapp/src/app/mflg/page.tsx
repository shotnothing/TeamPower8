"use client";
import { useEffect, useState } from "react";
import "./style.css";
import { IonIcon } from "@ionic/react";
import { fetchProducts } from "../../api";
import { Product } from "../../api/types";
import { arrowBack, arrowForward } from "ionicons/icons";

const AllProdutsPage = () => {
  const [products, setProducts] = useState<Product[] | undefined>(undefined);
  useEffect(() => {
    const _ = async () => {
      const response = await fetchProducts();
      setProducts(response);
    };
    _();
  }, []);

  useEffect(() => {
    const slider = document.querySelector(".slider") as HTMLElement;

    function activate(e: MouseEvent) {
      const items = document.querySelectorAll(
        ".item"
      ) as NodeListOf<HTMLElement>;
      if (e.target instanceof Element) {
        if (e.target.matches(".next")) {
          slider.append(items[0]);
        } else if (e.target.matches(".prev")) {
          slider.prepend(items[items.length - 1]);
        }
      }
    }

    document.addEventListener("click", activate, false);

    return () => {
      document.removeEventListener("click", activate);
    };
  }, []);

  return (
    <main>
      <ul className="slider">
        {products?.map((product) => (
          <li
            key={product.product_id}
            className="item"
            style={{
              backgroundImage: `url("${product.image_url}")`,
            }}
          >
            <div className="content">
              <h2 className="title">{product.product_name}</h2>
              <p className="description">{product.description}</p>
              <a href={`/mflg/${product.product_id}`}>
                <button>Only this!</button>
              </a>
            </div>
          </li>
        ))}
      </ul>
      <nav className="nav">
        <IonIcon className="btn prev" icon={arrowBack} />
        <IonIcon className="btn next" icon={arrowForward} />
      </nav>
    </main>
  );
};

export default AllProdutsPage;
