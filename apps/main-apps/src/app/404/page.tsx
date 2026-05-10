import Image from 'next/image';
import Link from 'next/link';

export default function Page404() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-sky-50 font-sans antialiased">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/404.png"
          alt="404"
          fill
          sizes="100vw"
          className="object-cover object-bottom brightness-[1.05]"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-sky-100/80 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-start p-6 pt-20 md:p-12 md:pt-32">
        <div className="text-center">
          <p className="mb-2 text-sm font-mono tracking-widest text-red-500 uppercase md:text-base font-bold">
            Error 404 / Not Found
          </p>

          <h1 className="mb-6 text-2xl font-black tracking-tighter text-stone-900 md:text-4xl lg:text-5xl lg:text-stone-100">
            NOTHING TO SEE HERE.
          </h1>

          <p className="mx-auto mb-12 max-w-lg text-lg font-bold leading-relaxed text-stone-900 md:text-xl lg:text-stone-100">
            He searched everywhere with all his might,<br />
            but the page you requested was not found.<br />
            It may be located elsewhere.
          </p>

          <Link
            href="/en"
            className="inline-block rounded-full bg-sky-600 px-10 py-4 text-lg font-black text-white shadow-lg transition-all hover:bg-sky-700 active:scale-95"
          >
            RETURN TO HOME
          </Link>
        </div>
      </div>
    </main>
  );
}