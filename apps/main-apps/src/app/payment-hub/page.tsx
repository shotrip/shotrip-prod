'use client';

import { useEffect, useRef, Suspense } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useSearchParams, useRouter } from 'next/navigation';
import { ENV } from '@/config/env';

function CheckoutRedirectHandler() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const product = searchParams.get('product');
  const router = useRouter();

  const orderIdRef = useRef<string>(crypto.randomUUID());

  useEffect(() => {

    if (status) {
      if (status === 'success') {
        const timer = setTimeout(() => {
          router.push('/lens');
        }, 3000);
        return () => clearTimeout(timer);
      }
      return;
    }
    
    const initCheckout = async () => {
      try {
        const { tokens } = await fetchAuthSession({ forceRefresh: false });
        
        if (!tokens || !tokens.idToken) {
          throw new Error("Auth Session Not Found");
        }

        const idToken = tokens.idToken;
        const sub = idToken.payload.sub;

        const res = await fetch(`${ENV.API_BASE_URL}/prepare`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken.toString()}`,
            "x-api-key": ENV.API_KEY,
          },
          body: JSON.stringify({
            user_id: sub,
            product_code: product,
            order_id: orderIdRef.current,
          })
        });

        if (!res.ok) throw new Error('Payment preparation failed');

        const { checkoutUrl } = await res.json();

        window.location.href = checkoutUrl;

      } catch (err) {
        console.error("Checkout Init Error:", err);
        alert("Oops, we hit a small snag preparing your payment. Could you please try again?");
        router.push('/lens');
      }
    };

    if (product) initCheckout();
  }, [status, product, router]);

  if (status === 'success') {
    return (
      <div className="p-8 text-center mt-24 flex flex-col items-center">
        <div className="relative mb-6">
          <div className="h-16 w-16 border-4 border-green-100 border-t-green-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Payment successful!</h2>
        <p className="mt-4 text-gray-600">Your plan has been updated. Redirecting you back shortly.</p>
        
        <button 
          onClick={() => router.push('/lens')} 
          className="mt-10 px-8 py-3 bg-black text-white rounded-lg hover:opacity-80 transition font-medium"
        >
          Back to Lens Now
        </button>
      </div>
    );
  }

  if (status === 'cancel') {
    return (
      <div className="p-8 text-center mt-20">
        <h2 className="text-2xl font-bold text-red-600">Payment cancelled.</h2>
        <button 
          onClick={() => router.push('/lens')} 
          className="mt-8 px-6 py-2 border border-black rounded-lg hover:bg-gray-50 transition"
        >
          Back to select plan
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mt-32">
      <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></div>
      <p className="mt-4 animate-pulse font-medium">Forwarding to payment page...</p>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center mt-32">
        <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></div>
        <p className="mt-4 font-medium">Loading...</p>
      </div>
    }>
      <CheckoutRedirectHandler />
    </Suspense>
  );
}