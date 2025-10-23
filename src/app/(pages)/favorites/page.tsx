import { getConfig } from '@/lib/config';
import { getResourcesByTag } from '@/lib/cloudinary';

import MediaGallery from '@/components/MediaGallery';
import { safeAuth } from '@/lib/auth-helper';

export const revalidate = 10;

export default async function FavoritesPage() {
  const session = await safeAuth();
  
  if (!session?.user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to access your favorites
          </h1>
        </div>
      </div>
    );
  }

  const { favoritesTag } = getConfig();
  const { resources } = await getResourcesByTag(favoritesTag, session.user.id);
  
  return (
    <div className="h-full mt-6">
      <MediaGallery
        resources={resources}
        tag={favoritesTag}
      />
    </div>
  )
}