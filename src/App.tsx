import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AutoVideo from "./components/AutoVideo";
import Solution from "./components/Solution";
import SolutionIntro from "./components/SolutionIntro";
import StandsOut from "./components/StandsOut";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Customers from "./components/Customers";
import Applications from "./components/Applications";
import Comparison from "./components/Comparison";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-svh overflow-x-clip bg-white">
      <Navbar />
      <main>
        <Hero />
        <section
          aria-label="Oxyblaster product"
          className="relative h-[62vh] w-full overflow-hidden bg-white md:h-screen"
        >
          <AutoVideo
            src="/media/scrolltrigger.mp4"
            className="h-full w-full object-contain"
          />
        </section>
        <section
          aria-label="Oxyblaster in operation"
          className="relative h-[62vh] w-full overflow-hidden bg-black md:h-screen"
        >
          <AutoVideo
            src="/media/video.mp4"
            className="h-full w-full object-cover"
          />
        </section>
        <SolutionIntro />
        <Solution />
        <StandsOut />
        <Features />
        <HowItWorks />
        <Customers />
        <Applications />
        <Comparison />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

export default App;
