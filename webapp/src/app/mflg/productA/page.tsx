import React from 'react';
import "./style.css"; // Import CSS file

const BeachBazaarPage: React.FC = () => {
  return (
    <div className="item-3d">
  <span className="ground"></span>
  <figure className="item-content group">
    <div className="item-img">
      <img src="https://media.timeout.com/images/105911144/image.jpg" alt="" />
    </div>
    <figcaption className="item-caption">
      <p>
        <strong>Product A</strong><br />
        desc<br />
        desc<br />
        desc<br />
        desc
      </p>
    </figcaption>
  </figure>
</div>

  );
};

export default BeachBazaarPage;
