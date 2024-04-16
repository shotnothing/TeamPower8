import React from 'react';
import './alert.css';
import {variants} from './alert_variants';
import { IoWarningOutline } from "react-icons/io5";
import { AiOutlineSafety } from "react-icons/ai";
import { MdOutlineDangerous } from "react-icons/md";

const alertVariantsBySymbol: Record<string, variants> = {};
variants.forEach(variant => {
    alertVariantsBySymbol[variant.symbol] = variant;
}); // 'red', 'yellow', 'green'

const Alert: React.FC = ({rank_normalized}) => {

  const fetchAlertColour = (rank_normalized) => {
    //red - 0-10, 90-100
    //yellow - 10-25, 75-90
    //green - 25-75
    if (rank_normalized <= 0.1 || rank_normalized >= 0.9){
        return 'red';
    } else if (rank_normalized > 0.25 && rank_normalized < 0.75){
        return 'green';
    } else {
        return 'yellow';
    }
  }
  
  const variant = alertVariantsBySymbol[fetchAlertColour(rank_normalized)];
  return (

    <div className='alert-container'>
      {/* style={{ background: variant.secondaryColor }}  */}
      <div className='alert-icon'>
      {variant.symbol === 'yellow' && (
        <IoWarningOutline size={50} color={variant.secondaryColor} />
      )}
      {variant.symbol === 'green' && (
        <AiOutlineSafety size={50} color={variant.secondaryColor} />
      )}
      {variant.symbol === 'red' && (
        <MdOutlineDangerous size={50} color={variant.secondaryColor} />
      )}
      </div>
      <div className='alert-text' 
      style={{color: variant.secondaryColor}}>
        {variant.title}
      </div>
    </div>
  );
};

export default Alert;
