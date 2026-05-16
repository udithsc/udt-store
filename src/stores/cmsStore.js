import { create } from 'zustand';
import { toast } from 'react-hot-toast';

const emptySettings = {
  storeName: 'UDT STORE',
  supportEmail: '',
  supportPhone: '',
  currency: 'USD',
  shippingCost: 0,
  taxRate: 0,
};

const slugify = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const requestJSON = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'CMS request failed.');
  }

  return data;
};

const useCMSStore = create((set, get) => ({
  products: [],
  banners: [],
  storeSettings: emptySettings,
  orders: [],
  isLoading: false,
  isLoaded: false,
  error: null,

  fetchCMS: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });

    try {
      const cms = await requestJSON('/api/cms');
      set({
        products: cms.products || [],
        banners: cms.banners || [],
        storeSettings: cms.storeSettings || emptySettings,
        orders: cms.orders || [],
        isLoaded: true,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false, isLoaded: true });
      toast.error(error.message);
    }
  },

  upsertProduct: async (product) => {
    try {
      const savedProduct = await requestJSON('/api/products', {
        method: 'POST',
        body: JSON.stringify(product),
      });
      const products = get().products;
      set({
        products: products.some((item) => item._id === savedProduct._id)
          ? products.map((item) => (item._id === savedProduct._id ? savedProduct : item))
          : [...products, savedProduct],
      });
      toast.success(`${savedProduct.name} saved.`);
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  },

  deleteProduct: async (productId) => {
    try {
      await requestJSON(`/api/products/${encodeURIComponent(productId)}`, { method: 'DELETE' });
      set({ products: get().products.filter((product) => product._id !== productId) });
      toast.success('Product deleted.');
    } catch (error) {
      toast.error(error.message);
    }
  },

  updateBanner: async (banner) => {
    try {
      const banners = await requestJSON('/api/banners', {
        method: 'PUT',
        body: JSON.stringify(banner),
      });
      set({ banners });
      toast.success('Homepage banner saved.');
    } catch (error) {
      toast.error(error.message);
    }
  },

  updateStoreSettings: async (settings) => {
    try {
      const storeSettings = await requestJSON('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      set({ storeSettings });
      toast.success('Store settings saved.');
    } catch (error) {
      toast.error(error.message);
    }
  },

  createOrder: async (order) => {
    const savedOrder = await requestJSON('/api/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
    set({ orders: [savedOrder, ...get().orders] });
    return savedOrder.id;
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const updatedOrder = await requestJSON(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      set({
        orders: get().orders.map((order) => (order.id === orderId ? updatedOrder : order)),
      });
    } catch (error) {
      toast.error(error.message);
    }
  },

  clearCMSData: async () => {
    try {
      const cms = await requestJSON('/api/cms', {
        method: 'POST',
        body: JSON.stringify({ action: 'clear' }),
      });
      set({
        products: cms.products || [],
        banners: cms.banners || [],
        storeSettings: cms.storeSettings || emptySettings,
        orders: cms.orders || [],
        isLoaded: true,
      });
      toast.success('CMS data cleared.');
    } catch (error) {
      toast.error(error.message);
    }
  },
}));

export { slugify };
export default useCMSStore;
