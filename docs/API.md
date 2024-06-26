


# API Specification
**Version 0.1.7**

**Date: 23/04/2024**

Specifications for PriceProbe's RESTful API. All requests are GET requests unless otherwise specified.

Changelog:
- Fixed typos
- Fixed wrong desciptions

## Product
### Get Product Info
**GET**`/product/p/<product_id>`

Retrieves info about a particular product.

**Parameters**

None

**Response**
- **Status Code**: `200 OK` on success, `400 Bad Request` if invalid parameters are provided.
- **Content-Type**: `application/json`
- **Body**:
	-   `product_id`: The unique identifier of the product.
	-   `company`: The name of the company that the product belongs to.
	-   `product_name`: The name of the product.
	-   `scrape_timestamp`: The timestamp when the product information was last scraped or updated.
	-   `description`: A description of the product.
	-   `original_price`: The original price of the product.
	-   `discounted_price`: The discounted price of the product.
	-   `source_url`: The URL of the source website where the product information was obtained.
	-   `remarks`: Any additional remarks or notes about the product.
	-   `image_url`: The URL of the product's image.
	-   `tags`: An array of tags associated with the product.
   
**Example Usage:**

Command: `GET /product/p/3`
```json
{  
	"product_id":  "3",  
	"company":  "ABC-Inc",  
	"product_name":  "Cable Car Ride (Adult)",  
	"scrape_timestamp":  "2024-03-23T12:00:00Z",  
	"description":  "Experience the thrill of soaring through the skies on our cable car ride! As you embark on this aerial journey, you'll be treated to breathtaking panoramic views of the surrounding landscape.",  
	"original_price":  "18.0",
	"discounted_price":  "15.0",
	"source_url":  "https://www.abc.com/cable-car",  
	"remarks":  "",  
	"image_url":  "https://www.abc.com/images/cable-car.jpg",  
	"tags":  ["Ride",  "Cable Car", "Heights"]  
}
```

### Get Filtered Product List
**GET** `/product/filter`

Retrieves a list of products and their info, filtered by specified fields.
TODO: Combine with product range

**Parameters**
- `company`: (optional) Filter products by company name.
- `name`: (optional) Filter products that have product name that contains `name` .
- `from`: Lower bound of index to filter products, inclusive.
- `to`: Upper bound of index to filter products, inclusive.
  
**Response**
- **Status Code**: `200 OK` on success, `400 Bad Request` if invalid parameters are provided.
- **Content-Type**: `application/json`
- **Body**:
	- `products`: An array of products that match the specified filters.
 
**Example Usage:**

Command: `GET /product/filter?company=ABC-Inc&from=0&to=1`
```json
{  "products":  [ 
	{ "product_id":  "1", "company":  "ABC-Inc", ...},
	{ "product_id":  "3", "company":  "ABC-Inc", ...}
]}
```

## Analytics
### Get Product Analytics
**GET** `/analytics/p/<product_id>`

Retrieves analytics about a particular product.

**Parameters**
- `threshold`: (optional) Define threshold needed to be considered similar product. Default value provided by server.
  
**Response**
- **Status Code**: `200 OK` on success, `400 Bad Request` if invalid parameters are provided.
- **Content-Type**: `application/json`
- **Body**:
	- `prices`: An array which contains the prices of similar products (from similarity heuristic). Same length as `similar`.
 	- `product_price`: Price of the product.
  	- `rank`: An integer representing the position rank of the price compared to similar products.
	- `rank_normalized`: A number between 0 to 1 representing the interpolated percentile of price compared to similar products.
	- `similar`: An array of product IDs of similar products. Same length as `prices`. Planned to depreciate in favor of `similar_products`. 
	- `similar_products`: An array of the details similar products. Same length as `prices`.
 	- `product_name`: Name of the product.
   
**Example Usage:**

Command: `GET /analytics/p/3`
```json
{  
	"prices": [ 10.0, 12.0, 13.0, 24.5, 26.0, 40.0],
	"product_price": 25.0,
	"rank_normalized": 0.82,
	"rank": 4,
	"similar": [ 3, 5, 6, 20, 35, 49 ],
	"similar_products": [{...}, {...}, ...],
	"product_name": "Adventure Tour Visit"
}
```

## Company (DEPRECIATED)
### Get Company List
**GET** `/company/all`

Retrieves a list of all companies tracked.

**Parameters**

None

**Response**
- **Status Code**: `200 OK` on success, `400 Bad Request` if invalid parameters are provided.
- **Content-Type**: `application/json`
- **Body**:
	- `companies`: An array of company IDs.
   
**Example Usage:**

Command: `GET /company/all`
```json
{  "companies":  [  
	"ABC-Inc",
	"XYZ-leisure",
	"IRTL",
	...
]}
```

### Get Company Info (DEPRECIATED)
**GET** `/company/c/<company_id>`

Retrieves info about a particular company.

**Parameters**

None

**Response**
- **Status Code**: `200 OK` on success, `400 Bad Request` if invalid parameters are provided.
- **Content-Type**: `application/json`
- **Body**:
	- `company_id`: The unique identifier of the company.
	- `name`: The name of the company.
   
**Example Usage:**

Command: `GET /company/c/ABC-Inc`
```json
{  
	"company_id": "ABC-Inc",
	"name": "ABC Incorporated"
}
```
