import Footer from '@/components/landingpage/Footer'
import Header from '@/components/landingpage/Header'
import HeroSection from '@/components/landingpage/HeroSection'
import HowToInvest from '@/components/landingpage/HowToInvest'
import FAQs from '@/components/landingpage/FAQs'
import Testimonial from '@/components/landingpage/Testimonial'

function Home() {
  return (
    <div className='font-montserrat'>
      <Header />
      <HeroSection />
      <HowToInvest />
      <FAQs />
      <Testimonial />
      <Footer />
    </div>
  )
}

export default Home