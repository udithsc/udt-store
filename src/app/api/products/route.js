import { jsonResponse, normalizeProduct, readCMS, writeCMS } from '../../../lib/serverCms';
import { isAdminRequest, unauthorizedResponse } from '../../../lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cms = await readCMS();
  return jsonResponse(cms.products);
}

export async function POST(request) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  const cms = await readCMS();
  const product = normalizeProduct(await request.json());
  const existingProduct = cms.products.find(
    (item) => item._id !== product._id && item.slug === product.slug
  );

  if (existingProduct) {
    return jsonResponse({ error: 'Another product already uses this slug.' }, { status: 409 });
  }

  const products = cms.products.some((item) => item._id === product._id)
    ? cms.products.map((item) => (item._id === product._id ? product : item))
    : [...cms.products, product];

  await writeCMS({ ...cms, products });
  return jsonResponse(product);
}
