import { v2 as cloudinary } from 'cloudinary';

import { getResourcesByTag } from '@/lib/cloudinary';
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

  try {
    // Get all resources in trash for this user
    const { resources } = await getResourcesByTag('imglio-trash', session.user.id);
    
    if (resources.length === 0) {
      return Response.json({ message: 'Trash is already empty', deleted: 0 });
    }

    // Extract public IDs
    const publicIds = resources.map(resource => resource.public_id);
    
    // Permanently delete all resources
    const results = await cloudinary.api.delete_resources(publicIds);

    return Response.json({
      message: `Successfully deleted ${publicIds.length} items from trash`,
      deleted: publicIds.length,
      results
    });

  } catch (error) {
    return Response.json(
      { error: 'Failed to empty trash' },
      { status: 500 }
    );
  }
}
