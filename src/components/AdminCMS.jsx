'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import {
  AiOutlineBarChart,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineHome,
  AiOutlineLogout,
  AiOutlinePlus,
  AiOutlineReload,
  AiOutlineSave,
  AiOutlineShopping,
} from 'react-icons/ai';
import { emptyProduct } from '../lib/cmsDefaults';
import useCMSStore, { slugify } from '../stores/cmsStore';

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'products', label: 'Products' },
  { id: 'orders', label: 'Orders' },
  { id: 'content', label: 'Content' },
  { id: 'settings', label: 'Settings' },
];

const productFields = [
  { name: 'name', label: 'Name' },
  { name: 'slug', label: 'Slug' },
  { name: 'category', label: 'Category' },
  { name: 'price', label: 'Price', type: 'number' },
  { name: 'originalPrice', label: 'Original price', type: 'number' },
  { name: 'rating', label: 'Rating', type: 'number', step: '0.1' },
  { name: 'reviews', label: 'Reviews', type: 'number' },
];

const AdminCMS = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const products = useCMSStore((state) => state.products);
  const banners = useCMSStore((state) => state.banners);
  const orders = useCMSStore((state) => state.orders);
  const storeSettings = useCMSStore((state) => state.storeSettings);
  const upsertProduct = useCMSStore((state) => state.upsertProduct);
  const deleteProduct = useCMSStore((state) => state.deleteProduct);
  const updateBanner = useCMSStore((state) => state.updateBanner);
  const updateStoreSettings = useCMSStore((state) => state.updateStoreSettings);
  const updateOrderStatus = useCMSStore((state) => state.updateOrderStatus);
  const clearCMSData = useCMSStore((state) => state.clearCMSData);
  const fetchCMS = useCMSStore((state) => state.fetchCMS);
  const isLoaded = useCMSStore((state) => state.isLoaded);

  const [productForm, setProductForm] = useState({ ...emptyProduct, _id: `product-${Date.now()}` });
  const [bannerForm, setBannerForm] = useState(banners[0] || {});
  const [settingsForm, setSettingsForm] = useState(storeSettings);

  useEffect(() => {
    if (!isLoaded) {
      fetchCMS();
    }
  }, [fetchCMS, isLoaded]);

  useEffect(() => {
    setBannerForm(banners[0] || {});
  }, [banners]);

  useEffect(() => {
    setSettingsForm(storeSettings);
  }, [storeSettings]);

  const salesTotal = useMemo(
    () => orders.reduce((total, order) => total + Number(order.total || 0), 0),
    [orders]
  );

  const startNewProduct = () => {
    setProductForm({ ...emptyProduct, _id: `product-${Date.now()}` });
    setActiveTab('products');
  };

  const handleProductChange = (event) => {
    const { name, value, type, checked } = event.target;
    setProductForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
      slug: name === 'name' && !current.slug ? slugify(value) : current.slug,
    }));
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    const saved = await upsertProduct({
      ...productForm,
      image: String(productForm.image || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      badges: String(productForm.badges || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    });

    if (saved) {
      startNewProduct();
    }
  };

  const handleBannerSubmit = (event) => {
    event.preventDefault();
    updateBanner(bannerForm);
  };

  const handleSettingsSubmit = (event) => {
    event.preventDefault();
    updateStoreSettings(settingsForm);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const handleClearCMSData = () => {
    const shouldClear = window.confirm(
      'Clear all products, banners, settings, and orders from the CMS data store? This cannot be undone.'
    );

    if (shouldClear) {
      clearCMSData();
    }
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Products</p>
            <p className="text-3xl font-bold text-gray-900">{products.length}</p>
          </div>
          <AiOutlineShopping className="w-10 h-10 text-primary" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Orders</p>
            <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
          </div>
          <AiOutlineBarChart className="w-10 h-10 text-primary" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Sales</p>
            <p className="text-3xl font-bold text-gray-900">${salesTotal.toFixed(2)}</p>
          </div>
          <AiOutlineBarChart className="w-10 h-10 text-primary" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">CMS Control Center</h2>
            <p className="text-gray-600">
              Manage catalog items, homepage promotions, store settings, and sales orders.
            </p>
          </div>
          <button
            type="button"
            onClick={startNewProduct}
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            <AiOutlinePlus />
            Add Product
          </button>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <form
        onSubmit={handleProductSubmit}
        className="bg-white rounded-lg shadow-sm p-6 xl:col-span-1"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Product Editor</h2>
          <button type="button" onClick={startNewProduct} className="text-primary font-medium">
            New
          </button>
        </div>

        <div className="space-y-4">
          {productFields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                name={field.name}
                type={field.type || 'text'}
                step={field.step}
                value={productForm[field.name] ?? ''}
                onChange={handleProductChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image paths, comma separated
            </label>
            <input
              name="image"
              value={
                Array.isArray(productForm.image) ? productForm.image.join(', ') : productForm.image
              }
              onChange={handleProductChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Badges, comma separated
            </label>
            <input
              name="badges"
              value={
                Array.isArray(productForm.badges)
                  ? productForm.badges.join(', ')
                  : productForm.badges
              }
              onChange={handleProductChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="details"
              rows={4}
              value={productForm.details}
              onChange={handleProductChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                name="featured"
                type="checkbox"
                checked={Boolean(productForm.featured)}
                onChange={handleProductChange}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                name="inStock"
                type="checkbox"
                checked={Boolean(productForm.inStock)}
                onChange={handleProductChange}
              />
              In stock
            </label>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            <AiOutlineSave />
            Save Product
          </button>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-sm xl:col-span-2 overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Catalog</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Product</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Category</th>
                <th className="text-right p-4 text-sm font-medium text-gray-700">Price</th>
                <th className="text-right p-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="p-4">
                    <Link href={`/product/${product.slug}`} className="font-medium text-gray-900">
                      {product.name}
                    </Link>
                    <p className="text-sm text-gray-500">{product.slug}</p>
                  </td>
                  <td className="p-4 text-gray-600">{product.category}</td>
                  <td className="p-4 text-right font-semibold">
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setProductForm(product)}
                        className="p-2 text-gray-600 hover:text-primary"
                        aria-label={`Edit ${product.name}`}
                      >
                        <AiOutlineEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(product._id)}
                        className="p-2 text-gray-600 hover:text-red-600"
                        aria-label={`Delete ${product.name}`}
                      >
                        <AiOutlineDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900">Sales Orders</h2>
        <p className="text-gray-600">Orders placed from checkout appear here.</p>
      </div>
      {orders.length === 0 ? (
        <div className="p-8 text-center text-gray-600">No orders yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Order</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Customer</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Items</th>
                <th className="text-right p-4 text-sm font-medium text-gray-700">Total</th>
                <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="p-4">
                    <p className="font-semibold text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-gray-900">{order.customer?.name}</p>
                    <p className="text-sm text-gray-500">{order.customer?.email}</p>
                  </td>
                  <td className="p-4 text-gray-600">
                    {order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}
                  </td>
                  <td className="p-4 text-right font-semibold">
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option>Processing</option>
                      <option>Paid</option>
                      <option>Shipped</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderContent = () => (
    <form onSubmit={handleBannerSubmit} className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Homepage Banner</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ['smallText', 'Small text'],
          ['midText', 'Main headline'],
          ['largeText1', 'Highlighted text'],
          ['largeText2', 'Footer headline'],
          ['discount', 'Discount label'],
          ['saleTime', 'Sale time'],
          ['buttonText', 'Button text'],
          ['link', 'Button link'],
          ['product', 'Featured product slug'],
          ['image', 'Image path'],
        ].map(([name, label]) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              value={bannerForm[name] || ''}
              onChange={(event) => setBannerForm({ ...bannerForm, [name]: event.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        ))}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            rows={4}
            value={bannerForm.desc || ''}
            onChange={(event) => setBannerForm({ ...bannerForm, desc: event.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-6 inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
      >
        <AiOutlineSave />
        Save Content
      </button>
    </form>
  );

  const renderSettings = () => (
    <form onSubmit={handleSettingsSubmit} className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Store Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ['storeName', 'Store name'],
          ['supportEmail', 'Support email'],
          ['supportPhone', 'Support phone'],
          ['currency', 'Currency'],
          ['shippingCost', 'Shipping cost'],
          ['taxRate', 'Tax rate'],
        ].map(([name, label]) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              value={settingsForm[name] ?? ''}
              onChange={(event) => setSettingsForm({ ...settingsForm, [name]: event.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          <AiOutlineSave />
          Save Settings
        </button>
        <button
          type="button"
          onClick={handleClearCMSData}
          className="inline-flex items-center justify-center gap-2 border border-red-200 text-red-600 px-5 py-3 rounded-lg hover:bg-red-50 transition-colors font-semibold"
        >
          <AiOutlineReload />
          Clear CMS Data
        </button>
      </div>
    </form>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'products':
        return renderProducts();
      case 'orders':
        return renderOrders();
      case 'content':
        return renderContent();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-72 flex-col bg-gray-950 text-white">
          <div className="px-6 py-6 border-b border-white/10">
            <p className="text-xs uppercase tracking-wide text-green-300">UDT Store</p>
            <h1 className="text-2xl font-bold">Admin CMS</h1>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10 space-y-2">
            <Link
              href="/shop"
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <AiOutlineHome />
              View Store
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <AiOutlineLogout />
              Log Out
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="bg-white border-b border-gray-200">
            <div className="px-4 md:px-8 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Admin / {activeTab}</p>
                <h2 className="text-2xl font-bold text-gray-900">Commerce Management</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/shop"
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold text-center"
                >
                  View Store
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  Log Out
                </button>
              </div>
            </div>
            <div className="lg:hidden px-4 pb-4 overflow-x-auto">
              <div className="flex gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <main className="p-4 md:p-8">
            {!isLoaded ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-600">
                Loading admin data...
              </div>
            ) : (
              renderActiveTab()
            )}
          </main>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default AdminCMS;
