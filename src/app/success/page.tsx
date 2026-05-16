'use client';

import React, { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BsBagCheckFill } from 'react-icons/bs';

import useCartStore from '../../stores/cartStore';
import { runFireworks } from '../../lib/utils';

const SuccessContent = () => {
  const { clearCart } = useCartStore();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');

  useEffect(() => {
    clearCart();
    runFireworks();
  }, [clearCart]);

  return (
    <div className="success-wrapper">
      <div className="success">
        <p className="icon">
          <BsBagCheckFill />
        </p>
        <h2>Thank you for your order!</h2>
        {orderId && <p className="email-msg">Order ID: {orderId}</p>}
        <p className="email-msg">Check your email inbox for the receipt.</p>
        <p className="description">
          If you have any questions, please email
          <a className="email" href="mailto:order@example.com">
            order@example.com
          </a>
        </p>
        <Link href="/">
          <button type="button" className="btn" style={{ width: '300px' }}>
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

const Success = () => (
  <Suspense fallback={<div className="success-wrapper">Loading...</div>}>
    <SuccessContent />
  </Suspense>
);

export default Success;
