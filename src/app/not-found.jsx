import Image from "next/image";
import Navbar from "./(main)/_components/Navbar";

export default function Custom404() {
  return (
    <div className="max-h-screen overflow-hidden">
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 ">
        <div className="bg-white max-w-2xl mx-auto shadow-[0_0_0_1px_#ddd,0_8px_16px_rgba(0,0,0,0.1)] p-8 rounded-md font-mono">
          <div className="flex gap-10 w-full">
            <div>
              <Image
                src="/images/sad-paper-face.png"
                alt="crumpled sad face"
                className="rounded-lg"
                width={100}
                height={100}
              />
            </div>
            <div >
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                404 - Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                This page doesn’t seem to exist... maybe it got rejected?
              </p>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4 text-sm text-gray-500 space-y-2">
            <p>
              <strong>Name:</strong> Missing Page
            </p>
            <p>
              <strong>Position:</strong> Not Found
            </p>
            <p>
              <strong>Experience:</strong> 0 years on this server
            </p>
            <p>
              <strong>Status:</strong> 404 Error
            </p>
          </div>

          <div className="mt-6">
            <a
              href="/"
              className="inline-block text-blue-600 hover:underline text-sm"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
