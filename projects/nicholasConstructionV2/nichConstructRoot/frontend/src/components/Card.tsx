import React from 'react';

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl }) => {
  return (
    <div className="min-w-[20%] rounded overflow-hidden shadow-lg bg-white my-4 mx-4">
      <img className="w-full" src={imageUrl} alt={title} /> 
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div> 
        <p className="text-gray-700 text-base">{description}</p> 
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
      </div>
    </div>
  );
}

export default Card;
