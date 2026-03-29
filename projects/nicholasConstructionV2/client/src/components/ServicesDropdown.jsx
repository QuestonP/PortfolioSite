import React, { useState } from 'react';
import * as constants from './constants'
const ServiceDropdown = () => {
  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const toggleDropdown = () => {
    setIsListOpen(!isListOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsListOpen(false);
  };

  return (
    <div className="dropdown-container">
      <label className="dropdown-label" onClick={toggleDropdown}>
        Service Type
      </label>
      {isListOpen && (
        <ul className="dropdown-options">
          {constants.servicesList.map((option) => (
            <li key={option.type} onClick={() => handleOptionClick(option.type)}>
              {option.type}
            </li>
          ))}
        </ul>
      )}
      {selectedOption && <p>You selected: {selectedOption}</p>}
    </div>
  );
};

export default ServiceDropdown;
