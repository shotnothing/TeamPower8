import React from 'react';
import './alert.css';
import {variants} from './alert_variants';

// to be deleted - fake data
import productAnalytics1 from './product_analytics_1.json'
import productAnalytics2 from './product_analytics_2.json'

const alertVariantsBySymbol: Record<string, variants> = {};
variants.forEach(variant => {
    alertVariantsBySymbol[variant.symbol] = variant;
}); // 'red', 'yellow', 'green'

const Alert: React.FC = ({product_id}) => {

  const fetchAlertColour = (product_id) => {
    //red - 0-10, 90-100
    //yellow - 10-25, 75-90
    //green - 25-75
    let ranking
    if (product_id == "1") {
      ranking = productAnalytics1.ranking;
    } else {
      ranking = productAnalytics2.ranking;
    }
    if (ranking <= 0.1 && ranking && ranking >= 0.9){
        return 'red';
    } else if (ranking > 0.25 && ranking < 0.75){
        return 'green';
    } else {
        return 'yellow';
    }
  }
  
  const variant = alertVariantsBySymbol[fetchAlertColour(product_id)];
  return (

    <div className='alert-container'
      style={{ background: variant.secondaryColor }}> 
      <div className='alert-text'>
        {variant.title}
      </div>
    </div>
  );
};

export default Alert;
