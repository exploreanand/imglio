import { Focus } from 'lucide-react';
import themeConfig from '../../theme.config';

import { PhotoboxConfig } from '@/types/config';

export function getConfig() {
  const config: PhotoboxConfig = {
    // Customization

    logo: <Focus className="w-6 h-6" />,
    title: 'Imglio',

    gallery: {
      crop: 'square'
    },

    editor: {
      // Background Removal requires the Cloudinary AI Background Removal Add-On
      backgroundRemoval: true
    },

    // Cloudinary asset management

    assetsFolder: process.env.NEXT_PUBLIC_CLOUDINARY_ASSETS_FOLDER || 'imglio',
    assetsTag: process.env.NEXT_PUBLIC_CLOUDINARY_ASSETS_TAG || 'imglio',
    libraryTag: process.env.NEXT_PUBLIC_CLOUDINARY_LIBRARY_TAG || 'imglio-library',
    creationTag: process.env.NEXT_PUBLIC_CLOUDINARY_CREATION_TAG || 'imglio-creation',
    favoritesTag: process.env.NEXT_PUBLIC_CLOUDINARY_FAVORITES_TAG || 'imglio-favorite',
    trashTag: process.env.NEXT_PUBLIC_CLOUDINARY_TRASH_TAG || 'imglio-trash',

    // Apply custom settings based on theme configuration

    ...themeConfig
  }

  return config;
}