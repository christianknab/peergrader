import Link from "next/link";
import AuthButton from "../components/AuthButton";
import ActionButton from "./ActionButton";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <nav className="light-grey flex justify-between items-center h-16 px-4">
        <div className="flex gap-4">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <AuthButton />
      </nav>

      <header className="flex-1 flex flex-col items-center justify-center text-center w-full px-4 py-32">
        <h1 className="text-6xl font-bold mb-24">PeerGrader</h1>
        <p className="mb-24 text-2xl">Revolutionize Grading with PeerGrader: A Modern Platform for Streamlined Feedback</p>

        <div>
          <ActionButton />
        </div>
      </header>

      <main className="flex-grow w-full px-4">

        <section className="light-grey w-full py-20">
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-bold mb-6">How it Works</h2>
            <p className="text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
          </div>
        </section>

        <section className="py-10 px-4 my-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <h2 className="text-4xl font-bold mb-6">Solution</h2>
                <p className="text-lg">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.
                </p>
              </div>
              <div className="lg:col-span-2 flex flex-col space-y-8">
                <div>
                  <h3 className="font-bold text-xl mb-2">Effortless Integration</h3>
                  <p className="text-lg">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Widespread Application</h3>
                  <p className="text-lg">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="light-blue p-8 text-foreground text-center w-full px-4">
        <p className="mb-4">&copy;2024 PeerGrader</p>
        <div className="flex gap-4 justify-center">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  );
}

