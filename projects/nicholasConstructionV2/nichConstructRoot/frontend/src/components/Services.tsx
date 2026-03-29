import { CardCarousel } from './index';
import { outdoorProjectCards , indoorProjectCards } from '../constants/ServiceCards';

const Services = () => {
  return (
    <div className="w-full mx-2 flex flex-col content-center my-4" id='ServicesSection'>
        <h1 className="text-center  text-white text-4xl font-poppins font-bold">Services</h1>
        <div className='my-4'>
          <h1 className='text-white text-3xl font-poppins font-bold my-3'> Indoor Services : </h1>
        </div>
        <div className="w-full flex flex-row justify-between">
          <CardCarousel cards={indoorProjectCards} />
        </div>
        <div className='my-4'>
          <h1 className='text-white text-3xl font-poppins font-bold my-3'> Outdoor Services : </h1>
        </div>
        <div className="w-full flex flex-row justify-between">
          <CardCarousel cards={outdoorProjectCards} />
        </div>
      </div>
  )
}

export default Services