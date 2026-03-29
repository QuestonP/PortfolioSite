import React from 'react'
import Newsletter from './Newsletter'
import * as constants from './constants'

function Footer() {
  return (
    <div className="w-full grid grid-cols-6 mt-5 h-[300px]" id='footer'>
      <div className='newsletter col-span-2'>
        <Newsletter />
      </div>

      <div className='col-span-2 text-center justify-center'>
        <h1 className='text-2xl font-bold'>Nicholas Construction, LLC</h1>
        <h1 className='font-bold text-2xl my-4'>Contact Us</h1>
        <ul>
          <li className='my-2 text-xl'>Phone: {constants.companyPhone}</li>
          <li className='my-2 text-xl'>Email: mail@email.com</li>
        </ul>
      </div>
      <div className='col-span-2 text-center justify-center'>
        <h1 className='text-2xl font-bold'>More Links</h1>
        <ul className=''>
          <li className='my-2 hover:font-bold text-xl'> <a href="">Home</a></li>
          <li className='my-2 hover:font-bold text-xl'><a href="">About Us</a></li>
          <li className='my-2 hover:font-bold text-xl'><a href="">Services</a></li>
          <li className='my-2 hover:font-bold text-xl'><a href="">Book A Service</a></li>
        </ul>
      </div>
    </div>
  )
}

export default Footer