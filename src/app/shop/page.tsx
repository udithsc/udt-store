import { Suspense } from 'react';
import { Layout } from '../../components';
import ShopContent from '../../components/ShopContent';

function ShopPage() {
  return (
    <Layout>
      <Suspense
        fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
        }
      >
        <ShopContent />
      </Suspense>
    </Layout>
  );
}

export default ShopPage;
