import React from 'react';
import styles from '../styles';
import * as constants from './constants';
import someWork from './assets/someWork.png';

const MainSection = () => {
  return (
    <section id="home" className={`flex flex-col ${styles.paddingY} mt-6  `}>
      <div id="introSection" className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6 my-6`}>
        <div className="flex flex-row w-full justify-around m-6">
          <div className="w-full my-6">
            <div className='flex flex-col justify-between'>
            <p className='text-3xl text-center font-bold font-poppins my-5'>
                {constants.mainSectionMessage}
              </p>
              <p className='text-5xl text-center font-bold font-poppins'>
                {constants.companyTitle}
              </p>
              <p className='text-4xl text-center font-bold font-poppins my-5 justify-center'>
                {constants.mainSectionMessageCont}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div id="AboutUsSection" className="my-6 py-6 w-screen flex flex-col">
        <h1 className="text-4xl font-poppins text-center font-bold my-6">About Us</h1>
        <div className="flex flex-row justify-between mx-2">
          <div className="w-1/2 mx-2 justify-center flex flex-row">
            <img src={someWork} alt="" style={{ width: '600px' }}  />
          </div>
          <div className="w-1/2 flex flex-row">
            <p className="text-center text-2xl mx-5 justify-center leading-loose">{constants.companyBio}</p>
          </div>
        </div>
      </div>
      <div id='spacer' className='my-6 py-6'>
      </div>
      <div id='meetTheTeamSection'>
        <h1 className="text-3xl font-poppins text-center font-bold my-5">Meet the Team</h1>
        <div className=''>
          {constants.teamInfo.map((team, index) => (
            <div className={`font-poppins font-normal text-2xl text-center justify-center flex flex-col
              ${index === constants.teamInfo.length - 1 ? 'mr-0' : 'mr-10'} mr-10`}
              key={team.id}>
              <div className='flex flex-row justify-evenly'>
              <div className='text-center w-1/2 ml-6'>
                  <p className='leading-loose'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, laborum minus eum in dolore molestias maxime unde nihil earum nam ipsa repellendus, ex ipsam nostrum, assumenda aut tempore placeat libero!</p>
                </div>
                <div className='w-1/2 my-6 mr-6'>
                <h1 className='text-center text-3xl my-1'>{team.title}</h1>
                  <img src={require(`./assets/${team.image}`)} alt={team.title} className='h-[450px] mx-auto' />
                  <p>{team.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MainSection
