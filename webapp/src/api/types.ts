export type Product = {
  product_id: string;
  company: string;
  product_name: string;
  scrape_timestamp: string;
  description: string;
  original_price: string;
  source_url: string;
  remarks: string;
  image_url: string;
  tags: string[];
};

export type Analytics = {
  prices: number[]; 
  product_price: number; 
  original_price: number; 
  discounted_price: number | null; 
  similar: number[]; 
  similar_products: Product[]; 
  product_name: string; 
  rank: number; 
  rank_normalized: number; 
}

