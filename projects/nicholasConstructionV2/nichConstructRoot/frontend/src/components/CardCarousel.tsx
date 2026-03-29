// src/CardCarousel.tsx
import React from 'react';
import Card from './Card';

interface CardCarouselProps {
  cards: Array<{
    title: string;
    description: string;
    imageUrl: string;
  }>;
}

const CardCarousel: React.FC<CardCarouselProps> = ({ cards }) => {
  return (
    <div className="card-carousel overflow-x-scroll">
      <div className="flex justify-between w-full my-5 me-3">
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default CardCarousel;
