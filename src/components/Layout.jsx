'use client';

import React from 'react';

import Navbar from './Navbar';
import Footer from './Footer';
import PWAInstaller from './PWAInstaller';
import CMSBootstrap from './CMSBootstrap';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <CMSBootstrap />
      <header>
        <Navbar />
      </header>
      <main className="main-container">{children}</main>
      <footer>
        <Footer />
      </footer>
      <PWAInstaller />
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Layout;
