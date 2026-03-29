import React from 'react'
import { useState } from 'react';
import './BookingForm.css'
import * as constants from './constants'
import arrowDown from './assets/arrowDown.png'

function BookingForm() {
    const [firstName, setFname] = useState('');
    const [lastName, setLname] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [dateOfService, setDateOfService] = useState('');
    const [desc, setDesc] = useState('')
    const [bookingConfirmation, setBookingConfirmation] = useState(0)
    const [isListOpen, setIsListOpen] = useState(false);
    const [service, setService] = useState('');
  
    const toggleDropdown = () => {
      setIsListOpen(!isListOpen);
    };
  
    const handleOptionClick = (option) => {
      setService(option);
      setIsListOpen(false);
    };
    const handleDescChange = (e) => {
      setDesc(e.target.value)
    }
    const handleFnameChange = (e) => {
      setFname(e.target.value);
    };
    const handleLnameChange = (e) => {
      setLname(e.target.value);
    };
    const handlePhoneChange = (e) => {
      setPhone(e.target.value);
    };
    const handleAddressChange = (e) => {
      setAddress(e.target.value);
    };
    const handleDateOfServiceChange = (e) => {
        setDateOfService(e.target.value);
    };


    async function bookService(event) {
        event.preventDefault()
        const response = await fetch('http://localhost:8080/create-booking',
        {
          method: 'POST',
          headers: {
            "Content-Type": 'application/json'
          },
          body: JSON.stringify(
           {
            firstName,
            lastName,
            address,
            phone,
            service,
            desc,
            dateOfService,
        }
          )
        })
    
        const data = await response.json()
        console.log(data)
        if (response.status === 200) {
          setBookingConfirmation(1)
        } else {
          setBookingConfirmation(2)
        }
      }
      return(
        <div>
          {bookingConfirmation === 0 ? (
                        <div className="text-start text-xl font-poppins">
                        <h2 className="text-4xl font-poppins font-semibold mb-4 text-center">Confirm Your Booking</h2>
                        <form onSubmit={bookService} className="">
                          <div className="d-flex flex-column">
                            <div className="my-6">
                              <label htmlFor="fname" className="form-label p-2">First Name : </label>
                              <input type="text" className="form-control w-[80%] border-2 rounded-md" id="name" value={firstName} onChange={handleFnameChange} />
                            </div>
                            <div className="my-6">
                              <label htmlFor="lname" className="form-label p-2">Last Name : </label>
                              <input type="text" className="form-control w-[80%] border-2 rounded-md" id="name" value={lastName} onChange={handleLnameChange} />
                            </div>
                            <div className="my-6">
                              <label htmlFor="streetAddress" className="form-label p-2">Street Address : </label>
                              <input type="text" className="form-control w-[80%] border-2 rounded-md" id="streetAddress" value={address} onChange={handleAddressChange} />
                            </div>
                            <div className="my-6">
                              <label htmlFor="phone" className="form-label p-2">Phone : </label>
                              <input type="text" className="form-control w-[80%] border-2 rounded-md" id="phone" value={phone} onChange={handlePhoneChange} />
                            </div>
                            <label htmlFor="streetAddress" className="form-label p-2">Date Of Service : </label>
                              <input type="text" className="form-control w-[80%] border-2 rounded-md" id="serviceDate" value={dateOfService} onChange={handleDateOfServiceChange} />
                            </div>
                            <div className="services flex mt-4">
                              <label className="dropdown-label rounded p-2 hover:bg-blue-200" onClick={toggleDropdown}>
                                Choose a Service : 
                              </label>
                              <div>
                              {isListOpen && (
                                <ul className="service-options ml-4 h-[90px] bg-blue-100 rounded p-2 overflow-scroll">
                                  {constants.servicesList.map((option) => (
                                    <li className='hover:bg-blue-400 hover:text-white rounded p-1' key={option.type} onClick={() => handleOptionClick(option.type)}>
                                      {option.type}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {service && <p className='p-2'>{service}</p>}
                              </div>
                            </div>
                            <div className="my-6">
                              <label htmlFor="description" className="form-label max-w-lg p-2">Description : </label>
                              <input type="text"
                                className="form-control flow-text w-[50rem] h-24 border-2 rounded break-words whitespace-pre-wrap"
                                id="description"
                                value={desc}
                                onChange={handleDescChange}
                              />
                            </div>
                            <div className="my-6">
                            <div className='text-center my-6'>
                              <button type="submit" className="btn btn-primary bg-blue-500 text-white p-4 rounded hover:bg-blue-700">Submit</button>
                            </div>
                          </div>
                        </form>
                      </div>
          ) : bookingConfirmation === 1 ? (
            <>
              <div className='m-auto justify-center'>
                <h1 className='text-3xl m-auto'>Booking Successful</h1>
              </div>
            </>
          ) : (
            <>
              <div className='m-auto jusitfy-center'>
                <h1 className='text-3xl m-auto'>Booking Failed... Please click close and try again!</h1>
              </div>
            </>
          )}
        </div>
      );
    }

export default BookingForm