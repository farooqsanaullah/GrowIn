import Footer from "@/components/landingpage/Footer";
import Header from "@/components/landingpage/Header";

export default function AboutPage() {
  return (
    <>
    <Header />
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4 bg-gray-50 font-montserrat">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">About GrowIn</h1>
      <p className="max-w-3xl text-lg text-gray-600 leading-relaxed mb-6">
        GrowIn is a revolutionary platform designed to bridge the gap between
        innovative startups and visionary investors. Our mission is to empower
        entrepreneurs by providing them with the resources and connections they
        need to succeed, while offering investors unique opportunities to
        discover and support the next generation of groundbreaking companies.
      </p>
      <p className="max-w-3xl text-lg text-gray-600 leading-relaxed">
        Founded in 2023, GrowIn has quickly become a trusted hub for startup
        funding and growth. We believe in fostering a collaborative ecosystem where ideas can flourish
        and investments can yield meaningful impact. Join us on our journey to
        transform the startup landscape and drive innovation forward.
      </p>
    </div>
    <Footer />
    </>
  );
}