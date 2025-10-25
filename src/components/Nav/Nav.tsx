"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Upload, Menu, User, LogOut, X, Image, Sparkles, Star, Trash } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { getConfig } from '@/lib/config';

import Container from '@/components/Container';
import UploadButton from '@/components/UploadButton';

const Nav = () => {
  const { title, logo } = getConfig();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationLinks = [
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
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <Container className="flex gap-6 items-center flex-row py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex gap-2 items-center font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              { logo } { title }
            </Link>
          </div>
          
          <div className="flex flex-grow justify-end gap-4">
            {process.env.NEXT_PUBLIC_PHOTOCRATE_MODE !== 'read-only' && (
              <UploadButton>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload</span>
                </span>
              </UploadButton>
            )}
            {process.env.NEXT_PUBLIC_PHOTOCRATE_MODE === 'read-only' && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 cursor-not-allowed" aria-label="Uploading is disabled">
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline">Upload</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Uploading is Disabled</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* User Profile Dropdown */}
            {session?.user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                      {session.user.name || session.user.email}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm text-gray-500 dark:text-gray-400">
                    {session.user.email}
                  </div>
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-red-600 dark:text-red-400 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </Container>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={closeMobileMenu}>
          <div className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Link href="/" className="flex gap-2 items-center font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  { logo } { title }
                </Link>
                <button 
                  onClick={closeMobileMenu}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close mobile menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="space-y-2">
                {navigationLinks.map(({ icon, label, path }) => (
                  <Link
                    key={path}
                    href={path}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    {icon}
                    <span className="font-medium">{label}</span>
                  </Link>
                ))}
              </nav>

              {/* Mobile User Info */}
              {session?.user && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {session.user.name || 'User'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {session.user.email}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      closeMobileMenu();
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400 w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Nav;