import React from 'react';
import placeHolderImg1 from '../images/download.jpeg';
import placeHolderImg2 from '../images/download2.jpeg';
import placeHolderImg3 from '../images/download3.jpeg';


function fetchHeadlines(){
  
}

function Headlines() {
  return (
    <div id="carouselExampleDark" className="carousel carousel-dark slide m-0 border border-dark" data-bs-ride="carousel">
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>
      <div className="carousel-inner">

        <div className="carousel-item active align-items-center">
          <img src={placeHolderImg1} className="opacity-50 w-100" alt="..." />
          <div className="carousel-caption d-md-block">
            <h5>First slide label</h5>
            <p>Some representative placeholder content for the first slide.</p>
          </div>
        </div>
        
        <div className="carousel-item align-items-center" >
          <img src={placeHolderImg2} className="opacity-50 w-100" alt="..." />
          <div className="carousel-caption d-md-block">
            <h5>Second slide label</h5>
            <p>Some representative placeholder content for the second slide.</p>
          </div>
        </div>

        <div className="carousel-item align-items-center">
          <img src={placeHolderImg3} className="opacity-50 w-100" alt="..." />
          <div className="carousel-caption d-md-block">
            <h5>Third slide label</h5>
            <p>Some representative placeholder content for the third slide.</p>
          </div>
        </div>

      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleDark"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleDark"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default Headlines;
