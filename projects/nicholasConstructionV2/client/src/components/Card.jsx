import React from 'react';

const Card = ({ title, description, imageUrl }) => {
  return (
    <div className="min-w-[20%] rounded overflow-hidden shadow-lg bg-white h-[600px] mx-3 border border-black hover:scale-105">
      <img className="w-full h-[80%] bg-white" src={require(`./assets/${imageUrl}`)} alt={title} loading='lazy' /> 
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div> 
        <p className="text-gray-700 text-base">{description}</p> 
      </div>
    </div>
  );
}

export default Card;
