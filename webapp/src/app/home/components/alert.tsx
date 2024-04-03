import React from 'react';
import styles from './AlertSymbol.module.css';
import {variants} from './alert_variants';

// to be deleted - fake data
import productAnalytics1 from './product_analytics_1.json'

const alertVariantsBySymbol: Record<string, variants> = {};
variants.forEach(variant => {
    alertVariantsBySymbol[variant.symbol] = variant;
}); // 'red', 'yellow', 'green'

const Alert: React.FC = ({product_id}) => {

  const fetchAlertColour = (product_id) => {
    //red - 0-10, 90-100
    //yellow - 10-25, 75-90
    //green - 25-75
    const ranking = productAnalytics1.ranking;
    if (ranking <= 0.1 && ranking && ranking >= 0.9){
        return 'red';
    } else if (ranking > 25 && ranking < 75){
        return 'green';
    } else {
        return 'yellow';
    }
  }
  const variant = alertVariantsBySymbol[fetchAlertColour(product_id)];

  return (
    <div className="alert-container"
    style={{
      background: variant.mainColor,
      border: "0.1rem solid " + variant.secondaryColor,
    }}>
      <div className='symbol-container'
      style={{ background: variant.secondaryColor }}> 
      <span class="material-symbols-outlined symbol">{variant.symbol}</span>{" "}
      </div>
      <div className='description-container'>
        <span className='description-title'>{variant.title}:</span>
        <span className='description-text'>{variant.text} </span>
      </div>

    </div>
  );
};

export default Alert;
