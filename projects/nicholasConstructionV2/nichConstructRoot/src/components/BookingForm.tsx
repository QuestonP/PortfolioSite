import React, { useState, ChangeEvent, FormEvent } from 'react';

function BookingForm() {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');


  const handleFnameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFname(e.target.value);
  };
  const handleLnameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLname(e.target.value);
  };
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };
  const handleServiceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setService(e.target.value);
  };
  const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };
  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const formData = {
      name,
      email,
      phone,
      service,
      city,
      address
    };
  
    try {
      const response = await fetch('http://localhost:3000/create-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the appropriate content type
        },
        body: JSON.stringify(formData), // Convert the data to JSON
      });
  
      if (response.ok) {
        // Request was successful, do something with the response
        
      } else {
        // Handle errors
      }
    } catch (error) {
      // Handle network or request errors
      console.log(error)
    }
  };

  return (
    <div className="text-start text-xl font-poppins">
      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column">
          <div className="my-6">
            <label htmlFor="fname" className="form-label">First Name : </label>
            <input type="text" className="form-control w-[80%]" id="name" value={fname} onChange={handleFnameChange} />
          </div>
          <div className="my-6">
            <label htmlFor="lname" className="form-label ">Last Name : </label>
            <input type="text" className="form-control w-[80%]" id="name" value={lname} onChange={handleLnameChange} />
          </div>
          <div className="my-6">
            <label htmlFor="email" className="form-label">Email : </label>
            <input type="text" className="form-control w-[80%]" id="email" value={email} onChange={handleEmailChange} />
          </div>
          <div className="my-6">
            <label htmlFor="phone" className="form-label">Phone : </label>
            <input type="text" className="form-control w-[80%]" id="phone" value={phone} onChange={handlePhoneChange} />
          </div>
          <div className="my-6">
            <label htmlFor="serviceType" className="form-label">Service Type : </label>
            <input type="text" className="form-control w-[80%]" id="serviceType" value={service} onChange={handleServiceChange} />
          </div>
          <div className="my-6">
            <label htmlFor="city" className="form-label">City : </label>
            <input type="text" className="form-control w-[80%]" id="city" value={city} onChange={handleCityChange} />
          </div>
          <div className="my-6">
            <label htmlFor="streetAddress" className="form-label">Street Address : </label>
            <input type="text" className="form-control w-[80%]" id="streetAddress" value={address} onChange={handleAddressChange} />
          </div>
          <div className='text-center my-6'>
            <button type="submit" className="btn btn-primary bg-blue-500 text-white p-4 rounded hover:bg-blue-700">Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
}



export default BookingForm;
