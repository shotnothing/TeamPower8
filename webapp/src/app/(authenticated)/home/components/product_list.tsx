import React from 'react'
import './product_list.css'
// results from search bar
const ProductList = ({ productList}) => {
    console.log(productList)
  return (
    <div className='search-bar-results'>
        {productList.map((product, id) => {
            return <div key={id}>
              <a href={`/mflg/${product.product_id}`}>{product.product_name}</a>
              </div>
        })}
    </div>
  )
}

export default ProductList