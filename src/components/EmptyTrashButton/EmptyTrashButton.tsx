'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EmptyTrashButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleEmptyTrash = async () => {
    if (!confirm('Are you sure you want to permanently delete all items in trash? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/empty-trash', {
        method: 'POST',
      });
      
      if (response.ok) {
        // Refresh the page to show updated trash
        window.location.reload();
      } else {
        alert('Failed to empty trash. Please try again.');
      }
    } catch (error) {
      alert('Failed to empty trash. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleEmptyTrash}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      <Trash2 className="h-4 w-4" />
      {isLoading ? 'Emptying...' : 'Empty Trash'}
    </Button>
  );
}
