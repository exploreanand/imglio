import { NextRequest } from 'next/server'
import { v2 as cloudinary } from 'cloudinary';

import { getResourcebyAssetId } from '@/lib/cloudinary';
import { getUserFolder } from '@/lib/utils';
import { auth } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const requestFormData = await request.formData()
  const publicId = requestFormData.get('publicId') as string;
  const tags = (requestFormData.get('tags') as string)?.split(',');

  // Verify the resource belongs to the user
  const userFolder = getUserFolder(session.user.id);
  
  // Check if the publicId starts with the user folder
  if (!publicId.startsWith(userFolder)) {
    return new Response('Forbidden - Resource does not belong to user', { status: 403 });
  }

  try {
    const results = await cloudinary.api.update(publicId, {
      tags
    });

    return Response.json({
      data: results
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to update resource tags', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}