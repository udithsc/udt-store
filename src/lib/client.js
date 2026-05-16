export const getProducts = async () => {
  const response = await fetch('/api/products', { cache: 'no-store' });
  return response.json();
};

export const getProduct = async (slug) => {
  const response = await fetch(`/api/products/${encodeURIComponent(slug)}`, { cache: 'no-store' });
  if (!response.ok) return null;
  return response.json();
};

export const getBanners = async () => {
  const response = await fetch('/api/banners', { cache: 'no-store' });
  return response.json();
};

export const getStoreSettings = async () => {
  const response = await fetch('/api/settings', { cache: 'no-store' });
  return response.json();
};
