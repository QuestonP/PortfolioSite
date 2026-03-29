import { Navbar } from './components/Navbar';
import Footer from './components/Footer';
import plans from './components/assets/plans.png'
import './App.css'
import './script'
import CardCarousel from './components/CardCarousel';
import * as constants from './components/constants'
import add from './components/assets/add.png'

const App = () => {
  return (
    <body className='w-full h-full overflow-x-hidden overflow-y-scroll bg-white'>

    <section class="top-section full-screen-section fixed overflow-hidden my-6">
      <div className='absolute top-0 w-full m-auto'>
        <Navbar />
      </div>
      <div class="left ">
        <div className='mt-6 pt-6'></div>
        <div className='mt-6 pt-6'></div>
        <div className='mt-6 pt-6'></div>
        <h1>Nicholas Construction</h1>
        <p>
          {constants.mainSectionMessage}
        </p>
        <p>
          {constants.mainSectionMessageCont}
        </p>
      </div>
      <div class="right">
        <div className='mt-6 pt-6'></div>
        <div className='mt-6 pt-6'></div>
        <img src={plans} alt="ad" className='w-[500px] justify-center mx-auto' />
      </div>
    </section>

    <section class="full-screen-section overflow-hidden justify-center me-6">
      <h1 className='sticky'>Past Services</h1>
      <p>Here are some of the projects we've worked on for other clients.</p>
      <div className='overflow-hidden '>
        <CardCarousel cards={constants.outdoorProjectCards} />
      </div>
    </section>
    
    <section class="full-screen-section my-6">
      <h1 className='sticky'>About Us </h1>
      <p>Read a little bit about who we are.</p>
      <div className='flex flex-row justify-evenly py-4 my-4 '>
        <img src={add} alt="" className='w-[45%]' />
        <p className='w-[45%] leading-loose text-2xl my-auto'>{constants.companyBio}</p>
      </div>
    </section>
    

    <section class="full-screen-section my-6">
      <h1 className='sticky'>Meet the Team</h1>
      <p>Meet the people behind the compmany!</p>

    </section>

    <section class="relative my-6">
      <div className=' w-full m-6'>
        <Footer />
      </div>
    </section>
  </body>
  )
}

export default App