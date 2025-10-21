# 📷 Imglio
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

A modern, feature-rich photo gallery application inspired by Google Photos, built with Next.js and powered by Cloudinary for seamless image management and transformation.

## ✨ Key Features

* **Smart Gallery View** - Browse all your uploaded images in an intuitive, organized interface
* **Advanced Image Viewer** - Enhanced viewing experience with AI-powered editing capabilities
* **Creative Filters & Effects** - Transform your photos with professional-grade filters
* **Digital Creations** - Generate stunning collages, animations, and color pop effects
* **Comprehensive Media Management** - Organize, tag, and manage your entire photo collection

## 🛠️ Tech Stack

Imglio is built using cutting-edge web technologies for optimal performance and user experience:

* **Next.js App Router** - Modern React framework with file-based routing
* **React Server Components** - Efficient server-side rendering for faster initial loads
* **Suspense Loading States** - Smooth, progressive loading experiences
* **Tailwind CSS** - Utility-first styling for rapid UI development
* **shadcn/ui Components** - Beautiful, accessible UI components
* **Tanstack React Query** - Powerful data fetching and state management
* **Cloudinary Integration** - Advanced image storage, optimization, and real-time transformations

## 🚀 Quick Start

### Option 1: Create from Template
```bash
npx create-next-app@latest -e https://github.com/cloudinary-community/photocrate photocrate
```

### Option 2: Manual Setup
Fork or clone this repository to get started!

### Environment Configuration
Create a `.env.local` file in your project root with your Cloudinary credentials:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="<Your Cloud Name>"
NEXT_PUBLIC_CLOUDINARY_API_KEY="<Your API Key>"
CLOUDINARY_API_SECRET="<Your API Secret>"
```

### Installation & Launch
```bash
npm install
npm run dev
```

🎉 **Success!** Your Imglio application is now running at [http://localhost:3000](http://localhost:3000)

## 📖 How to Use Imglio

### Getting Started
1. **Upload Images** - Click the upload button in the top-right corner of the library page
2. **Explore Your Gallery** - Browse through your uploaded images in the main gallery view
3. **Create & Edit** - Click on any image to access editing tools and create stunning digital art

### Smart Organization
Imglio automatically organizes your content using a sophisticated folder and tagging system:
- All images are stored in a dedicated `imglio` folder
- Images are tagged with `imglio` and prefixed tags like `imglio-creation`, `imglio-favorite`, etc.
- This keeps your Imglio content separate from other Cloudinary assets, ensuring a clean and organized experience 

## ⚙️ Configuration

Imglio comes with sensible defaults but offers extensive customization options to match your brand and preferences.

### 🎨 Brand Customization

Personalize your Imglio instance by modifying the `theme.config.tsx` file:

**Default Configuration:**
```jsx
const config = {
  title: 'Imglio',
  logo: <Focus className="w-6 h-6" />,
};
```

**Custom Configuration:**
```jsx
const config = {
  title: '<Your Custom Title>',
  logo: <YourCustomLogo />,
};
```

### 📁 Asset Organization

Imglio uses a sophisticated tagging and folder system to organize your assets and enable advanced features like favorites and trash management.

**Default Organization Settings:**
```jsx
const config = {
  assetsFolder: 'imglio',
  assetsTag: 'imglio',
  libraryTag: 'imglio-library',
  creationTag: 'imglio-creation',
  favoritesTag: 'imglio-favorite',
  trashTag: 'imglio-trash',
};
```

### Configuration Methods

You can customize these settings using either of these approaches:

#### Method 1: Configuration File
Update `theme.config.tsx` with your custom values:
```jsx
const config = {
  assetsFolder: '<Your Custom Folder>',
  assetsTag: '<Your Custom Tag>',
  libraryTag: '<Your Custom Tag>',
  creationTag: '<Your Custom Tag>',
  favoritesTag: '<Your Custom Tag>',
  trashTag: '<Your Custom Tag>',
};
```

#### Method 2: Environment Variables
Set these environment variables in your `.env.local`:
```env
NEXT_PUBLIC_CLOUDINARY_ASSETS_FOLDER="<Your Custom Folder>"
NEXT_PUBLIC_CLOUDINARY_ASSETS_TAG="<Your Custom Tag>"
NEXT_PUBLIC_CLOUDINARY_LIBRARY_TAG="<Your Custom Tag>"
NEXT_PUBLIC_CLOUDINARY_CREATION_TAG="<Your Custom Tag>"
NEXT_PUBLIC_CLOUDINARY_FAVORITES_TAG="<Your Custom Tag>"
NEXT_PUBLIC_CLOUDINARY_TRASH_TAG="<Your Custom Tag>"
```

## 🤝 Contributors

We're grateful to these amazing contributors who made Imglio possible ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/nysakiran"><img src="https://avatars.githubusercontent.com/u/placeholder?v=4?s=100" width="100px;" alt="Nysa Kiran"/><br /><sub><b>Nysa Kiran</b></sub></a><br /><a href="https://github.com/cloudinary-community/photocrate/commits?author=nysakiran" title="Code">💻</a> <a href="https://github.com/cloudinary-community/photocrate/commits?author=nysakiran" title="Documentation">📖</a> <a href="https://github.com/cloudinary-community/photocrate/commits?author=nysakiran" title="Design">🎨</a></td>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/salonibhakta"><img src="https://avatars.githubusercontent.com/u/placeholder?v=4?s=100" width="100px;" alt="Saloni Bhakta"/><br /><sub><b>Saloni Bhakta</b></sub></a><br /><a href="https://github.com/cloudinary-community/photocrate/commits?author=salonibhakta" title="Code">💻</a> <a href="https://github.com/cloudinary-community/photocrate/commits?author=salonibhakta" title="Documentation">📖</a> <a href="https://github.com/cloudinary-community/photocrate/commits?author=salonibhakta" title="Design">🎨</a></td>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/abhinavanand"><img src="https://avatars.githubusercontent.com/u/placeholder?v=4?s=100" width="100px;" alt="Abhinav Anand"/><br /><sub><b>Abhinav Anand</b></sub></a><br /><a href="https://github.com/cloudinary-community/photocrate/commits?author=abhinavanand" title="Code">💻</a> <a href="https://github.com/cloudinary-community/photocrate/commits?author=abhinavanand" title="Documentation">📖</a> <a href="https://github.com/cloudinary-community/photocrate/commits?author=abhinavanand" title="Design">🎨</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. We welcome contributions of any kind - code, documentation, design, or ideas!
