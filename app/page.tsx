import HeroSection from '@/components/landingpage/HeroSection'
import HowToInvest from '@/components/landingpage/HowToInvest'
import FAQs from '@/components/landingpage/FAQs'
import Testimonial from '@/components/landingpage/Testimonial'

function Home() {
  return (
    <div className='font-montserrat'>
     
      <HeroSection />
      <HowToInvest />
      <FAQs />
      <Testimonial />
      </div>
  )
}

export default Home