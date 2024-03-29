import React from 'react'
import './product_list.css'
// results from search bar
const ProductList = ({ results }) => {
    console.log(results)
  return (
    <div className='search-bar-results'>
        {results.map((result, id) => {
            return <div key={id}>{result.name}</div>
        })}
    </div>
  )
}

export default ProductList