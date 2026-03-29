import styles from '../style';
import * as constants from '../constants';
import { Button, } from './index';
import Logo from '../assets/logo.png';
import someWork from '../assets/someWork.png'



const MainSection = () => {
  return (
    <section id="home" className={`flex flex-col ${styles.paddingY} mt-6 `} >
      <div id="introSection" className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6 my-6`}>
        <div className="flex flex-row w-full justify-around mx-6">
          <div className="flex flex-col justify-between">
            <div>
              <p className='text-5xl text-center font-bold font-poppins'>
                {constants.companyTitle}
              </p>
            </div>
            <div className={`flex flex-row items-center py-2 px-4 bg-discount-gradient justify-center rounded-[10px] mb-2`}>
              <p className=" text-white text-center font-bold m-2">
                {constants.contactUs}
              </p>
            </div>
            <div className="justify-between flex flex-col">
              <p className="text-4xl font-bold">
                {constants.grServ}
              </p>
              <br />
              <p className="text-4xl my-1 text-blue-400 font-bold">
                {constants.affPrice}
              </p>
            </div>
            <Button
              color="bg-blue-500 hover:bg-blue-700  border border-blue-700 w-1/4"
              text="Click Me"
            />
          </div>
          <div className="max-w-lg">
            <img src={someWork} className="w-full" alt="" />
          </div>
        </div>
      </div>
      <div id='spacer' className='my-6 py-6'>
      </div>
      <div id="AboutUsSection" className="my-6 py-6 w-screen flex flex-col my-5">
        <h1 className="text-4xl font-poppins text-center font-bold my-5">About Us</h1>
        <div className="flex flex-row justify-between mx-2">
          <div className="w-1/2 mx-2 justify-center flex flex-row">
            <img src={Logo} alt="" />
          </div>
          <div className="w-1/2 flex flex-row">
            <p className="text-center text-2xl mx-5 justify-cennter leading-loose">{constants.companyBio}</p>
          </div>
        </div>
      </div>
      <div id='spacer' className='my-6 py-6'>
      </div>
      <div id='meetTheTeamSection'>
        <h1 className="text-3xl font-poppins text-center font-bold my-5">Meet the Team</h1>
        <div className=''>
          {
          constants.teamInfo.map((team, index) => (
              <div className={`font-poppins font-normal text-2xl text-center justify-center flex flex-col
                ${index === constants.teamInfo.length - 1 ? 
                'mr-0' : 'mr-10'} mr-10`}>
                <h1 className='text-center text-3xl'>{team.title}</h1>
                <img src={team.image} alt={`image ${index}`} className='w-[600px] mx-auto' />
                <p>{team.text}</p>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MainSection;
