import { getConfig } from '@/lib/config';
import { getResourcesByTag } from '@/lib/cloudinary';
import { Camera, Sparkles, Star, Upload, ArrowRight, Zap, Shield, Palette } from 'lucide-react';

import MediaGallery from '@/components/MediaGallery';
import Container from '@/components/Container';
import UploadButton from '@/components/UploadButton';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';

export const revalidate = 10;

export default async function Home() {
  const session = await auth();
  
  // The middleware will handle redirecting unauthenticated users
  // This page should only be accessible to authenticated users
  if (!session?.user?.id) {
    // This should never happen due to middleware, but TypeScript needs this check
    throw new Error('Unauthorized access - middleware should have redirected');
  }
  
  const { libraryTag } = getConfig();
  const { resources } = await getResourcesByTag(libraryTag, session.user.id);
  
  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-20">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-gray-200 dark:border-gray-700">
              <Camera className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI-Powered Image Gallery</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Welcome to Imglio
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your photos with AI-powered editing, create stunning collages, and organize your memories in a beautiful, modern gallery.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {process.env.NEXT_PUBLIC_PHOTOCRATE_MODE !== 'read-only' && (
                <UploadButton>
                  <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium">
                    <Upload className="w-5 h-5" />
                    Upload Photos
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </UploadButton>
              )}
              
              <Button variant="outline" size="lg" className="px-8 py-3 rounded-full border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
                Explore Gallery
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage, edit, and share your photos with style
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/30">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI Editing</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Remove backgrounds, enhance images, and apply filters with AI</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-800/30">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Creations</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Create collages, animations, and color pop effects</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800/30">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Secure Storage</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Your photos are safely stored and optimized in the cloud</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-100 dark:border-orange-800/30">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Beautiful UI</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Modern, responsive design that looks great on any device</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Your Photo Gallery
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {resources.length > 0 
                ? `You have ${resources.length} ${resources.length === 1 ? 'photo' : 'photos'} in your gallery`
                : 'Start by uploading your first photo to see it here'
              }
            </p>
          </div>
          
          <div className="min-h-[400px]">
            <MediaGallery
              resources={resources}
              tag={libraryTag}
            />
          </div>
        </Container>
      </section>
    </div>
  )
}