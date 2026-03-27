import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <section className="h-screen w-screen flex flex-col">
      <Navbar/>
      <div className="flex flex-col justify-center items-center gap-8 flex-1">
          <p className="text-2xl border p-3 pl-4 pr-4 rounded-full">Introducting RemoteOps</p>
          <div className="flex flex-col justify-center items-center gap-8">
            <div className="flex flex-col justify-center items-center gap-3">
              <p className="text-6xl text-center">
                Control Your Servers with <br /> Confidence
              </p>
              <p className="text-gray-400 text-lg">Built for developers who want speed, control, and simplicity.</p>
            </div>

            <div className="flex gap-8 justify-center">
              <button className="bg-white text-black p-2 pl-3 pr-3 rounded-md">Get Started</button>
              <button className="p-2 pl-3 pr-3 rounded-md border">Let's explore</button>
            </div>
          </div>
      </div>
    </section>
  );
}
