import React from 'react'
import Header from '@/web/header';
import Footer from '@/web/footer';
import { MobileFooter } from '@/web/mobile-footer';

const Home = () => {
  return (
    <section>
        <Header/>
            <div>
              <p className="text-red p-12">hello aongkon</p>
            </div>
            <Footer/>
            {/* <div className="">
              <Footer/>
            </div>
            <div className="block md:hidden">
              <MobileFooter/>
            </div> */}
        
    </section>
    
  )
}

export default Home;