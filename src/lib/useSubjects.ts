import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Subject } from '@/types/subject';

export function useSubjects() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Initial fetch
  const { data: subjects, isLoading, error } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const response = await fetch('/api/subjects');
      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }
      return response.json();
    },
    enabled: !!userId, // Only fetch when user is authenticated
  });

  // Mutations
  const createSubject = useMutation({
    mutationFn: async (newSubject: Omit<Subject, '_id'>) => {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubject),
      });
      if (!response.ok) {
        throw new Error('Failed to create subject');
      }
      return response.json();
    },
  });

  const updateSubject = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Subject> }) => {
      const response = await fetch(`/api/subjects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update subject');
      }
      return response.json();
    },
  });

  const deleteSubject = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/subjects/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete subject');
      }
    },
  });

  return {
    subjects,
    isLoading,
    error,
    createSubject,
    updateSubject,
    deleteSubject,
  };
}