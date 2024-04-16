import { Product, Analytics } from "./types";
import MOCK_DATA from "./mock-data.json";

const MOCK = false;

const PRODUCTS_URL = "http://13.213.39.217/api/product/filter?company=mflg";
const PRODUCT_URL = "http://13.213.39.217/api/product/p/";
const ANALYTICS_URL = "http://13.213.39.217/api/analytics/p/";


// Fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  if (MOCK) return MOCK_DATA.products;
  const endpoint = PRODUCTS_URL;

  try {
    const response = await fetch(endpoint);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Parse the JSON response
    const data = await response.json();

    // Return the data, assuming the correct data format
    return data.products;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error for handling by the caller
  }
};

// Fetch a single product
export const fetchProduct = async (
  productId: string
): Promise<Product | undefined> => {
  if (MOCK) return MOCK_DATA.products.find((p) => p.product_id === productId);
  const endpoint = `${PRODUCT_URL}${productId}`;

  try {
    const response = await fetch(endpoint);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Parse the JSON response
    const data = await response.json();

    // Return the data, assuming the correct data format
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error for handling by the caller
  }
};

// Fetch analytics
export const fetchAnalytics = async (productId: string): Promise<Analytics> => {
  if (MOCK) return MOCK_DATA.analytics;
  const endpoint = `${ANALYTICS_URL}${productId}`;
  console.log('endpoint', endpoint)

  try {
    const response = await fetch(endpoint);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Parse the JSON response
    const data = await response.json();

    // Return the data, assuming the correct data format
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error for handling by the caller
  }
};

