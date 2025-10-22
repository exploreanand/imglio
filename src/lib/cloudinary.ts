import { v2 as cloudinary } from 'cloudinary';

import { CloudinaryResource } from '@/types/cloudinary';
import { getUserFolder } from '@/lib/utils';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * getResourcebyAssetId
 */
export async function getResourcebyAssetId(assetId: string) {
  try {
    // First try the resources_by_asset_ids API
    const results = await cloudinary.api.resources_by_asset_ids([assetId], {
      tags: true
    });
    return results?.resources?.[0] as unknown as CloudinaryResource;
  } catch (error) {
    // If that fails, try to find it by searching in the folder
    try {
      const folder = assetId.split('/').slice(0, -1).join('/');
      const filename = assetId.split('/').pop();
      
      const { resources } = await cloudinary.api.resources({
        type: 'upload',
        prefix: folder,
        max_results: 100,
        tags: true
      });
      
      const resource = resources.find((r: any) => r.public_id === assetId);
      return resource as unknown as CloudinaryResource;
    } catch (fallbackError) {
      return null;
    }
  }
}

/**
 * getResourcesByTag - Get resources by tag, optionally filtered by user folder
 */
export async function getResourcesByTag(tag: string, userId?: string) {
  try {
    if (userId) {
      // If userId is provided, get resources from user-specific folder and filter by tag
      const userFolder = getUserFolder(userId);
      const { resources } = await cloudinary.api.resources({
        type: 'upload',
        prefix: userFolder,
        max_results: 400,
        tags: true
      });
      
      // Filter resources by the specific tag
      const filteredResources = resources.filter((resource: any) => 
        resource.tags && resource.tags.includes(tag)
      );
      
      return {
        resources: filteredResources as unknown as Array<CloudinaryResource>
      };
    } else {
      // Fallback to original behavior for backward compatibility
      const { resources } = await cloudinary.api.resources_by_tag(tag, {
        max_results: 400,
        tags: true
      });
      return {
        resources: resources as unknown as Array<CloudinaryResource>
      };
    }
  } catch(e) {
    return {
      resources: []
    }
  }
}

/**
 * getResourcesByFolder - Get all resources in a specific folder
 */
export async function getResourcesByFolder(folder: string) {
  try {
    const { resources } = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: 400,
      tags: true
    });
    return {
      resources: resources as unknown as Array<CloudinaryResource>
    };
  } catch(e) {
    return {
      resources: []
    }
  }
}