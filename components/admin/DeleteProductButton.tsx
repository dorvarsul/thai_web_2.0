'use client';

import { deleteProduct } from '@/lib/actions/admin-products';
import { useTransition } from 'react';

type Props = {
  id: string;
};

export default function DeleteProductButton({ id }: Props) {
  // useTransition allows us to handle the server action state 
  // and keeps the UI responsive while revalidatePath runs.
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    const confirmed = window.confirm('Are you sure you want to delete this product? This action cannot be undone.');
    
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteProduct(id);
      
      if (result?.error) {
        alert(`Failed to delete: ${result.error}`);
      }
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`text-sm font-medium transition-colors ${
        isPending 
          ? 'text-gray-400 cursor-not-allowed' 
          : 'text-red-600 hover:text-red-800'
      }`}
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}