// src/app/500/page.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function Page500() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gray-950 font-sans antialiased">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/500.png"
          alt="The owner in a deep frontal dogeza"
          fill
          sizes="100vw"
          className="object-cover object-center brightness-[0.9] contrast-[1.1]"
          priority
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-start p-6 pt-16 md:p-12 md:pt-24">
        <div className="text-center">
          <div className="drop-shadow-[0_5px_15px_rgba(0,0,0,1)]">
            <p className="mb-2 text-sm font-mono tracking-[0.3em] text-red-500 uppercase md:text-base font-bold">
              Error 500 / Internal Server Error
            </p>

            <h2 className="mb-6 text-3xl font-black tracking-tighter text-white md:text-4xl lg:text-5xl">
              OUR DEEPEST <br className="hidden md:block" /> APOLOGIES.
            </h2>

            <p className="mx-auto mb-10 max-w-2xl text-lg font-bold leading-relaxed text-gray-100 md:text-xl md:leading-loose">
              Our owner is currently on the floor in a <span className="text-red-400 underline decoration-2">Dogeza</span> pose,<br className="hidden md:block" /> 
              the highest form of Japanese apology, seeking your forgiveness.<br />
              We are working hard to fix the issue.<br/>
              Thank you for youe understanding.
            </p>
          </div>

          <Link
            href="/en"
            className="inline-block rounded-full bg-white px-12 py-4 text-lg font-black text-gray-950 shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all hover:bg-gray-200 hover:scale-105 active:scale-95"
          >
            RETURN TO HOME
          </Link>
        </div>
      </div>
    </main>
  );
}