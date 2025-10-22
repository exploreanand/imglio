import { getConfig } from '@/lib/config';
import { getResourcesByTag } from '@/lib/cloudinary';

import MediaGallery from '@/components/MediaGallery';
import EmptyTrashButton from '@/components/EmptyTrashButton';
import { auth } from '@/lib/auth';

export const revalidate = 10;

export default async function TrashPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to access your trash
          </h1>
        </div>
      </div>
    );
  }

  const { trashTag } = getConfig();
  const { resources } = await getResourcesByTag(trashTag, session.user.id);
  
  return (
    <div className="h-full mt-6">
      {resources.length > 0 && (
        <div className="mb-4 flex justify-end">
          <EmptyTrashButton />
        </div>
      )}
      <MediaGallery
        resources={resources}
        tag={trashTag}
      />
    </div>
  )
}