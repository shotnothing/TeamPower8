import React from 'react'
import './product_list.css'
// results from search bar
const ProductList = ({ productList }) => {
    console.log(productList)
  return (
    <div className='search-bar-results'>
        {productList.map((product, id) => {
            return <div key={id}>{product.product_name}</div>
        })}
    </div>
  )
}

export default ProductList