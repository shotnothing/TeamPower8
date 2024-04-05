
import React from 'react';
import { variants } from './alert_variants';

const Introduction: React.FC = () => {
  const redVariant = variants.find((variant) => variant.symbol === 'red');
  const redColor = redVariant ? redVariant.secondaryColor : '';

  const yellowVariant = variants.find((variant) => variant.symbol === 'yellow');
  const yellowColor = yellowVariant ? yellowVariant.secondaryColor : '';

  const greenVariant = variants.find((variant) => variant.symbol === 'green');
  const greenColor = greenVariant ? greenVariant.secondaryColor : '';

  return (
    <div>
      {/* <h1 className="text-3xl font-bold">Welcome to our website</h1> */}
      <p className="text-gray-700 mt-4">
        Gain valuable visibility into current landscape of MFLG product offerings juxtaposed against market rates, all at a glance with the color-coded alert system:
      </p>
      <ul>
        <li> <span style={{ color: redColor }}>Red</span>: Indicates attention required for products in the <span style={{ color: redColor }}>0-10</span> and <span style={{ color: redColor }}>90-100</span> percentile range.</li>
        <li> <span style={{ color: yellowColor }}>Yellow</span>: Signals caution for products ranking between <span style={{ color: yellowColor }}>10-25</span> and <span style={{ color: yellowColor }}>75-90</span> percentiles.</li>
        <li> <span style={{ color: greenColor }}>Green</span>: Represents products in the favorable <span style={{ color: greenColor }}>25-75</span> percentile range. </li>
      </ul>
    </div>
  );
};

export default Introduction;
