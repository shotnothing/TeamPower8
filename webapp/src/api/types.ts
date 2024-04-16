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
  ranking: number;
  similar: number[]
}
