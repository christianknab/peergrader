import Link from "next/link";
import AuthButton from "../components/AuthButton";
import ActionButton from "./ActionButton";

const Navbar = () => (
  <nav className="lbg-white flex justify-between items-center h-16 px-4">
    <div className="flex-none ml-auto">
      <AuthButton />
    </div>
  </nav>
);

const Header = () => (
  <header className="flex flex-col items-center justify-center text-center w-full py-32 bg-gradient-to-r from-teal-400 to-blue-600">
    <h1 className="font-bold text-white mb-20" style={{ fontSize: '10rem' }}>PeerGrader</h1>
    <p className="mb-24 text-2xl font-semibold text-white">Revolutionize Grading with PeerGrader: A Modern Platform for Streamlined Feedback</p>
    <div className="flex items-center justify-center">
      <ActionButton />
    </div>
  </header>
);

const HowItWorks = () => (
  <section className="py-10">
    <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4">
      <h2 className="text-4xl font-bold mb-12 text-gray-800">How it Works</h2>
      <p className="text-lg text-gray-600">PeerGrader simplifies student assessments by allowing teachers to create courses and assignments, and enabling students to submit and receive peer feedback seamlessly.</p>
    </div>
  </section>
);

const Solution = () => (
  <section className="bg-gradient-to-r from-blue-500 to-teal-500 py-10 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <div className="lg:w-1/3 flex flex-col justify-center items-left">
          <h2 className="text-5xl font-bold mb-6 text-white">Solution</h2>
          <p className="text-xl text-white">
            PeerGrader transforms the grading process by enabling seamless peer reviews and providing a comprehensive platform for managing assignments and feedback.
          </p>
        </div>
        <div className="lg:w-2/3 flex flex-col space-y-8 justify-center">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="font-bold text-xl mb-2 text-gray-800">Effortless Integration</h3>
            <p className="text-lg text-gray-600">
              Integrate PeerGrader with your existing learning management system easily, enhancing your educational environment without any disruption.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="font-bold text-xl mb-2 text-gray-800">Widespread Application</h3>
            <p className="text-lg text-gray-600">
              Suitable for a variety of educational settings, PeerGrader adapts to both small classrooms and large online courses.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="w-full font-bold bg-white p-6 text-center">
    <p>&copy;2024 PeerGrader</p>
  </footer>
);

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <Header />
      <main className="flex-grow w-full bg-gray-50">
        <HowItWorks />
        <Solution />
      </main>
      <Footer />
    </div>
  );
}
