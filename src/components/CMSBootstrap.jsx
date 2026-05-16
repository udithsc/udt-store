'use client';

import { useEffect } from 'react';
import useCMSStore from '../stores/cmsStore';

const CMSBootstrap = () => {
  const fetchCMS = useCMSStore((state) => state.fetchCMS);
  const isLoaded = useCMSStore((state) => state.isLoaded);

  useEffect(() => {
    if (!isLoaded) {
      fetchCMS();
    }
  }, [fetchCMS, isLoaded]);

  return null;
};

export default CMSBootstrap;
