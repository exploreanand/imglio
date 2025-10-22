import { getResourcebyAssetId } from '@/lib/cloudinary';

import MediaViewer from '@/components/MediaViewer';

async function Resource({ params }: { params: { assetId: string } }) {
  const { assetId } = params;
  const resource = await getResourcebyAssetId(assetId);
  
  if (!resource) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Resource Not Found</h1>
          <p className="text-gray-600">The requested resource could not be found.</p>
        </div>
      </div>
    );
  }
  
  return <MediaViewer resource={resource} />
}

export default Resource;
