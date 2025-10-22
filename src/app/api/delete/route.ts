import { v2 as cloudinary } from 'cloudinary';

import { getResourcebyAssetId } from '@/lib/cloudinary';
import { getUserFolder } from '@/lib/utils';
import { auth } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  if ( process.env.NEXT_PUBLIC_PHOTOCRATE_MODE === 'read-only' ) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  const requestFormData = await request.formData()
  const publicId = requestFormData.get('publicId') as string;
  const permanent = requestFormData.get('permanent') === 'true'; // Check if this is a permanent delete from trash

  // Verify the resource belongs to the user
  const resource = await getResourcebyAssetId(publicId);
  const userFolder = getUserFolder(session.user.id);
  
  if (!resource || !resource.public_id.startsWith(userFolder)) {
    return new Response('Forbidden - Resource does not belong to user', { status: 403 });
  }

  if (permanent) {
    // Permanently delete from trash
    const results = await cloudinary.api.delete_resources([publicId]);
    return Response.json(results);
  } else {
    // Move to trash by updating tags
    const currentTags = resource.tags || [];
    const trashTag = 'imglio-trash';
    
    // Remove from library and add to trash
    const updatedTags = currentTags.filter(tag => tag !== 'imglio-library');
    if (!updatedTags.includes(trashTag)) {
      updatedTags.push(trashTag);
    }

    const results = await cloudinary.api.update(publicId, {
      tags: updatedTags
    });

    return Response.json(results);
  }
}