import { jsonResponse, normalizeProduct, readCMS, writeCMS } from '../../../../lib/serverCms';
import { isAdminRequest, unauthorizedResponse } from '../../../../lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(_request, { params }) {
  const { id } = await params;
  const cms = await readCMS();
  const product = cms.products.find((item) => item._id === id || item.slug === id);

  if (!product) {
    return jsonResponse({ error: 'Product not found.' }, { status: 404 });
  }

  return jsonResponse(product);
}

export async function PUT(request, { params }) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  const { id } = await params;
  const cms = await readCMS();
  const product = normalizeProduct({ ...(await request.json()), _id: id });
  const existingProduct = cms.products.find(
    (item) => item._id !== product._id && item.slug === product.slug
  );

  if (existingProduct) {
    return jsonResponse({ error: 'Another product already uses this slug.' }, { status: 409 });
  }

  const products = cms.products.some((item) => item._id === id)
    ? cms.products.map((item) => (item._id === id ? product : item))
    : [...cms.products, product];

  await writeCMS({ ...cms, products });
  return jsonResponse(product);
}

export async function DELETE(_request, { params }) {
  if (!isAdminRequest(_request)) {
    return unauthorizedResponse();
  }

  const { id } = await params;
  const cms = await readCMS();
  const products = cms.products.filter((product) => product._id !== id);

  await writeCMS({ ...cms, products });
  return jsonResponse({ ok: true });
}
