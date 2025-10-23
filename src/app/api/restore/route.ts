import { v2 as cloudinary } from 'cloudinary';

import { getResourcebyAssetId } from '@/lib/cloudinary';
import { getUserFolder } from '@/lib/utils';
import { safeAuth } from '@/lib/auth-helper';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const session = await safeAuth();
  
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

  // Verify the resource belongs to the user
  const resource = await getResourcebyAssetId(publicId);
  const userFolder = getUserFolder(session.user.id);
  
  if (!resource || !resource.public_id.startsWith(userFolder)) {
    return new Response('Forbidden - Resource does not belong to user', { status: 403 });
  }

  // Restore from trash by updating tags
  const currentTags = resource.tags || [];
  const libraryTag = 'imglio-library';
  const trashTag = 'imglio-trash';
  
  // Remove from trash and add back to library
  const updatedTags = currentTags.filter(tag => tag !== trashTag);
  if (!updatedTags.includes(libraryTag)) {
    updatedTags.push(libraryTag);
  }

  const results = await cloudinary.api.update(publicId, {
    tags: updatedTags
  });

  return Response.json(results);
}
