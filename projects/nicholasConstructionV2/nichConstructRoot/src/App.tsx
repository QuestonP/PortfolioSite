import styles from './style'
import { Navbar, Services, Apply, Footer, MainSection,} from './components'




const App = () => {
  return (
    <div className='bg-white w-full overflow-hidden'>
        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
          <div className={`${styles.boxWidth}`}>
            <Navbar />
          </div>
      </div>

      <div className={`bg-white${styles.flexStart} `}>
            <div className={`${styles.boxWidth}`}>
              <MainSection />
            </div>
      </div>


      <div className={`bg-primary ${styles.paddingX} ${styles.flexStart}`}>
            <div className={`${styles.boxWidth}`}>
              <Services/>
              <Apply/> 
              <Footer/>
            </div>
          </div>
      </div>
  )
}

export default App