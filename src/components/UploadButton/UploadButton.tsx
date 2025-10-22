"use client";

import { Upload } from 'lucide-react';
import { CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { useSession } from 'next-auth/react';

import { useResources } from '@/hooks/use-resources';
import { getConfig } from '@/lib/config';
import { getUserFolder } from '@/lib/utils';

import CldUploadButton from "@/components/CldUploadButton";

interface UploadButtonProps {
  children?: JSX.Element
}

const UploadButton = ({ children }: UploadButtonProps) => {
  const { data: session } = useSession();
  const { assetsTag, libraryTag } = getConfig();

  const { addResources } = useResources({
    disableFetch: true
  });

  async function handleOnSuccess(results: CloudinaryUploadWidgetResults) {
    if ( typeof results?.info === 'object' ) {
      addResources([results.info]);
    }
  }

  function handleOnError(error: any) {
    // @TODO: Toast
  }

  // Don't render upload button if no session
  if (!session?.user?.id) {
    return null;
  }

  const userFolder = getUserFolder(session.user.id);

  return (
    <CldUploadButton
      signatureEndpoint="/api/sign-cloudinary-params"
      options={{
        autoMinimize: true,
        resourceType: 'image',
        tags: [
          assetsTag,
          libraryTag,
          `user-${session.user.id}`,
        ],
        folder: userFolder
      }}
      onSuccess={handleOnSuccess}
      onError={handleOnError}
    >
      {children || (
        <span className="flex items-center">
          <Upload className="mr-2 h-4 w-4" /> Upload
        </span>
      )}
    </CldUploadButton>
  )
}

export default UploadButton;