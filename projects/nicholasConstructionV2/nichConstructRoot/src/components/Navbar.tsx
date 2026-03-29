import { useState } from 'react'
import {navLinks} from '../constants'
import logo from '../assets/logo.png'
import close from '../assets/close.png'
import menu from '../assets/menu.png'
import BookingPopUp from './BookingPopUp'

const Navbar = () => {
  const [toggle, setToggle] = useState(false)
  return (
    <nav className='w-full flex py-6 stikcy top-0 z-10
    justify-between items-center navbar sticky bg-white'>
      <img src={logo} alt=""
      className='w-[200px]' />
      <ul className='list-none sm:flex hidden
      justify-end items-center flex-1'>
        {navLinks.map((nav, index) => (
          <li key={nav.id} className={`font-poppins font-normal 
          cursor-pointer text-[16px] hover:bg-blue-500 p-2 rounded hover:text-white
          ${index === navLinks.length - 1 ? 
          'mr-0' : 'mr-10'} mr-10`}>
            <a className='d-none' href={nav.link}>{nav.title}</a>
          </li>
        ))}
                  <li>
            <BookingPopUp />
          </li>
      </ul>
          {/*Below is the mobile version for smaller screen sizes  */}
      <div className='sm:hidden flex flex-1
      justify-end items-center'>
        <img src={toggle ? close : menu} 
        alt="menu" 
        className='w-[28px] h-[28px]
        object-contain'
        onClick={() => setToggle((prev) => !prev)}/>
        <div className={`${toggle ? 'flex' : 'hidden'} 
        p-6 bg-blue-400 
        absolute top-20 right-0 
        mx-4 my-2 min-w[140px] rounded-xl sidebar`}>
            <ul className='list-none flex-inline
              justify-end items-center flex-1'>
              {navLinks.map((nav, index) => (
              <li key={nav.id} className={`font-poppins font-normal 
              cursor-pointer text-[16px] text-center py-3 justify-center
              hover:bg-blue-500 w-full rounded hover:text-white
              ${index === navLinks.length - 1 ? 
              'mr-0' : 'mb-4'} mr-10`}>
              <a className='font-bold ' href="">{nav.title}</a>
            </li>
          ))}
          <li>
            <BookingPopUp />
          </li>
        </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar