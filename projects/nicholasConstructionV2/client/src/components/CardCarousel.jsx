// src/CardCarousel.jsx
import React from 'react';
import Card from './Card';

const CardCarousel = ({ cards }) => {
  return (
    <div className="card-carousel overflow-x-scroll w-screen px-6 my-6 py-6 me-6">
      <div className="flex justify-between w-full overflow-y-hidden py-6 pe-6">
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default CardCarousel;
