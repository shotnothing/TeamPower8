'use client'
import React, {useEffect} from 'react';
import './style.css';
import { IonIcon } from '@ionic/react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Link
} from "react-router-dom";
import PageA from "./productA/PageA";

const Component: React.FC = () => {
  useEffect(() => {
    const slider = document.querySelector('.slider') as HTMLElement;
    
    function activate(e: MouseEvent) {
      const items = document.querySelectorAll('.item') as NodeListOf<HTMLElement>;
      if (e.target instanceof Element) {
        if (e.target.matches('.next')) {
          slider.append(items[0]);
        } else if (e.target.matches('.prev')) {
          slider.prepend(items[items.length - 1]);
        }
      }
    }

    document.addEventListener('click', activate, false);

    return () => {
      document.removeEventListener('click', activate);
    };
  }, []);

  return (
    <main>
  <ul className="slider">
    <li
      className="item"
      style={{
        backgroundImage:
          'url("https://firstclasse.com.my/wp-content/uploads/2022/07/Central-Beach-Bazaar-Day.jpg")'
      }}
    >
      <div className="content">
        <h2 className="title">"Central Beach Bazaar"</h2>
        <p className="description">
          {" "}
          Description here
        </p>
        <Link to="\productA\page">
              <button onClick={() => navigate("/PageA")}>Only this!</button>
            </Link>
      </div>
    </li>
    <li
      className="item"
      style={{
        backgroundImage:
          'url("https://www.mountfaberleisure.com/wp-content/uploads/2023/04/Pokemon-Exterior-Harbour-2-scaled.jpg")'
      }}
    >
      <div className="content">
        <h2 className="title">"Singapore Cable Car"</h2>
        <p className="description">
          {" "}
          Description here.
        </p>
        <a href="CableCar_Page.html">
          <button>Read More</button>
        </a>
      </div>
    </li>
    <li
      className="item"
      style={{
        backgroundImage:
          'url("https://s.yimg.com/ny/api/res/1.2/82vUCc.8Bh5vOY60Ja1lew--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTM2MA--/https://s.yimg.com/os/creatr-uploaded-images/2021-11/fb7af260-42e7-11ec-aeb7-bbf878ba7ac8")'
      }}
    >
      <div className="content">
        <h2 className="title">"SkyHelix"</h2>
        <p className="description">
          {" "}
          Description here.
        </p>
        <a href="SkyHelix_Page.html">
          <button>Read More</button>
        </a>
      </div>
    </li>
    <li
      className="item"
      style={{
        backgroundImage:
          'url("https://www.mountfaberleisure.com/wp-content/uploads/2023/03/500-x-370_WOT_cleanup.png")'
      }}
    >
      <div className="content">
        <h2 className="title">"Wings Of Time"</h2>
        <p className="description">
            {" "}
            Description here.
        </p>
        <a href="WoT_Page.html">
          <button>Read More</button>
        </a>
      </div>
    </li>
    <li
      className="item"
      style={{
        backgroundImage:
          'url("https://www.creditcard99.com/photo/HSBC/16808141.jpg")'
      }}
    >
      <div className="content">
        <h2 className="title">"Singapore Island Bus Tour"</h2>
        <p className="description">
            {" "}
            Description
        </p>
        <a href="BusTour_Page.html">
          <button>Read More</button>
        </a>
      </div>
    </li>
    <li
      className="item"
      style={{
        backgroundImage:
          'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfkbOlKxnvvWwUYTpnBsIL-0WeKuFgPMCYUg&usqp=CAU")'
      }}
    >
      <div className="content">
        <h2 className="title">"Mount Faber Peak"</h2>
        <p className="description">
          {" "}
          Description here.
        </p>
        <a href="Peak_Page.html">
          <button>Read More</button>
        </a>
      </div>
    </li>
  </ul>
  <nav className="nav">
    <IonIcon className="btn prev" name="arrow-back-outline" />
    <IonIcon className="btn next" name="arrow-forward-outline" />
  </nav>
</main>

  );
};

export default Component;
