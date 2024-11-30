import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Subject } from '@/types/subject';
import { pusherClient } from '@/lib/pusher';

export function useSubjects() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;

    // Debug connection status
    pusherClient.connection.bind('state_change', (states: any) => {
      console.log('Pusher connection status:', states.current);
    });

    const channel = pusherClient.subscribe(`private-user-${userId}`);

    // Debug channel subscription
    channel.bind('pusher:subscription_succeeded', () => {
      console.log('Successfully subscribed to private channel');
    });

    channel.bind('pusher:subscription_error', (error: any) => {
      console.error('Subscription error:', error);
    });

    channel.bind('subject-created', (newSubject: Subject) => {
      queryClient.setQueryData(['subjects'], (old: Subject[] = []) => [...old, newSubject]);
    });

    channel.bind('subject-updated', (updatedSubject: Subject) => {
      queryClient.setQueryData(['subjects'], (old: Subject[] = []) =>
        old.map(subject => 
          subject._id === updatedSubject._id ? updatedSubject : subject
        )
      );
    });

    channel.bind('subject-deleted', ({ id }: { id: string }) => {
      queryClient.setQueryData(['subjects'], (old: Subject[] = []) =>
        old.filter(subject => subject._id !== id)
      );
    });

    channel.bind('test-event', (data: any) => {
      console.log('Received test event:', data);
    });

    // Cleanup on unmount
    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`private-user-${userId}`);
    };
  }, [userId, queryClient]);

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

  // Mutations remain the same but without refetchInterval
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

  // You can add this function somewhere in your component/page
  async function testPusherConnection() {
    try {
      const response = await fetch('/api/subjects/test', {
        method: 'POST',
      });
      const data = await response.json();
      console.log('Test response:', data);
    } catch (error) {
      console.error('Test request failed:', error);
    }
  }

  return {
    subjects,
    isLoading,
    error,
    createSubject,
    updateSubject,
    deleteSubject,
  };
} 