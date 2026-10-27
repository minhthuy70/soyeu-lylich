import { useState, useCallback } from 'react';

export function useOptimisticUpdate(initialData) {
  const [data, setData] = useState(initialData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const updateOptimistically = useCallback(
    async (optimisticUpdate, apiCall) => {
      // Store original data for rollback
      const originalData = data;

      // Apply optimistic update immediately
      setData(optimisticUpdate(data));
      setIsUpdating(true);
      setError(null);

      try {
        // Call the API
        const result = await apiCall();

        // Update with actual result
        setData(result);
        setIsUpdating(false);
        return result;
      } catch (err) {
        // Rollback on error
        setData(originalData);
        setError(err);
        setIsUpdating(false);
        throw err;
      }
    },
    [data]
  );

  return { data, isUpdating, error, updateOptimistically };
}

// Hook for optimistic deletion
export function useOptimisticDelete(items) {
  const [deletedItems, setDeletedItems] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const deleteOptimistically = useCallback(
    async (itemId, apiCall) => {
      // Remove item optimistically
      const updatedItems = items.filter((item) => item.id !== itemId);
      setDeletedItems([...deletedItems, itemId]);
      setIsDeleting(true);
      setError(null);

      try {
        await apiCall(itemId);
        setIsDeleting(false);
        return updatedItems;
      } catch (err) {
        // Rollback - add item back
        setDeletedItems(deletedItems.filter((id) => id !== itemId));
        setError(err);
        setIsDeleting(false);
        throw err;
      }
    },
    [items, deletedItems]
  );

  return { deletedItems, isDeleting, error, deleteOptimistically };
}

// Hook for optimistic creation
export function useOptimisticCreate() {
  const [tempItems, setTempItems] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const createOptimistically = useCallback(
    async (tempItem, apiCall) => {
      const tempId = `temp-${Date.now()}`;
      const itemWithTempId = { ...tempItem, id: tempId, isTemp: true };

      // Add item optimistically
      setTempItems([...tempItems, itemWithTempId]);
      setIsCreating(true);
      setError(null);

      try {
        const result = await apiCall(tempItem);

        // Replace temp item with real item
        setTempItems(tempItems.filter((item) => item.id !== tempId));
        setIsCreating(false);
        return result;
      } catch (err) {
        // Remove temp item on error
        setTempItems(tempItems.filter((item) => item.id !== tempId));
        setError(err);
        setIsCreating(false);
        throw err;
      }
    },
    [tempItems]
  );

  return { tempItems, isCreating, error, createOptimistically };
}
