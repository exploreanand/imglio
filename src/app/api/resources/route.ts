import { NextRequest } from 'next/server'

import { getConfig } from '@/lib/config';
import { getResourcesByTag } from '@/lib/cloudinary';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { assetsTag } = getConfig();
  const searchParams = request.nextUrl.searchParams;
  const tag = (searchParams.get('tag') as string) || assetsTag;
  const { resources } = await getResourcesByTag(tag, session.user.id);
  
  return Response.json({
    data: resources
  });
}