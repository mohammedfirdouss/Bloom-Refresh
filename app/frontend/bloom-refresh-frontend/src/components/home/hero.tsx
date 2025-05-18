"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-green-50 to-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Join Local Cleanup Events
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Discover and participate in community cleanup events. Make a difference in your neighborhood.
            </p>
          </div>
          <div className="space-x-4">
            <button
              className="bg-green-500 text-white px-6 py-3 rounded text-lg font-semibold hover:bg-green-600 transition-colors"
              onClick={() => router.push('/events')}
            >
              Find Events
            </button>
            <button
              className="border border-green-500 text-green-600 px-6 py-3 rounded text-lg font-semibold hover:bg-green-50 transition-colors"
              onClick={() => router.push('/auth/signup')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}