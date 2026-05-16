import { promises as fs } from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'cms.json');

const fallbackData = {
  products: [],
  banners: [],
  storeSettings: {
    storeName: 'UDT STORE',
    supportEmail: 'support@udtstore.com',
    supportPhone: '(800) 060-0730',
    currency: 'USD',
    shippingCost: 25,
    taxRate: 0.2,
  },
  orders: [],
};

export const slugify = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const readCMS = async () => {
  try {
    const file = await fs.readFile(dataPath, 'utf8');
    return { ...fallbackData, ...JSON.parse(file) };
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
    await writeCMS(fallbackData);
    return fallbackData;
  }
};

export const writeCMS = async (data) => {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, `${JSON.stringify({ ...fallbackData, ...data }, null, 2)}\n`);
};

export const normalizeProduct = (product) => {
  const name = product.name?.trim() || 'Untitled Product';
  const images = Array.isArray(product.image)
    ? product.image
    : String(product.image || '').split(',');

  return {
    ...product,
    _id: product._id || `product-${Date.now()}`,
    name,
    slug: slugify(product.slug || name),
    price: Number(product.price) || 0,
    originalPrice:
      product.originalPrice === '' || product.originalPrice === undefined
        ? undefined
        : Number(product.originalPrice) || undefined,
    image: images.map((item) => item.trim()).filter(Boolean),
    details: product.details || '',
    featured: Boolean(product.featured),
    category: product.category || 'Accessories',
    rating: Number(product.rating) || 0,
    reviews: Number(product.reviews) || 0,
    inStock: Boolean(product.inStock),
    badges: Array.isArray(product.badges)
      ? product.badges
      : String(product.badges || '')
          .split(',')
          .map((item) => item.trim().toUpperCase())
          .filter(Boolean),
  };
};

export const jsonResponse = (body, init = {}) =>
  Response.json(body, {
    ...init,
    headers: {
      'Cache-Control': 'no-store',
      ...(init.headers || {}),
    },
  });
