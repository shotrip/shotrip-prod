import Image from 'next/image';
import Link from 'next/link';

export default function Page403() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gray-950 font-sans antialiased">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/403.png"
          alt="Densely packed penguins staring intensely at the camera"
          fill
          sizes="100vw"
          className="object-cover object-center brightness-[0.5] contrast-[1.2]"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-gray-950/40 to-gray-950" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-end p-6 pb-20 md:p-12 md:pb-32">
        <div className="text-center drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
          <p className="mb-2 text-sm font-mono tracking-[0.3em] text-red-500 uppercase md:text-base font-bold">
            Error 403 / Forbidden
          </p>

          <h2 className="mb-6 text-2xl font-black tracking-tighter text-stone-100 md:text-4xl lg:text-5xl">
            YOU SHALL NOT PASS.
          </h2>

          <p className="mx-auto mb-12 max-w-lg text-lg font-bold leading-relaxed text-gray-100 md:text-xl">
            Our security team has denied your entry.<br />
            You don&apos;t have right to access this feature.<br />
          </p>

          <Link
            href="/en"
            className="inline-block rounded-full bg-white px-12 py-4 text-lg font-black text-stone-900 shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all hover:bg-gray-100 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white"
          >
            RETURN TO HOME
          </Link>
        </div>
      </div>
    </main>
  );
}