import React from 'react';
import "./CBB_Page.css"; // Import CSS file

const BeachBazaarPage: React.FC = () => {
  return (
    <section className="wrap-3d">
      <div className="item-3d">
        <span className="ground"></span>
        <figure className="item-content group">
          <div className="item-img">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/66/Breviceps-adspersus-adspersus.jpg" alt="" />
          </div>
          <figcaption className="item-caption">
            <p>
              <strong>Rain Frog</strong><br />
              Can't Jump<br />
              Can't Swim<br />
              Only Screams<br />
            </p>
          </figcaption>
        </figure>
      </div>

      <div className="item-3d">
        <figure className="item-content group">
          <figcaption className="item-caption">
            <p>
              <strong>Price bar here</strong><br />
            </p>
          </figcaption>
        </figure>
      </div>

      <footer className="footer">
        <p> footer <a href="" target="_blank"></a></p>
      </footer>
    </section>
  );
};

export default BeachBazaarPage;
