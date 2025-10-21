import '@/app/globals.css';
import { Image, Sparkles, Star, Trash } from 'lucide-react'

import Nav from '@/components/Nav';
import SidebarLinks from '@/components/SidebarLinks';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Nav />
      <div className="flex">
        <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
          <div className="p-6">
            <SidebarLinks
              links={[
                {
                  icon: <Image className="w-5 h-5" />,
                  label: 'Photos',
                  path: '/'
                },
                {
                  icon: <Sparkles className="w-5 h-5" />,
                  label: 'Creations',
                  path: '/creations'
                },
                {
                  icon: <Star className="w-5 h-5" />,
                  label: 'Favorites',
                  path: '/favorites'
                },
                {
                  icon: <Trash className="w-5 h-5" />,
                  label: 'Trash',
                  path: '/trash'
                },
              ]}
            />
          </div>
        </aside>
        <main className="flex-1">{ children }</main>
      </div>
    </div>
  )
}
