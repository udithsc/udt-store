import { Layout } from '../../../components';
import ProductDetail from '../../../components/ProductDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

async function ProductPage({ params }: Props) {
  const { slug } = await params;

  return (
    <Layout>
      <ProductDetail slug={slug} />
    </Layout>
  );
}

export default ProductPage;
